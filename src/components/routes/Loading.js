import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingGIF from "../../images/loading.gif";

export default function Loading({ path = "register" }) {
  // state
  const [count, setCount] = useState(3);
  // hooks
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }
  }, [count, navigate, location.pathname, path]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      <img src={LoadingGIF} alt="Loading" style={{ width: "400px" }} />
    </div>
  );
}
