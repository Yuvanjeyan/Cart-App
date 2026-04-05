import React, { useState } from "react";
import toast from "react-hot-toast";

export default function PaymentForm({
  onSubmit,
  totalAmount,
  loading = false,
  userData = {},
}) {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === "razorpay") {
      onSubmit({ paymentMethod: "razorpay" });
    } else if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      // Validate card details
      if (!cardDetails.cardNumber.replace(/\s/g, "").trim()) {
        toast.error("Card number is required");
        return;
      }
      if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Card number must be 16 digits");
        return;
      }
      if (!cardDetails.cardHolder.trim()) {
        toast.error("Cardholder name is required");
        return;
      }
      if (!cardDetails.expiryDate.trim()) {
        toast.error("Expiry date is required");
        return;
      }
      if (!cardDetails.cvv.trim()) {
        toast.error("CVV is required");
        return;
      }
      if (cardDetails.cvv.length !== 3) {
        toast.error("CVV must be 3 digits");
        return;
      }

      onSubmit({
        paymentMethod,
        cardDetails: {
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ""),
          cardHolder: cardDetails.cardHolder,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
        },
      });
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        toast.error("UPI ID is required");
        return;
      }
      if (!upiId.includes("@")) {
        toast.error("Invalid UPI ID");
        return;
      }

      onSubmit({
        paymentMethod: "upi",
        upiId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Payment Method</h5>
        </div>
        <div className="card-body">
          <div className="payment-methods">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="razorpay"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="razorpay">
                Razorpay (Credit/Debit Card, UPI, Wallet)
              </label>
              <small className="form-text text-muted ms-4 d-block">
                Secure payment gateway with multiple payment options
              </small>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="credit_card"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="credit_card">
                Credit Card
              </label>
            </div>

            {(paymentMethod === "credit_card" ||
              paymentMethod === "debit_card") && (
              <div className="card bg-light ms-4 p-3 mb-3">
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    disabled={loading}
                  />
                  <small className="text-muted">Enter 16-digit card number</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardChange}
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      disabled={loading}
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="debit_card"
                value="debit_card"
                checked={paymentMethod === "debit_card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="debit_card">
                Debit Card
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="upi"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="upi">
                UPI
              </label>
            </div>

            {paymentMethod === "upi" && (
              <div className="card bg-light ms-4 p-3 mb-3">
                <div className="mb-3">
                  <label className="form-label">UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@bankname"
                    disabled={loading}
                  />
                  <small className="text-muted">
                    e.g., yourname@upi or yourname@paytm
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="alert alert-info" role="alert">
        <strong>Secure Payment:</strong> Your payment information is encrypted and
        processed securely. We never store complete card details.
      </div>

      <button
        type="submit"
        className="btn btn-success btn-lg w-100"
        disabled={loading}
      >
        {loading ? "Processing Payment..." : `Pay ${parseFloat(totalAmount || 0).toLocaleString("en-US", { style: "currency", currency: "INR" })}`}
      </button>
    </form>
  );
}
