import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import ProductCard from "../components/cards/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/products-count");
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts([...products, ...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const arr = [...products];
  const sortedBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div className="storefront-page">
      <Jumbotron
        title="Discover Your Next Favorite Buy"
        subTitle="Fresh arrivals, trending picks, and standout deals in one polished storefront."
      />
      <div className="container-fluid storefront-shell py-4 py-md-5">
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="storefront-section">
              <div className="storefront-section__header storefront-section__header--accent">
                <p className="storefront-section__eyebrow">Fresh Picks</p>
                <h2 className="storefront-section__title">
                  New Arrivals for Independence Day
                </h2>
              </div>
              <div className="row g-4">
              {products?.map((p) => (
                <div className="col-12 col-md-6" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="storefront-section">
              <div className="storefront-section__header">
                <p className="storefront-section__eyebrow">Crowd Favorites</p>
                <h2 className="storefront-section__title">Best Sellers</h2>
              </div>
              <div className="row g-4">
              {sortedBySold?.map((p) => (
                <div className="col-12 col-md-6" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container text-center py-5">
          {products && products.length < total && (
            <button
              className="btn btn-warning btn-lg col-md-6 storefront-load-more"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
