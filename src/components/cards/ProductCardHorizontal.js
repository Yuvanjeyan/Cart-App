import moment from "moment";
import toast from "react-hot-toast";
import { useCart } from "../../context/cart";
import { API_BASE } from "../../utils/api";
import {
  getAvailableStock,
  getItemQuantity,
  persistCart,
  updateProductQuantity,
} from "../../utils/cart";

export default function ProductCardHorizontal({ p, remove = true }) {
  // context
  const [cart, setCart] = useCart();

  const removeFromCart = (productId) => {
    let myCart = [...cart];
    let index = myCart.findIndex((item) => item._id === productId);
    myCart.splice(index, 1);
    persistCart(myCart, setCart);
  };

  const itemQuantity = getItemQuantity(p);
  const availableStock = getAvailableStock(p);

  const increaseQuantity = () => {
    if (itemQuantity >= availableStock) {
      toast.error(`Only ${availableStock} item(s) available`);
      return;
    }

    const nextCart = updateProductQuantity(cart, p._id, itemQuantity + 1);
    persistCart(nextCart, setCart);
  };

  const decreaseQuantity = () => {
    if (itemQuantity <= 1) {
      removeFromCart(p._id);
      return;
    }

    const nextCart = updateProductQuantity(cart, p._id, itemQuantity - 1);
    persistCart(nextCart, setCart);
  };

  return (
    <div className="card mb-3 product-card-horizontal">
      <div className="row g-0 align-items-stretch">
        <div className="col-md-4">
          <div className="product-card-horizontal__media">
            <img
              src={`${API_BASE}/product/photo/${p._id}`}
              alt={p.name}
              className="product-card-horizontal__image"
            />
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body product-card-horizontal__body">
            <h5 className="card-title product-card-horizontal__title">
              {p.name}{" "}
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </h5>
            <p className="card-text product-card-horizontal__description">{`${p?.description?.substring(
              0,
              50
            )}..`}</p>
            <div className="d-flex align-items-center gap-2 mb-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <span className="fw-bold">Qty: {itemQuantity}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={increaseQuantity}
                disabled={itemQuantity >= availableStock}
              >
                +
              </button>
            </div>
            <small className="text-muted d-block">
              Available stock: {availableStock}
            </small>
            <small className="text-muted d-block">
              Subtotal:{" "}
              {(p.price * itemQuantity).toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </small>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center product-card-horizontal__footer">
          <p className="card-text">
            <small className="text-muted">
              Listed {moment(p.createdAt).fromNow()}
            </small>
          </p>
          {remove && (
            <p
              className="text-danger mb-2 pointer"
              onClick={() => removeFromCart(p._id)}
            >
              Remove
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
