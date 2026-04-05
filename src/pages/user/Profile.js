import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserProfile() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth?.user) {
      const { name, email, address } = auth.user;
      setName(name);
      setEmail(email);
      setAddress(address);
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/profile", {
        name,
        password,
        address,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data });
        // local storage update
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron title={`Hello ${auth?.user?.name}`} subTitle="Dashboard" />

      <div className="container-fluid page-shell page-shell--wide py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-12 col-xl-3">
            <UserMenu />
          </div>
          <div className="col-12 col-xl-9">
            <div className="section-heading">Profile</div>

            <form onSubmit={handleSubmit} className="form-panel">
              <input
                type="text"
                className="form-control mb-3 p-3"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus={true}
              />

              <input
                type="email"
                className="form-control mb-3 p-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />

              <input
                type="password"
                className="form-control mb-3 p-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <textarea
                className="form-control mb-3 p-3"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <button className="btn btn-primary store-pill-button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
