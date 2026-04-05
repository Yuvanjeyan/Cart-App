import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("0");
  // hooks
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        role,
      });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });
        toast.success("Registration successful");
        navigate(`/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Registration failed. Try again.");
    }
  };

  return (
    <div>
      <Jumbotron title="Register" />
      <div className="container-fluid page-shell py-4 py-lg-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit} className="form-panel">
              <input
                type="text"
                className="form-control mb-4 p-3"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              <input
                type="email"
                className="form-control mb-4 p-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-4 p-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className="form-control mb-4 p-3"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="0">User</option>
                <option value="1">Admin</option>
              </select>

              <button className="btn btn-primary store-pill-button" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
