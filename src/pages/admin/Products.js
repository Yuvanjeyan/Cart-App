import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { API_BASE } from "../../utils/api";

export default function AdminProducts() {
  // context
  const [auth] = useAuth();
  // state
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.user?.name}`}
        subTitle="Admin Dashboard"
      />

      <div className="container-fluid page-shell page-shell--wide py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-12 col-xl-3">
            <AdminMenu />
          </div>
          <div className="col-12 col-xl-9">
            <div className="section-heading">Products</div>

            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/update/${p.slug}`}
                className="text-reset"
              >
                <div className="card mb-3 admin-product-listing">
                  <div className="row g-0 align-items-stretch">
                    <div className="col-md-4">
                      <div className="admin-product-listing__media">
                        <img
                          src={`${API_BASE}/product/photo/${p._id}`}
                          alt={p.name}
                          className="admin-product-listing__image"
                        />
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="card-body admin-product-listing__body">
                        <h5 className="card-title admin-product-listing__title">{p?.name}</h5>
                        <p className="card-text admin-product-listing__description">
                          {p?.description?.substring(0, 160)}...
                        </p>
                        <p className="card-text">
                          <small className="text-muted">
                            {moment(p.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
