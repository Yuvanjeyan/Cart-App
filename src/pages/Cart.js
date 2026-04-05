import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import Jumbotron from "../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import UserCartSidebar from "../components/cards/UserCartSidebar";
import ProductCardHorizontal from "../components/cards/ProductCardHorizontal";
import { getCartCount } from "../utils/cart";
export default function Cart() {
  // context
  const [cart] = useCart();
  const [auth] = useAuth();
  // hooks
  const navigate = useNavigate();

  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.token && auth?.user?.name}`}
        subTitle={
          cart?.length
            ? `You have ${getCartCount(cart)} item(s) in the cart. ${
                auth?.token ? "Proceed to checkout" : "Please login to checkout"
              }`
            : "Your cart is empty"
        }
      />

      <div className="container-fluid page-shell py-4">
        <div className="row">
          <div className="col-md-12">
            <div className="section-heading text-center">
              {cart?.length ? (
                "My Cart"
              ) : (
                <div className="text-center">
                  <button
                    className="btn btn-info store-pill-button"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {cart?.length && (
        <div className="container-fluid page-shell pb-5">
          <div className="row g-4">
            <div className="col-12 col-xl-8">
              <div className="row">
                {cart?.map((p, index) => (
                  <ProductCardHorizontal key={index} p={p} />
                ))}
              </div>
            </div>

            <UserCartSidebar />
          </div>
        </div>
      )}
    </>
  );
