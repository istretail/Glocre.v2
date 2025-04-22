import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../actions/userActions";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";
import SellerSidebar from "./SellerSidebar";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";


const SellerRegistration = () => {
  // Navbar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

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
      const successMessage = response?.data?.message;
      toast.success(successMessage);
    } catch (error) {
      // setSubmitError("Failed to update profile. Please try again.");
      toast.error(error.response?.data?.message);
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
      <section className="seller-create-product-glc">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            {/* <SellerSidebar /> */}
          </div>

          <div className="col-12 col-lg-10 col-md-12 newprod-right-glc">
            <Link to="/">
              <div className="mobile-logo">
                <img src={require('../../images/procure-g-logo.png')} />
              </div>
            </Link>
            

            <h3 className="" style={{ color: '#ffad63', marginTop: '40px' }}>
              SELLER REGISTRATION
            </h3>



            {isSubmitting && <Loader />}
            <form onSubmit={handleSubmit}>

              <div className="row mt-3 mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Name :"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="text"
                      required
                      placeholder="Your name"
                      id="name"
                      value={formData.name}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Last Name:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="text"
                      required
                      placeholder="Your name"
                      id="name"
                      value={formData.lastName}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-3 mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="text"
                      required
                      placeholder="Your name"
                      id="name"
                      value={formData.email}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="GST Number:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="text"
                      required
                      placeholder="Your name"
                      id="name"
                      value={formData.gstNumber}
                      onChange={handleChange}
                    />
                    {errors.gstNumber && <p className="error">{errors.gstNumber}</p>}
                  </div>
                </div>
              </div>

              <div className="row mt-3 mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Business Name:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="text"
                      required
                      placeholder="Business Name"
                      id="name"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Business Email:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="email"
                      required
                      placeholder="Business Email"
                      id="name"
                      value={formData.businessEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-3 mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Business Contact Number:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="text"
                      required
                      placeholder="Business Name"
                      id="name"
                      value={formData.businessContactNumber}
                      onChange={handleChange}
                    />
                    {errors.businessContactNumber && (
                      <p className="error">{errors.businessContactNumber}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Business Address:"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      type="email"
                      required
                      placeholder="Business Email"
                      id="name"
                      onChange={handleChange}
                      name="businessAddress"
                      value={formData.businessAddress}
                    />
                  </div>
                </div>
              </div>

              <div class="">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn-g btn-lg w-20 mb-5"
                  id="shipping_btn"
                >
                  SAVE & CONTINUE
                </Button>
              </div>
              {submitError && <p className="error">{submitError}</p>}

            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SellerRegistration;