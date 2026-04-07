import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge } from "antd";
import {
  FaRupeeSign,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaWarehouse,
  FaRocket,
} from "react-icons/fa";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { API_BASE } from "../utils/api";
import { addProductToCart, persistCart } from "../utils/cart";
import { isWishlisted, toggleWishlist } from "../utils/wishlist";

export default function ProductView() {
  // context
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  // state
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState({
    canReview: false,
    hasReviewed: false,
    message: "Login is required to submit a review.",
  });
  // hooks
  const params = useParams();
  const saved = isWishlisted(auth, product?._id);
  const reviews = product?.reviews || [];
  const averageRating = reviews.length
    ? (
        reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : null;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await axios.get(`/product/${params.slug}`);
        setProduct(data);
        loadRelated(data._id, data.category._id);
      } catch (err) {
        console.log(err);
      }
    };

    if (params?.slug) loadProduct();
  }, [params?.slug]);

  useEffect(() => {
    const loadReviewEligibility = async () => {
      if (!auth?.token || !product?._id) {
        setReviewEligibility({
          canReview: false,
          hasReviewed: false,
          message: "Login is required to submit a review.",
        });
        return;
      }

      try {
        const { data } = await axios.get(
          `/product/${product._id}/review-eligibility`
        );
        setReviewEligibility(data);
      } catch (err) {
        console.log(err);
        setReviewEligibility({
          canReview: false,
          hasReviewed: false,
          message: "Please purchase the product and submit the feedback",
        });
      }
    };

    loadReviewEligibility();
  }, [auth?.token, product?._id]);

  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/related-products/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!auth?.token) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      setSubmittingReview(true);
      const { data } = await axios.post(`/product/${product._id}/reviews`, {
        rating,
        comment,
      });

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setProduct((current) => ({
        ...current,
        reviews: data?.reviews || [],
      }));
      setReviewEligibility((current) => ({
        ...current,
        canReview: true,
        hasReviewed: true,
        message: "You can update your review for this delivered order.",
      }));
      setComment("");
      setRating("5");
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Unable to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container-fluid page-shell page-shell--wide py-4 py-lg-5">
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card product-detail-card">
            <Badge.Ribbon text={`${product?.sold} sold`} color="red">
              <Badge.Ribbon
                text={`${
                  product?.quantity >= 1
                    ? `${product?.quantity - product?.sold} in stock`
                    : "Out of stock"
                }`}
                placement="start"
                color="green"
              >
                <div className="product-detail-card__media">
                  <img
                    className="card-img-top product-detail-card__image"
                    src={`${API_BASE}/product/photo/${product._id}`}
                    alt={product.name}
                  />
                </div>
              </Badge.Ribbon>
            </Badge.Ribbon>

            <div className="card-body product-detail-card__body">
              <p className="product-detail-card__eyebrow">
                {product?.category?.name || "Featured Product"}
              </p>
              <h1 className="fw-bold product-detail-card__title">
                {product?.name}
              </h1>
              <div className="product-detail-card__summary">
                <div className="product-detail-card__summary-price">
                  <span className="product-detail-card__summary-label">Price</span>
                  <strong>
                    <FaRupeeSign />{" "}
                    {product?.price?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </strong>
                </div>
                <div className="product-detail-card__summary-stock">
                  {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              <p className="card-text lead product-detail-card__description">
                {product?.description}
              </p>
            </div>

            <div className="product-detail-card__stats">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Reviews</span>
                    <strong>{reviews.length} {averageRating ? `(Avg ${averageRating}/5)` : ""}</strong>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Price</span>
                    <strong><FaRupeeSign /> {product?.price?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}</strong>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Category</span>
                    <strong><FaProjectDiagram /> {product?.category?.name}</strong>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Added</span>
                    <strong><FaRegClock /> {moment(product.createdAt).fromNow()}</strong>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Availability</span>
                    <strong>{product?.quantity > 0 ? <FaCheck /> : <FaTimes />}{" "}
                    {product?.quantity > 0 ? "In Stock" : "Out of Stock"}</strong>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Available</span>
                    <strong><FaWarehouse /> {product?.quantity - product?.sold}</strong>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="product-detail-card__stat">
                    <span className="product-detail-card__stat-label">Sold</span>
                    <strong><FaRocket /> {product.sold}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="product-detail-card__buttons">
              <button
                className="btn btn-outline-primary col card-button product-detail-card__button"
                onClick={() => {
                  const { nextCart, added, message } = addProductToCart(
                    cart,
                    product
                  );
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
              <button
                className={`btn col card-button product-detail-card__button ${
                  saved ? "btn-danger" : "btn-outline-secondary"
                }`}
                onClick={async () => {
                  try {
                    await toggleWishlist({
                      auth,
                      setAuth,
                      productId: product._id,
                      productName: product.name,
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
          </div>

          <div className="review-panel mt-4">
            <div className="side-panel__header">
              <p className="side-panel__eyebrow">Buyer Feedback</p>
              <h2 className="side-panel__title">Reviews</h2>
            </div>

            <form className="review-form" onSubmit={submitReview}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label review-form__label">Rating</label>
                  <select
                    className="form-control p-3"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label review-form__label">
                    Your Review
                  </label>
                  <textarea
                    className="form-control p-3"
                    rows="4"
                    placeholder="Share what you liked, how the product felt, and whether it matched expectations."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              <div className="review-form__actions">
                <button
                  type="submit"
                  className="btn btn-primary store-pill-button"
                  disabled={submittingReview || !reviewEligibility.canReview}
                >
                  {submittingReview
                    ? "Submitting..."
                    : reviewEligibility.hasReviewed
                    ? "Update Review"
                    : "Submit Review"}
                </button>
                <span className="review-form__hint">
                  {reviewEligibility.message}
                </span>
              </div>
            </form>

            <div className="review-list">
              {!reviews.length ? (
                <div className="review-card review-card--empty">
                  No reviews yet. Be the first to review this product.
                </div>
              ) : (
                reviews
                  .slice()
                  .sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )
                  .map((review) => (
                    <article className="review-card" key={review._id}>
                      <div className="review-card__header">
                        <div>
                          <h3 className="review-card__name">
                            {review?.name || review?.reviewer?.name || "Buyer"}
                          </h3>
                          <p className="review-card__meta">
                            {moment(review.createdAt).fromNow()}
                          </p>
                        </div>
                        <span className="review-card__rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="review-card__comment">{review.comment}</p>
                    </article>
                  ))
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <aside className="side-panel h-100">
            <div className="side-panel__header">
              <p className="side-panel__eyebrow">More To Explore</p>
              <h2 className="side-panel__title">Related Products</h2>
            </div>
            {related?.length < 1 && (
              <p className="side-panel__empty">Nothing found</p>
            )}
            <div className="row g-3">
              {related?.map((p) => (
                <div className="col-12" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
