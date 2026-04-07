import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCartCount, getItemQuantity } from "../../utils/cart";

export default function UserCartSidebar() {
  // context
  const [auth] = useAuth();
  const [cart] = useCart();
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
    if (!auth?.token) {
      navigate("/login", { state: "/cart" });
      return;
    }

    setLoading(true);
    toast("Complete shipping details in checkout before paying");
    navigate("/checkout");
    setLoading(false);
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
                {loading ? "Redirecting..." : "Pay with Razorpay"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
