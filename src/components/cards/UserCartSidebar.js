import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getCartCount, getItemQuantity } from "../../utils/cart";

export default function UserCartSidebar() {
  // context
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  // state
  const [loading, setLoading] = useState(false);
  // hooks
  const navigate = useNavigate();

  const cartTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * getItemQuantity(item);
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  const handleBuy = async () => {
    try {
      setLoading(true);

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Refresh and try again.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/razorpay/order", {
        cart,
      });

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "React E-commerce",
        description: `Payment for ${getCartCount(cart)} item(s)`,
        order_id: data.orderId,
        prefill: {
          name: auth?.user?.name || "",
          email: auth?.user?.email || "",
          contact: "",
        },
        notes: {
          address: auth?.user?.address || "",
        },
        theme: {
          color: "#1d62f0",
        },
        handler: async (response) => {
          try {
            await axios.post("/razorpay/verify-payment", {
              ...response,
              cart,
            });
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment successful");
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

  return (
    <div className="col-12 col-xl-4 mb-5">
      <div className="side-panel">
        <h4>Your cart summary</h4>
        Total / Address / Payments
        <hr />
        <h6>Items: {getCartCount(cart)}</h6>
        <h6>Total: {cartTotal()}</h6>
        {auth?.user?.address ? (
          <>
            <div className="mb-3">
              <hr />
              <h4>Delivery address:</h4>
              <h5>{auth?.user?.address}</h5>
            </div>
            <button
              className="btn btn-outline-warning store-pill-button"
              onClick={() => navigate("/dashboard/user/profile")}
            >
              Update address
            </button>
          </>
        ) : (
          <div className="mb-3">
            {auth?.token ? (
              <button
                className="btn btn-outline-warning store-pill-button"
                onClick={() => navigate("/dashboard/user/profile")}
              >
                Add delivery address
              </button>
            ) : (
              <button
                className="btn btn-outline-danger mt-3 store-pill-button"
                onClick={() =>
                  navigate("/login", {
                    state: "/cart",
                  })
                }
              >
                Login to checkout
              </button>
            )}
          </div>
        )}
        <div className="mt-3">
          {!cart?.length ? (
            ""
          ) : (
            <>
              <button
                onClick={() => {
                  if (!auth?.token) {
                    navigate("/login", { state: "/cart" });
                  } else {
                    navigate("/checkout");
                  }
                }}
                className="btn btn-success col-12 mt-2 store-pill-button"
                disabled={!auth?.token && loading}
              >
                Checkout with Details
              </button>
              <button
                onClick={handleBuy}
                className="btn btn-primary col-12 mt-2 store-pill-button"
                disabled={!auth?.user?.address || loading}
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
