import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Jumbotron from "../../components/cards/Jumbotron";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`/reset-password/${token}`, {
        password,
      });
      toast.success(data?.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Jumbotron title="Reset Password" />

      <div className="container-fluid page-shell py-4 py-lg-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit} className="form-panel">
              <input
                type="password"
                className="form-control mb-4 p-3"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-4 p-3"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                className="btn btn-primary store-pill-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
