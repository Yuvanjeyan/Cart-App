import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ShippingForm({ onSubmit, initialData = {}, loading = false }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postalCode: initialData.postalCode || "",
    country: initialData.country || "India",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.state.trim()) {
      toast.error("State is required");
      return;
    }
    if (!formData.postalCode.trim()) {
      toast.error("Postal code is required");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            disabled={loading}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            disabled={loading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={loading}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Address *</label>
        <input
          type="text"
          className="form-control"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter street address"
          disabled={loading}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">City *</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            disabled={loading}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">State *</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            disabled={loading}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Postal Code *</label>
          <input
            type="text"
            className="form-control"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
            disabled={loading}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Country *</label>
          <select
            className="form-select"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-100"
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );
}
