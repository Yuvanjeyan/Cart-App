import React from "react";
import { getItemQuantity } from "../../utils/cart";

export default function CheckoutSummary({
  orderItems = [],
  shippingCost = 0,
  tax = 0,
  discount = 0,
}) {
  const calculateSubtotal = () => {
    return orderItems.reduce(
      (total, item) =>
        total + (item.price || 0) * getItemQuantity(item),
      0
    );
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + shippingCost + tax - discount;

  const formatPrice = (price) => {
    return parseFloat(price || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  return (
    <div className="card">
      <div className="card-header bg-light">
        <h5 className="mb-0">Order Summary</h5>
      </div>
      <div className="card-body">
        <div className="checkout-items mb-4 pb-4 border-bottom">
          <h6 className="mb-3">Items ({orderItems.length})</h6>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-start mb-3"
              >
                <div className="flex-grow-1">
                  <p className="mb-1 fw-bold">{item.name}</p>
                  <small className="text-muted">
                    Qty: {getItemQuantity(item)} × {formatPrice(item.price)}
                  </small>
                </div>
                <p className="mb-0 fw-bold text-end ms-2">
                  {formatPrice(item.price * getItemQuantity(item))}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-summary">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {shippingCost > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span className="text-success">+{formatPrice(shippingCost)}</span>
            </div>
          )}

          {tax > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span>Tax:</span>
              <span className="text-success">+{formatPrice(tax)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span>Discount:</span>
              <span className="text-danger">-{formatPrice(discount)}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="d-flex justify-content-between">
            <h6 className="mb-0">Total Amount:</h6>
            <h6 className="mb-0 text-primary fw-bold">{formatPrice(total)}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
