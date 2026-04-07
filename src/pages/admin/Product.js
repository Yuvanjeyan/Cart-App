import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import { Select } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function AdminProduct() {
  // context
  const [auth] = useAuth();
  // state
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("");
  // hook
  const navigate = useNavigate();

  const handleNumericChange = (setter) => (e) => {
    const sanitizedValue = e.target.value.replace(/[^\d]/g, "");
    setter(sanitizedValue);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("photo", photo);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("shipping", shipping);
      productData.append("quantity", quantity);

      const { data } = await axios.post("/product", productData);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" is created`);
        navigate("/dashboard/admin/products");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product create failed. Try again.");
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
            <div className="section-heading">Create Products</div>

            {photo && (
              <div className="product-preview-card text-center mb-4">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Product preview"
                  className="product-preview-card__image"
                />
              </div>
            )}

            <div className="form-panel">
              <div className="pt-2">
                <label className="btn btn-outline-secondary col-12 mb-3 store-pill-button">
                  {photo ? photo.name : "Upload photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              <input
                type="text"
                className="form-control p-3 mb-3"
                placeholder="Write a name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                type="text"
                className="form-control p-3 mb-3"
                placeholder="Write a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="text"
                inputMode="numeric"
                className="form-control p-3 mb-3"
                placeholder="Enter price"
                value={price}
                onChange={handleNumericChange(setPrice)}
              />

              <Select
                bordered={false}
                size="large"
                className="form-select mb-3"
                placeholder="Choose category"
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <Select
                bordered={false}
                size="large"
                className="form-select mb-3"
                placeholder="Choose shipping"
                onChange={(value) => setShipping(value)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              <input
                type="text"
                inputMode="numeric"
                className="form-control p-3 mb-3"
                placeholder="Enter quantity"
                value={quantity}
                onChange={handleNumericChange(setQuantity)}
              />

              <button
                onClick={handleSubmit}
                className="btn btn-primary store-pill-button"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
