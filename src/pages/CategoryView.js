import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";

export default function CategoryView() {
  // state
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  // hooks
  const params = useParams();

  useEffect(() => {
    const loadProductsByCategory = async () => {
      try {
        const { data } = await axios.get(`/products-by-category/${params.slug}`);
        setCategory(data.category);
        setProducts(data.products);
      } catch (err) {
        console.log(err);
      }
    };

    if (params?.slug) loadProductsByCategory();
  }, [params?.slug]);

  return (
    <>
      <Jumbotron
        title={category?.name}
        subTitle={`${products?.length} products found in "${category?.name}"`}
      />

      <div className="container-fluid page-shell py-4 py-lg-5">
        <div className="row g-4">
          {products?.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-xl-4">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
