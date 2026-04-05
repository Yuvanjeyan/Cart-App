import { NavLink } from "react-router-dom";

export default function AdminMenu() {
  return (
    <>
      <div className="side-menu">
        <div className="section-heading mb-3">Admin Links</div>

        <ul className="list-group list-unstyled side-menu__list">
          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/admin/category">
            Create category
            </NavLink>
          </li>

          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/admin/product">
            Create product
            </NavLink>
          </li>

          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/admin/products">
            Products
            </NavLink>
          </li>

          <li>
            <NavLink className="list-group-item side-menu__item" to="/dashboard/admin/orders">
            Manage orders
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
