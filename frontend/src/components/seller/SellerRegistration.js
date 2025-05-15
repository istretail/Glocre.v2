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
import { countries } from "countries-list";
const fetchPostalCodeDetails = async (postalCode) => {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${postalCode}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pin code details:", error);
    throw error;
  }
};
const SellerRegistration = () => {
  // Navbar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);


  const countryList = Object.values(countries);
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

  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
    gstNumber: "",
    businessName: "",
    businessEmail: "",
    businessContactNumber: "",
    address: "",
    addressLine: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [localities, setLocalities] = useState([]);
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        gstNumber: "",
        businessName: "",
        businessEmail: "",
        businessContactNumber: "",
        address: "",
        addressLine: "",
        city: "",
        country: "",
        state: "",
        postalCode: "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (userData.gstNumber && !/^[0-9A-Z]{15}$/.test(userData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST Number (15 alphanumeric characters)";
    }

    if (
      userData.businessContactNumber &&
      !/^\+91\d{10}$/.test(userData.businessContactNumber)
    ) {
      newErrors.businessContactNumber = "Invalid Contact Number (10 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Construct the full payload including businessAddress object
    const payload = {
      ...userData,
      businessAddress: {
        address: userData.address,
        addressLine: userData.addressLine,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        postalCode: userData.postalCode,
      },
    };

    try {
      const response = await dispatch(updateProfile(payload));
      const successMessage = response?.data?.message;
      toast.success(successMessage);
      // console.log(payload);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handlePincodeChange = async (e) => {
    const postalCode = e.target.value;

    setUserData(prev => ({ ...prev, postalCode }));

    if (postalCode.length === 6) {
      try {
        const data = await fetchPostalCodeDetails(postalCode);
        if (data && data[0]?.PostOffice?.length > 0) {
          const offices = data[0].PostOffice;
          setLocalities(offices.map((office) => office.Name));

          setUserData(prev => ({
            ...prev,
            city: offices[0].Name,
            state: offices[0].State,
            country: offices[0].Country
          }));
        } else {
          toast.error("Invalid pin code");
        }
      } catch (error) {
        console.error("Error fetching pin code details:", error);
        toast.error("Error fetching pin code details");
      }
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
      <section className="seller-create-product-glc container">



        <div className="col-12 newprod-right-glc  pt-3 pb-3">

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
                    value={userData.name}
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
                    value={userData.lastName}
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
                    value={userData.email}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="GST Number:"
                    variant="outlined"
                    id="gstNumber_field"
                    className="w-100"
                    size="small"
                    required
                    name="gstNumber"
                    placeholder="GST Number"
                    value={userData.gstNumber}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      // Prevent space from being typed
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.gstNumber && <p className="error text-danger">{errors.gstNumber}</p>}
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
                    name="businessName"
                    required
                    placeholder="Business Name"
                    id="businessName_field"
                    value={userData.businessName}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const isAllowedKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '].includes(key);

                      if (!isLetter && !isAllowedKey) {
                        e.preventDefault(); // Block non-letters and non-control keys
                      }

                      // Prevent space at the start
                      if (key === ' ' && e.target.selectionStart === 0) {
                        e.preventDefault();
                      }
                    }}
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
                    name="businessEmail"
                    placeholder="Business Email"
                    id="businessEmail"
                    value={userData.businessEmail}
                    onChange={(e) => {
                      // Remove any spaces from the input
                      const cleanedValue = e.target.value.replace(/\s/g, '');
                      handleChange({ target: { name: 'businessEmail', value: cleanedValue } });
                    }}
                    onKeyDown={(e) => {
                      // Prevent space from being typed
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
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
                    name="businessContactNumber"
                    placeholder="Eg: +919876543210"
                    id="businessContactNumber"
                    value={userData.businessContactNumber}
                    inputProps={{ maxLength: 13 }} // +91 + 10 digits = 13
                    onChange={(e) => {
                      let value = e.target.value;

                      // Ensure it always starts with +91
                      if (!value.startsWith("+91")) {
                        value = "+91" + value.replace(/\D/g, ""); // remove non-digits
                      }

                      // Get only digits after +91
                      const digits = value.replace("+91", "").replace(/\D/g, "");

                      // Limit to 10 digits
                      if (digits.length > 10) {
                        value = "+91" + digits.substring(0, 10);
                      } else {
                        value = "+91" + digits;
                      }

                      handleChange({ target: { name: "businessContactNumber", value } });
                    }}
                    onKeyDown={(e) => {
                      // Prevent space or deletion of +91
                      if (e.key === ' ') e.preventDefault();

                      if (
                        (e.target.selectionStart <= 3 && ['Backspace', 'Delete'].includes(e.key)) ||
                        (e.ctrlKey && ['x', 'X'].includes(e.key)) // Prevent cutting +91
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />

                  {errors.businessContactNumber && (
                    <p className="error">{errors.businessContactNumber}</p>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                {/* pincode */}
                <div className="form-group">
                  <TextField
                    label="PIN Code"
                    className="w-100"
                    name="postalCode"
                    size="small"
                    type="text" // Change this
                    value={userData.postalCode}
                    required
                    inputProps={{ maxLength: 6 }}
                    onChange={(e) => {
                      // Remove non-digit characters
                      let value = e.target.value.replace(/\D/g, '');

                      // Limit to 6 digits
                      if (value.length > 6) {
                        value = value.slice(0, 6);
                      }

                      handleChange({ target: { name: "postalCode", value } });
                      handlePincodeChange({ target: { name: "postalCode", value } });
                    }}
                  />


                </div>
              </div>
            </div>
            <div className="row mt-3 mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Business Address:"
                    variant="outlined"
                    className="w-100"
                    size="small"
                    type="text"
                    required
                    placeholder="Flat/ building name and number"
                    id="name"
                    name="address"
                    value={userData.address}
                    onChange={(e) => {
                      const value = e.target.value;
                      const sanitizedValue = value.replace(/^\s+/, ''); // Remove leading spaces only
                      handleChange({ target: { name: 'address', value: sanitizedValue } });
                    }}
                  />

                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <div className="custom-select-wrapper">
                    <select
                      name="addressLine"
                      className="form-control custom-select"
                      value={userData.addressLine}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Locality *</option>
                      {localities.map((locality, index) => (
                        <option key={index} value={locality}>{locality}</option>
                      ))}
                    </select>

                  </div>

                </div>
              </div>
            </div>
            <div className="row mt-3 mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="City/Town"
                    variant="outlined"
                    className="w-100"
                    size="small"
                    name="City"
                    value={userData.city}
                    readOnly
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="State"
                    variant="outlined"
                    className="w-100"
                    size="small"
                    name="state"
                    value={userData.state}
                    readOnly
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3 mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <select
                    label="Country *"
                    variant="outlined"
                    size="small"
                    name="state"
                    id="country_field"
                    className="form-control"
                    value={userData.country}

                    required
                  >
                    {countryList.map((country, i) => (
                      <option key={i} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
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

      </section>
    </>
  );
};

export default SellerRegistration;