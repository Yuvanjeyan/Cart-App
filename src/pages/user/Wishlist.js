import { useEffect, useState } from "react";
import axios from "axios";
import Jumbotron from "../../components/cards/Jumbotron";
import ProductCard from "../../components/cards/ProductCard";
import { useAuth } from "../../context/auth";

export default function UserWishlist() {
  const [auth] = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (auth?.token) {
      loadWishlist();
    }
  }, [auth?.token]);

  const loadWishlist = async () => {
    try {
      const { data } = await axios.get("/wishlist");
      setWishlist(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron
        title="Your Wishlist"
        subTitle="Manage your wishlist"
      />

      <div className="container-fluid page-shell page-shell--wide py-4 py-lg-5">
        <div className="section-heading">Wishlist</div>

        {!wishlist.length ? (
          <div className="form-panel text-center">
            You have no saved products yet.
          </div>
        ) : (
          <div className="row g-4">
            {wishlist.map((product) => (
              <div className="col-12 col-md-6 col-xl-4" key={product._id}>
                <ProductCard p={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
