import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import axios from "axios";
import moment from "moment";

export default function UserOrders() {
  // context
  const [auth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron title={`Hello ${auth?.user?.name}`} subTitle="Dashboard" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Orders</div>

            {orders?.map((o, i) => {
              return (
                <div
                  key={o._id}
                  className="border shadow bg-light rounded-4 mb-5"
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ordered</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.status === "completed" ? "Success" : "Failed"}</td>
                        <td>{o?.orderItems?.length} items</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="container">
                    <div className="row m-2">
                      <div className="col-md-6">
                        <h6>Shipping Information</h6>
                        <p>Status: {o?.status}</p>
                        <p>Tracking: {o?.shipping?.trackingNumber || "Not available"}</p>
                        <p>Carrier: {o?.shipping?.carrier || "Not available"}</p>
                        <p>Est. Delivery: {o?.shipping?.estimatedDelivery ? moment(o.shipping.estimatedDelivery).format("DD/MM/YYYY") : "Not set"}</p>
                      </div>
                    </div>
                    <div className="row m-2">
                      {o?.orderItems?.map((item, i) => (
                        <div key={i} className="col-md-4">
                          <div className="card mb-3">
                            <div className="card-body">
                              <h6 className="card-title">{item?.product?.name}</h6>
                              <p className="card-text">Quantity: {item?.quantity}</p>
                              <p className="card-text">Price: ₹{item?.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
