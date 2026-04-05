import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";

export default function AdminDashboard() {
  // context
  const [auth] = useAuth();

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
            <div className="section-heading">Admin Information</div>

            <ul className="list-group info-card">
              <li className="list-group-item">{auth?.user?.name}</li>
              <li className="list-group-item">{auth?.user?.email}</li>
              <li className="list-group-item">Admin</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
