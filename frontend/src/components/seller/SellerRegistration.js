import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../actions/userActions";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";

const SellerRegistration = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authState);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    gstNumber: "",
    businessName: "",
    businessEmail: "",
    businessContactNumber: "",
    businessAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        gstNumber: "",
        businessName: "",
        businessEmail: "",
        businessContactNumber: "",
        businessAddress: "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.gstNumber && !/^[0-9A-Z]{15}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST Number (15 alphanumeric characters)";
    }

    if (
      formData.businessContactNumber &&
      !/^\d{10}$/.test(formData.businessContactNumber)
    ) {
      newErrors.businessContactNumber = "Invalid Contact Number (10 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await dispatch(updateProfile(formData));
      const successMessage = response?.data?.message || "Thank you";
      toast.success(successMessage);
    } catch (error) {
      setSubmitError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user.role === "seller" && user.isSeller) {
    return <p>You are already a seller. Use the seller dashboard.</p>;
  }

  if (user.role === "user" && user.isSeller === false) {
    return (
      <p>You have successfully requested for seller. We will notify you.</p>
    );
  }

  return (
    <>
      {isSubmitting && <Loader />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            readOnly
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            required
          />
        </div>
        <div>
          <label>GST Number:</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
          />
          {errors.gstNumber && <p className="error">{errors.gstNumber}</p>}
        </div>
        <div>
          <label>Business Name:</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Business Email:</label>
          <input
            type="email"
            name="businessEmail"
            value={formData.businessEmail}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Business Contact Number:</label>
          <input
            type="text"
            name="businessContactNumber"
            value={formData.businessContactNumber}
            onChange={handleChange}
          />
          {errors.businessContactNumber && (
            <p className="error">{errors.businessContactNumber}</p>
          )}
        </div>
        <div>
          <label>Business Address:</label>
          <input
            type="text"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
        {submitError && <p className="error">{submitError}</p>}
      </form>
    </>
  );
};

export default SellerRegistration;