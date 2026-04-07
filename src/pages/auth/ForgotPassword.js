import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Jumbotron from "../../components/cards/Jumbotron";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post("/forgot-password", { email });
      toast.success(
        data?.message || "If the account exists, a reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Jumbotron title="Forgot Password" />

      <div className="container-fluid page-shell py-4 py-lg-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit} className="form-panel">
              <input
                type="email"
                className="form-control mb-4 p-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                className="btn btn-primary store-pill-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
