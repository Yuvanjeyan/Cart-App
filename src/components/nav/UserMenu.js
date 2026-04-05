import { NavLink } from "react-router-dom";

export default function UserMenu() {
  return (
    <>
      <div className="side-menu">
        <div className="section-heading mb-3">User Links</div>

        <ul className="list-group list-unstyled side-menu__list">
          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/user/profile">
            Profile
            </NavLink>
          </li>

          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/user/orders">
            Orders
            </NavLink>
          </li>

          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/user/wishlist">
            Wishlist
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
