import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import Jumbotron from "../components/cards/Jumbotron";
import ShippingForm from "../components/forms/ShippingForm";
import PaymentForm from "../components/forms/PaymentForm";
import CheckoutSummary from "../components/cards/CheckoutSummary";
import axios from "axios";
import toast from "react-hot-toast";
import { getItemQuantity } from "../utils/cart";

const SHIPPING_COST = 50; // Fixed shipping cost, can be dynamic
const TAX_RATE = 0.18; // 18% GST

export default function Checkout() {
  // Context
  const [auth] = useAuth();
  const [cart, setCart] = useCart();

  // State
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [discount] = useState(0);
  const [notes, setNotes] = useState("");

  // Hooks
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!auth?.token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
  }, [auth, cart, navigate]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * getItemQuantity(item),
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST + tax - discount;

    return {
      subtotal,
      tax,
      shippingCost: SHIPPING_COST,
      discount,
      total,
    };
  };

  const totals = calculateTotals();

  // Handle shipping form submit
  const handleShippingSubmit = async (formData) => {
    try {
      setShippingAddress(formData);
      setStep(2);
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error("Error proceeding to payment");
    }
  };

  // Handle payment form submit
  const handlePaymentSubmit = async (paymentData) => {
    try {
      setLoading(true);

      // Prepare order items
      const orderItems = cart.map((item) => ({
        product: item._id,
        quantity: getItemQuantity(item),
        price: item.price,
        name: item.name,
      }));

      // Create order on backend
      const { data } = await axios.post("/api/order/create", {
        orderItems,
        shippingAddress,
        billingAddress: shippingAddress, // Using same as shipping for now
        paymentMethod: paymentData.paymentMethod,
        shippingCost: SHIPPING_COST,
        tax: totals.tax,
        discount,
        notes,
      });

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Process payment based on method
      if (paymentData.paymentMethod === "razorpay") {
        processRazorpayPayment(data);
      } else if (paymentData.paymentMethod === "credit_card" || paymentData.paymentMethod === "debit_card") {
        // In production, integrate with payment gateway
        toast.error("Card payment gateway integration required");
        setLoading(false);
      } else if (paymentData.paymentMethod === "upi") {
        // In production, integrate with UPI gateway
        toast.error("UPI payment gateway integration required");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Error creating order");
      setLoading(false);
    }
  };

  // Process Razorpay payment
  const processRazorpayPayment = async (order) => {
    try {
      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Refresh and try again.");
        setLoading(false);
        return;
      }

      // Create Razorpay order (assuming endpoint exists)
      const { data: paymentData } = await axios.post("/razorpay/order", {
        amount: totals.total * 100, // Razorpay expects amount in paise
        orderId: order._id,
        cart,
      });

      if (paymentData?.error) {
        toast.error(paymentData.error);
        setLoading(false);
        return;
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "React E-commerce",
        description: `Order #${order._id}`,
        order_id: paymentData.orderId,
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        notes: {
          address: shippingAddress.address,
        },
        theme: {
          color: "#1d62f0",
        },
        handler: async (response) => {
          try {
            // Verify payment
            await axios.post(`/api/order/payment/${order._id}`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Clear cart
            localStorage.removeItem("cart");
            setCart([]);

            toast.success("Payment successful!");
            navigate(`/checkout/success/${order._id}`);
          } catch (err) {
            console.log(err);
            toast.error(
              err?.response?.data?.error || "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Unable to start payment");
      setLoading(false);
    }
  };

  if (!auth?.token || !cart || cart.length === 0) {
    return null;
  }

  return (
    <>
      <Jumbotron
        title={`Checkout - Step ${step} of 2`}
        subTitle={
          step === 1
            ? "Enter your shipping address"
            : "Choose payment method and complete your order"
        }
      />

      <div className="container-fluid page-shell py-5">
        <div className="row">
          <div className="col-12 col-lg-8">
            {/* Step indicator */}
            <div className="checkout-steps mb-5">
              <div className="d-flex justify-content-between">
                <div
                  className={`step-indicator ${step >= 1 ? "active" : ""}`}
                >
                  <div className="step-number">1</div>
                  <div className="step-label">Shipping</div>
                </div>
                <div className="step-line" style={{ flex: 1, borderBottom: `2px solid ${step >= 2 ? "#28a745" : "#e0e0e0"}`, margin: "20px 0" }}></div>
                <div
                  className={`step-indicator ${step >= 2 ? "active" : ""}`}
                >
                  <div className="step-number">2</div>
                  <div className="step-label">Payment</div>
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="checkout-form">
              {step === 1 ? (
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Shipping Information</h5>
                  </div>
                  <div className="card-body">
                    <ShippingForm
                      onSubmit={handleShippingSubmit}
                      initialData={{
                        firstName: auth?.user?.name?.split(" ")[0] || "",
                        lastName: auth?.user?.name?.split(" ")[1] || "",
                        email: auth?.user?.email || "",
                        address: auth?.user?.address || "",
                      }}
                      loading={loading}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Shipping Address</h5>
                    </div>
                    <div className="card-body">
                      <p className="mb-1">
                        <strong>
                          {shippingAddress?.firstName} {shippingAddress?.lastName}
                        </strong>
                      </p>
                      <p className="mb-1">{shippingAddress?.address}</p>
                      <p className="mb-1">
                        {shippingAddress?.city}, {shippingAddress?.state}{" "}
                        {shippingAddress?.postalCode}
                      </p>
                      <p className="mb-1">{shippingAddress?.country}</p>
                      <p className="mb-0 text-muted">{shippingAddress?.email}</p>
                      <button
                        className="btn btn-sm btn-outline-primary mt-3"
                        onClick={() => setStep(1)}
                      >
                        Edit Address
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Payment</h5>
                    </div>
                    <div className="card-body">
                      <PaymentForm
                        onSubmit={handlePaymentSubmit}
                        totalAmount={totals.total}
                        loading={loading}
                        userData={auth?.user}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Order Notes (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any special instructions or notes for your order"
                      disabled={loading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="col-12 col-lg-4">
            <CheckoutSummary
              orderItems={cart}
              shippingCost={totals.shippingCost}
              tax={totals.tax}
              discount={discount}
            />
          </div>
        </div>
      </div>

      <style>{`
        .checkout-steps .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 0 1 auto;
        }

        .checkout-steps .step-indicator .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .checkout-steps .step-indicator.active .step-number {
          background-color: #28a745;
          color: white;
        }

        .checkout-steps .step-label {
          font-size: 14px;
          color: #666;
        }

        .checkout-steps .step-indicator.active .step-label {
          font-weight: bold;
          color: #28a745;
        }
      `}</style>
    </>
  );
}
