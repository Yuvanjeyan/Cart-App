import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/forms/CategoryForm";
import { Modal } from "antd";

export default function AdminCategory() {
  // context
  const [auth] = useAuth();
  // state
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatingName, setUpdatingName] = useState("");

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
      const { data } = await axios.post("/category", { name });
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadCategories();
        setName("");
        toast.success(`"${data.name}" is created`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Create category failed. Try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/category/${selected._id}`, {
        name: updatingName,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" is updated`);
        setSelected(null);
        setUpdatingName("");
        loadCategories();
        setVisible(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Category may already exist. Try again.");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/category/${selected._id}`);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" is deleted`);
        setSelected(null);
        loadCategories();
        setVisible(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Category may already exist. Try again.");
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
            <div className="section-heading">Manage Categories</div>

            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleSubmit}
            />

            <hr />

            <div className="col form-panel">
              {categories?.map((c) => (
                <button
                  key={c._id}
                  className="btn btn-outline-primary m-2 store-pill-button"
                  onClick={() => {
                    setVisible(true);
                    setSelected(c);
                    setUpdatingName(c.name);
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <Modal
              visible={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <CategoryForm
                value={updatingName}
                setValue={setUpdatingName}
                handleSubmit={handleUpdate}
                buttonText="Update"
                handleDelete={handleDelete}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
