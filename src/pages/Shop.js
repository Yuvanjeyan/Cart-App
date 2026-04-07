import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import ProductCard from "../components/cards/ProductCard";
import { Checkbox, Radio } from "antd";
import { prices } from "../prices";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]); // categories
  const [radio, setRadio] = useState([]); // radio

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get("/products");
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!checked.length && !radio.length) loadProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    const loadFilteredProducts = async () => {
      try {
        const { data } = await axios.post("/filtered-products", {
          checked,
          radio,
        });
        console.log("filtered products => ", data);
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (checked.length || radio.length) loadFilteredProducts();
  }, [checked, radio]);


  useEffect(() => {
    const loadCatgories = async () => {
      try {
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadCatgories();
  }, []);

  const handleCheck = (value, id) => {
    console.log(value, id);
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  return (
    <>
      <Jumbotron
        title="Shop All Products"
        subTitle="Filter by category and budget to find the right product faster."
      />

      <div className="container-fluid page-shell page-shell--wide py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-12 col-xl-3">
            <aside className="side-panel">
              <div className="side-panel__header">
                <p className="side-panel__eyebrow">Smart Filters</p>
                <h2 className="side-panel__title">Filter by Categories</h2>
              </div>
              <div className="filter-group">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}
              </div>

              <div className="side-panel__header mt-4">
                <p className="side-panel__eyebrow">Budget First</p>
                <h2 className="side-panel__title">Filter by Price</h2>
              </div>
              <div className="filter-group">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {prices?.map((p) => (
                  <div key={p._id} className="filter-option">
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
              </div>

              <div className="pt-2">
              <button
                className="btn btn-outline-secondary col-12 store-pill-button"
                onClick={() => {
                  setChecked([]);
                  setRadio([]);
                }}
              >
                Reset
              </button>
              </div>
            </aside>
          </div>

          <div className="col-12 col-xl-9">
            <section className="storefront-section storefront-section--full">
              <div className="storefront-section__header">
                <p className="storefront-section__eyebrow">Browse Catalog</p>
                <h2 className="storefront-section__title">
                  {products?.length} Products
                </h2>
              </div>

              <div className="row g-4">
              {products?.map((p) => (
                <div className="col-12 col-md-6 col-xl-4" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
