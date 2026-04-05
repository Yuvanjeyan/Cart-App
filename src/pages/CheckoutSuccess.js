import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.token) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/order/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.log(err);
        toast.error("Order not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, auth?.token, navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
      </div>
    );
  }

  const formatPrice = (price) => {
    return parseFloat(price || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  return (
    <>
      <Jumbotron
        title="Order Confirmation"
        subTitle="Your order has been placed successfully"
      />

      <div className="container-fluid page-shell py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Success Message */}
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <div className="text-center">
                <i className="fas fa-check-circle fs-1 text-success mb-3"></i>
                <h4 className="alert-heading">Payment Successful!</h4>
                <p>
                  Thank you for your order. We've received your payment and are
                  preparing your items for shipment.
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Details</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Order ID:</strong>
                    </p>
                    <p className="text-muted">{order._id}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Order Date:</strong>
                    </p>
                    <p className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Status:</strong>
                    </p>
                    <p className="text-muted">
                      <span className="badge bg-info">{order.status}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Payment Status:</strong>
                    </p>
                    <p className="text-muted">
                      <span className="badge bg-success">
                        {order.payment?.status || "completed"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                <p className="mb-1">
                  <strong>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </strong>
                </p>
                <p className="mb-1">{order.shippingAddress.address}</p>
                <p className="mb-1">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="mb-1">{order.shippingAddress.country}</p>
                <p className="mb-0 text-muted">
                  {order.shippingAddress.email}
                </p>
                <p className="text-muted">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Items</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="text-end">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {item.product?.name || "Product"}
                          </td>
                          <td className="text-end">{formatPrice(item.price)}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>
                    {formatPrice(
                      order.totalAmount -
                        order.shippingCost -
                        order.tax +
                        order.discount
                    )}
                  </span>
                </div>

                {order.shippingCost > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>{formatPrice(order.shippingCost)}</span>
                  </div>
                )}

                {order.tax > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (GST):</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}

                {order.discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-danger">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between">
                  <h6 className="mb-0">
                    <strong>Total Amount:</strong>
                  </h6>
                  <h6 className="mb-0 text-primary">
                    <strong>{formatPrice(order.totalAmount)}</strong>
                  </h6>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Order Notes</h5>
                </div>
                <div className="card-body">
                  <p>{order.notes}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-2 mb-4">
              <button
                className="btn btn-primary flex-grow-1"
                onClick={() => navigate("/dashboard/user/orders")}
              >
                View My Orders
              </button>
              <button
                className="btn btn-outline-primary flex-grow-1"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>

            {/* Important Info */}
            <div className="alert alert-info" role="alert">
              <h6 className="alert-heading">What's Next?</h6>
              <ul className="mb-0">
                <li>
                  A confirmation email has been sent to{" "}
                  <strong>{order.shippingAddress.email}</strong>
                </li>
                <li>You can track your order from the "My Orders" section</li>
                <li>
                  Expected delivery within 3-5 business days to{" "}
                  <strong>{order.shippingAddress.city}</strong>
                </li>
                <li>
                  For any queries, contact us at support@ecommerce.com or call
                  1-800-SHOP-NOW
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
