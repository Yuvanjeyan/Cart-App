import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import Search from "../forms/Search";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { getCartCount } from "../../utils/cart";

export default function Menu() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  // hooks
  const categories = useCategory();
  const navigate = useNavigate();

  // console.log("categories in menu => ", categories);

  const logout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      <nav className="store-nav sticky-top">
        <div className="store-nav__inner">
          <ul className="store-nav__links">
            <li className="nav-item">
              <NavLink className="nav-link store-nav__link" aria-current="page" to="/">
                HOME
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link store-nav__link" aria-current="page" to="/shop">
                SHOP
              </NavLink>
            </li>
            <li>
              <div className="dropdown">
                <button
                  type="button"
                  className="nav-link pointer dropdown-toggle store-nav__link"
                  data-bs-toggle="dropdown"
                >
                  CATEGORIES
                </button>

                <ul className="dropdown-menu store-nav__dropdown">
                  <li>
                    <NavLink className="nav-link" to="/categories">
                      All Categories
                    </NavLink>
                  </li>

                  {categories?.map((c) => (
                    <li key={c._id}>
                      <NavLink className="nav-link" to={`/category/${c.slug}`}>
                        {c.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="nav-item mt-1">
              <Badge
                count={getCartCount(cart)}
                offset={[-3, 8]}
                showZero={true}
              >
                <NavLink className="nav-link store-nav__link" aria-current="page" to="/cart">
                  CART
                </NavLink>
              </Badge>
            </li>
          </ul>

          <div className="store-nav__search">
            <Search />
          </div>

          {!auth?.user ? (
            <ul className="store-nav__links store-nav__links--auth">
              <li className="nav-item">
                <NavLink className="nav-link store-nav__link" to="/login">
                  LOGIN
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link store-nav__link" to="/register">
                  REGISTER
                </NavLink>
              </li>
            </ul>
          ) : (
            <div className="d-flex align-items-center gap-2">
              {auth?.user?.role !== 1 && (
                <NavLink
                  className="nav-link store-nav__link"
                  to="/wishlist"
                >
                  WISHLIST
                </NavLink>
              )}

              <div className="dropdown store-nav__user">
                <button
                  type="button"
                  className="nav-link pointer dropdown-toggle store-nav__link"
                  data-bs-toggle="dropdown"
                >
                  {auth?.user?.name?.toUpperCase()}
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      className="nav-link"
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item pointer">
                    <button
                      type="button"
                      onClick={logout}
                      className="nav-link btn btn-link p-0"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
