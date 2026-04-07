import { Badge } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import { API_BASE } from "../../utils/api";
import { addProductToCart, persistCart } from "../../utils/cart";
import { isWishlisted, toggleWishlist } from "../../utils/wishlist";

export default function ProductCard({ p }) {
  // context
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  // hooks
  const navigate = useNavigate();
  const saved = isWishlisted(auth, p?._id);

  return (
    <div className="card mb-3 hoverable product-card h-100">
      <Badge.Ribbon text={`${p?.sold} sold`} color="red">
        <Badge.Ribbon
          text={`${
            p?.quantity >= 1
              ? `${p?.quantity - p?.sold} in stock`
            : "Out of stock"
          }`}
            placement="start"
            color="green"
        >
          <button
            type="button"
            className="product-card__media product-card__media-button"
            onClick={() => navigate(`/product/${p.slug}`)}
            aria-label={`Open ${p?.name}`}
          >
            <img
              className="card-img-top product-card__image"
              src={`${API_BASE}/product/photo/${p._id}`}
              alt={p.name}
            />
          </button>
        </Badge.Ribbon>
      </Badge.Ribbon>

      <div className="card-body product-card__body">
        <h5 className="product-card__title">{p?.name}</h5>

        <h4 className="fw-bold product-card__price">
          {p?.price?.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })}
        </h4>

        <p className="card-text product-card__description">
          {p?.description?.substring(0, 60)}...
        </p>
      </div>

      <div className="d-flex justify-content-between product-card__actions">
        <button
          className="btn btn-outline-primary col card-button"
          onClick={() => {
            const { nextCart, added, message } = addProductToCart(cart, p);
            if (added) {
              persistCart(nextCart, setCart);
              toast.success(message);
            } else {
              toast.error(message);
            }
          }}
        >
          Add to Cart
        </button>
      </div>

      <div className="product-card__wishlist">
        <button
          className={`btn col-12 store-pill-button ${
            saved ? "btn-danger" : "btn-outline-secondary"
          }`}
          onClick={async () => {
            try {
              await toggleWishlist({
                auth,
                setAuth,
                productId: p._id,
                productName: p.name,
              });
            } catch (err) {
              console.log(err);
              toast.error("Unable to update wishlist");
            }
          }}
        >
          {saved ? "Remove from Wishlist" : "Save to Wishlist"}
        </button>
      </div>

      {/* <p>{moment(p.createdAt).fromNow()}</p>
      <p>{p.sold} sold</p> */}
    </div>
  );
}
