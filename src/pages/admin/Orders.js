import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

export default function AdminOrders() {
  // context
  const [auth] = useAuth();
  // state
  const [orders, setOrders] = useState([]);
  const [status] = useState([
    "Not processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [shippingData, setShippingData] = useState({
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/admin/order/status/${orderId}`, { status: value });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const handleShippingChange = async (orderId) => {
    try {
      await axios.put(`/order/shipping/${orderId}`, shippingData);
      setShippingData({
        trackingNumber: "",
        carrier: "",
        estimatedDelivery: "",
      });
      getOrders();
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
            <AdminMenu />
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
                        <th scope="col">Buyer</th>
                        <th scope="col">Ordered</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
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
                        <p>Tracking: {o?.shipping?.trackingNumber || "Not set"}</p>
                        <p>Carrier: {o?.shipping?.carrier || "Not set"}</p>
                        <p>Est. Delivery: {o?.shipping?.estimatedDelivery ? moment(o.shipping.estimatedDelivery).format("DD/MM/YYYY") : "Not set"}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Update Shipping</h6>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Tracking Number"
                          value={shippingData.trackingNumber}
                          onChange={(e) => setShippingData({ ...shippingData, trackingNumber: e.target.value })}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Carrier"
                          value={shippingData.carrier}
                          onChange={(e) => setShippingData({ ...shippingData, carrier: e.target.value })}
                        />
                        <input
                          type="date"
                          className="form-control mb-2"
                          value={shippingData.estimatedDelivery}
                          onChange={(e) => setShippingData({ ...shippingData, estimatedDelivery: e.target.value })}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => handleShippingChange(o._id)}
                        >
                          Update Shipping
                        </button>
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
