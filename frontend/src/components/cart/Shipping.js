import { Fragment, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "countries-list";
import { saveShippingInfo, saveBillingInfo } from "../../slices/cartSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MetaData from "../layouts/MetaData";
import {
  createSavedAddress,
  getAllSavedAddresses,
  verifyAddressOtp,
} from "../../actions/userActions.js";
import "bootstrap/dist/js/bootstrap.js";
import { logEvent } from "../../actions/analyticsActions.js";
import Loader from "../layouts/Loader.js";
import Nav from "../layouts/nav.js";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

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

const isValidPostalCode = (postalCode) => {
  const postalCodeRegex = /^\d{6}$/;
  return postalCodeRegex.test(postalCode);
};
const checkPostalCodeExists = async (postalCode) => {
  if (!isValidPostalCode(postalCode)) return false;

  try {
    const data = await fetchPostalCodeDetails(postalCode);
    return Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0;
  } catch (error) {
    console.error("Error checking postal code existence:", error);
    return false;
  }
};

export const validateShipping = (shippingInfo, navigate) => {
  const { address, addressLine, city, state, country, phoneNo, postalCode } =
    shippingInfo;

  if (
    !address ||
    !addressLine ||
    !city ||
    !state ||
    !country ||
    !phoneNo ||
    !postalCode ||
    !isValidPostalCode(postalCode)
  ) {
    toast.error("Please fill the shipping information correctly");
    navigate("/shipping");
  }
};

export default function Shipping() {
  const [loading, setLoading] = useState(false);
  const { shippingInfo = {}, billingInfo = {} } = useSelector(
    (state) => state.cartState,
  );
  const addressId = useSelector((state) => state.userState.addressId || {});
  const { savedAddresses = [] } = useSelector((state) => state.userState);
  const { user } = useSelector((state) => state.authState);
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [addressLine, setAddressLine] = useState(shippingInfo.addressLine || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [name, setName] = useState(user.name || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
  const [localities, setLocalities] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [billingName, setBillingName] = useState(user.name || "");
  const [gstNumber, setGstNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState(billingInfo.address || "");
  const [billingAddressLine, setBillingAddressLine] = useState(billingInfo.addressLine || "");
  const [billingCity, setBillingCity] = useState(billingInfo.city || "");
  const [billingPhoneNo, setBillingPhoneNo] = useState(billingInfo.phoneNo || "");
  const [billingCountry, setBillingCountry] = useState(billingInfo.country || "");
  const [billingState, setBillingState] = useState(billingInfo.state || "");
  const [billingPostalCode, setBillingPostalCode] = useState(billingInfo.postalCode || "");
  const [billingLocalities, setBillingLocalities] = useState([]);
  const [inputotpCode, setInputOtpCode] = useState(""); // State for OTP
  // const [addressId, setAddressId] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [gstError, setGstError] = useState(false);
  const [gstHelperText, setGstHelperText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const countryList = Object.values(countries);


  useEffect(() => {
    dispatch(getAllSavedAddresses());
    fetchPostalCodeDetails(shippingInfo.postalCode)
  }, [dispatch]);

  const validateGst = (value) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (value === '') {
      setGstError(false);
      setGstHelperText('');
    } else if (!gstRegex.test(value.toUpperCase())) {
      setGstError(true);
      setGstHelperText('Invalid GST format');
    } else {
      setGstError(false);
      setGstHelperText('');
    }
  };

  const handleGstChange = (e) => {
    const value = e.target.value.toUpperCase();
    setGstNumber(value);
    validateGst(value);
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      // Validate shipping address
      const isShippingPostalValid = await checkPostalCodeExists(postalCode);
      if (
        !name ||
        !address ||
        !addressLine ||
        !city ||
        !phoneNo ||
        !postalCode ||
        !country ||
        !state ||
        !isShippingPostalValid
      ) {
        toast.error("Please fill all required shipping information correctly");
        setLoading(false);
        return;
      }

      // Validate billing address if not same as shipping
      if (!billingSameAsShipping) {
        const isBillingPhoneValid = billingPhoneNo && billingPhoneNo.length === 13 && /^\+91\d{10}$/.test(billingPhoneNo);
        const isBillingPostalValid = await checkPostalCodeExists(billingPostalCode);
        if (
          !billingName ||
          !billingAddress ||
          !billingAddressLine ||
          !billingCity ||
          !isBillingPhoneValid ||
          !billingPostalCode ||
          !billingCountry ||
          !billingState ||
          !isBillingPostalValid
        ) {
          toast.error("Please fill all required billing information correctly");
          setLoading(false);
          return;
        }
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (gstNumber && !gstRegex.test(gstNumber.toUpperCase())) {
          toast.error("Invalid GST number format");
          setLoading(false);
          return;
        }
      }

      // Save shipping info
      dispatch(
        saveShippingInfo({
          name,
          address,
          addressLine,
          city,
          phoneNo,
          postalCode,
          country,
          state,
        })
      );

      // Save billing info
      if (billingSameAsShipping) {

        dispatch(
          saveBillingInfo({
            name,
            address,
            addressLine,
            city,
            phoneNo,
            postalCode,
            country,
            state,
          })
        );
      } else {
        dispatch(
          saveBillingInfo({
            name: billingName,
            gstNumber,
            organizationName,
            address: billingAddress,
            addressLine: billingAddressLine,
            city: billingCity,
            phoneNo: billingPhoneNo,
            postalCode: billingPostalCode,
            country: billingCountry,
            state: billingState,
          })
        );
      }

      // Create address and navigate
      try {
        const addressData = await dispatch(
          createSavedAddress({
            name,
            address,
            addressLine,
            city,
            phoneNo,
            postalCode,
            country,
            state,
          })
        );

        if (addressData?.isPhoneVerified) {
          navigate("/order/confirm");
        } else {
          // setShowOtpModal(true);
          navigate("/order/confirm");
        }
      } catch (error) {
        toast.error(error.message || "Failed to save address");
      }

      setLoading(false);
    },
    [
      address,
      addressLine,
      billingAddress,
      billingAddressLine,
      billingCity,
      billingCountry,
      billingPhoneNo,
      billingPostalCode,
      billingState,
      billingSameAsShipping,
      city,
      country,
      dispatch,
      navigate,
      phoneNo,
      name,
      postalCode,
      state,
      billingName,
      gstNumber,
      organizationName,
    ]
  );

  const handleOtpSubmit = async () => {
    if (inputotpCode.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      // Dispatch the action and get the response
      const response = await dispatch(
        verifyAddressOtp(addressId, inputotpCode),
      );

      // Check if the response contains the 'success' property
      if (response?.success) {
        toast.success("Address verified successfully!");
        setShowOtpModal(false); // Close OTP modal
        navigate("/order/confirm"); // Redirect to the next step
      } else {
        toast.error(response?.message || "Invalid OTP, please try again");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message || "Error verifying OTP");
    }
  };

  const handlePincodeChange = useCallback(
    async (e, setPostalCode, setLocalities, setCity, setState, setCountry, setAddressLine) => {
      const postalCode = e.target.value;
      setPostalCode(postalCode);

      if (postalCode.length === 6) {
        try {
          const data = await fetchPostalCodeDetails(postalCode);
          if (data && data[0]?.PostOffice?.length > 0) {
            const offices = data[0].PostOffice;
            const localityNames = offices.map((office) => office.Name);
            setLocalities(localityNames);
            setCity(offices[0].Name);
            setState(offices[0].State);
            setCountry(offices[0].Country);
            setAddressLine(localityNames[0]);
          } else {
            toast.error("Invalid pin code");
          }
        } catch (error) {
          console.error("Error fetching pin code details:", error);
          // toast.error("Error fetching pin code details");
        }
      }
    },
    []
  );

  const handleAddressSelect = useCallback(
    (selectedAddressId) => {
      setSelectedAddress(selectedAddressId);
      const selected = savedAddresses.find(
        (addr) => addr._id === selectedAddressId,
      );

      // console.log("Selected address:", selected); 

      if (selected) {
        setName(selected.name);
        setAddress(selected.address);
        setAddressLine(selected.addressLine || ""); // default to "" if undefined
        setCity(selected.city);
        setPhoneNo(selected.phoneNo);
        setPostalCode(selected.postalCode);
        setCountry(selected.country);
        setState(selected.state);
      }
    },
    [savedAddresses],
  );
  useEffect(() => {
    if (addressLine && !localities.includes(addressLine)) {
      setLocalities((prev) => [...prev, addressLine]);
    }
    if (billingAddressLine && !localities.includes(billingAddressLine)) {
      setBillingLocalities((prev) => [...prev, billingAddressLine]);
    }
  }, [addressLine]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({
        event: "page_view",
        pageUrl: window.location.pathname,
        timeSpent,
      });
    };
  }, []);



  // 

  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]._id);
      handleAddressSelect(savedAddresses[0]._id); // notify parent
    }
  }, [savedAddresses]);

  const handleSelect = (id) => {
    setSelectedAddress(id);
    handleAddressSelect(id);
  };

  return (
    <>
      <MetaData title="Shipping | GLOCRE" />

      <Nav />
      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/cart"}>Cart</Link>
            </li>
            <li>Shipping Address</li>
          </ul>
        </div>
      </div>

      {loading && <Loader />}
      <form className="" onSubmit={submitHandler} noValidate>
        <div className="container mb-5">
          <div className="row">
            <div className=" col-md-4">
              <h1 className="hd">SAVE SHIPPING ADDRESS</h1>
              <div className="mb-3 mt-4">
                <Accordion>
                  <AccordionSummary
                    sx={{ backgroundColor: "#ffad63" }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">Saved Address</Typography>
                  </AccordionSummary>
                  {/* <AccordionDetails>
                    {savedAddresses && savedAddresses.length > 0 && (
                      <div>
                        <div>
                          {savedAddresses.map((address) => (
                            <div key={address._id} className="">
                              <div class="address-container-shipping">
                                <div className="input-ship">
                                  <input
                                    className="me-3"
                                    type="radio"
                                    id={address._id}
                                    name="savedAddress"
                                    value={address._id}
                                    checked={selectedAddress === address._id}
                                    onChange={() =>
                                      handleAddressSelect(address._id)
                                    }
                                  />
                                </div>
                                <div>
                                  <label
                                    class="address-item num-shiping"
                                    for={address._id}
                                  >
                                    {`${address.phoneNo}`}
                                  </label>
                                  <br />
                                  <label class="address-item" for={address._id}>
                                    {`${address.address}, ${address.addressLine},`}
                                  </label>
                                  <label class="address-item" for={address._id}>
                                    {`${address.city},`}
                                  </label>
                                  <label class="address-item" for={address._id}>
                                    {`${address.country} - ${address.postalCode},`}
                                  </label>
                                  <hr />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionDetails> */}
                  <AccordionDetails>
                    {savedAddresses && savedAddresses.length > 0 && (
                      <div>
                        {savedAddresses.map((address) => {
                          const isSelected = selectedAddress === address._id;
                          return (
                            <div
                              key={address._id}
                              className={` ${isSelected ? "selected" : ""}`}
                              style={{
                                padding: "12px",
                                marginBottom: "12px",
                                borderRadius: "6px",
                                border: isSelected ? "2px solid #ffad6320" : "1px solid #ccc",
                                backgroundColor: isSelected ? "#f5f5f5" : "#fff",
                                cursor: "pointer",
                              }}
                              onClick={() => handleSelect(address._id)}
                            >
                              <div className="address-item num-shiping" style={{ color: "#ffad63" }}>{address.phoneNo}</div><br />
                              <div className="address-item">
                                {`${address.address}, ${address.addressLine},`}
                              </div>
                              <div className="address-item">{`${address.city},`}</div>
                              <div className="address-item">
                                {`${address.country} - ${address.postalCode},`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>

            <div className="col-md-8">
              <section className="mb-5">
                <h1 className="hd ">ADD NEW SHIPPING ADDRESS </h1>
                <div className="row d-flex">
                  <div className="cartWrapper mt-1">
                    <div className="Form Contents">

                      {/* Form Contents */}
                      <div
                        id="flush-collapseThree"
                        class="accordion-collapse collapse"
                        aria-labelledby="flush-headingThree"
                        data-bs-parent="#accordionFlushExample"
                      >
                        {savedAddresses && savedAddresses.length > 0 && (
                          <div>
                            <div>
                              {savedAddresses.map((address) => (
                                <div
                                  key={address._id}
                                  className="p-3 col-lg-12"
                                >
                                  <input
                                    type="radio"
                                    id={address._id}
                                    name="savedAddress"
                                    value={address._id}
                                    checked={selectedAddress === address._id}
                                    onChange={() =>
                                      handleAddressSelect(address._id)
                                    }
                                  />
                                  <label htmlFor={address._id}>
                                    {`${address.address},`}{" "}
                                    {address.addressLine},
                                  </label>{" "}
                                  <br />
                                  <label
                                    htmlFor={address._id}
                                  >{`${address.city},`}</label>{" "}
                                  <br />
                                  <label
                                    htmlFor={address._id}
                                  >{`${address.country} - ${address.postalCode},`}</label>{" "}
                                  <br />
                                  <label
                                    htmlFor={address._id}
                                  >{`${address.phoneNo}`}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="row">

                        <div className="col-md-6 mb-4">
                          <div className="form-group">
                            <TextField
                              label="Name"
                              variant="outlined"
                              className="w-100"
                              size="small"
                              type="text"
                              value={name}
                              required
                              placeholder="Your name"
                              id="name"
                              inputProps={{ maxLength: 25 }}
                              onChange={(e) => setName(e.target.value)}

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

                        <div className="col-md-6 mb-4">
                          {/* phone no */}
                          <div className="form-group">
                            <TextField
                              label="Phone Number"
                              variant="outlined"
                              className="w-100"
                              size="small"
                              type="text"
                              value={phoneNo}
                              required
                              placeholder="Eg: +919876543210"
                              id="phone_field"
                              inputProps={{ maxLength: 13 }} // +91 + 10 digits = 13 characters total
                              onChange={(e) => {
                                let value = e.target.value;

                                // Ensure it always starts with +91
                                if (!value.startsWith("+91")) {
                                  value = "+91" + value.replace(/\D/g, ''); // Remove non-digits
                                }

                                // Remove +91 for counting only the 10-digit number
                                const digitsOnly = value.replace("+91", "").replace(/\D/g, "");

                                // Limit to 10 digits after +91
                                if (digitsOnly.length > 10) {
                                  value = "+91" + digitsOnly.substring(0, 10);
                                } else {
                                  value = "+91" + digitsOnly;
                                }

                                setPhoneNo(value);
                              }}
                              onKeyDown={(e) => {
                                // Prevent space or deletion of +91
                                if (e.key === ' ') e.preventDefault();
                                if (
                                  (e.target.selectionStart <= 3 && ['Backspace', 'Delete'].includes(e.key)) ||
                                  (e.ctrlKey && ['x', 'X'].includes(e.key)) // Prevent Ctrl+X from cutting +91
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />

                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          {/* pincode */}
                          <div className="form-group">
                            <TextField
                              label="PIN Code"
                              id="pincode_field"
                              variant="outlined"
                              className="w-100"
                              size="small"
                              type="text"
                              name="pincode"
                              placeholder="Pincode"
                              value={postalCode}
                              onChange={(e) => {
                                const sanitized = e.target.value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6
                                const fakeEvent = { ...e, target: { ...e.target, value: sanitized } };
                                handlePincodeChange(fakeEvent, setPostalCode, setLocalities, setCity, setState, setCountry, setAddressLine);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === ' ') {
                                  e.preventDefault(); // Prevent space
                                }
                              }}
                              required
                              inputProps={{
                                inputMode: 'numeric', // shows number keyboard on mobile
                                pattern: '[0-9]*',
                                maxLength: 6,
                              }}
                            />


                          </div>
                        </div>

                        <div className="Street  mb-4">
                          <div className="Street">
                            {/* address */}
                            <div className="form-group">
                              <TextField
                                label="House number and street name"
                                variant="outlined"
                                className="w-100"
                                id="address_field"
                                size="small"
                                name="streetAddressLine1"
                                value={address}
                                inputProps={{ maxLength: 50 }}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/^\s+/, ""); // Removes leading spaces only
                                  setAddress(value)
                                }}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="form-group">
                            <div className="custom-select-wrapper">
                              <select
                                id="addressLine_field"
                                className="form-control custom-select"
                                value={addressLine}
                                onChange={(e) => setAddressLine(e.target.value)}
                                required
                              >
                                <option value="">Select Locality *</option>
                                {localities.map((locality, index) => (
                                  <option key={index} value={locality}>
                                    {locality}
                                  </option>
                                ))}
                              </select>
                            </div>


                          </div>
                        </div>

                        {/* City */}
                        <div className="col-md-6 mb-4">
                          <div className="form-group">
                            <TextField
                              label="City/Town"
                              variant="outlined"
                              className="w-100"
                              size="small"
                              name="City"
                              value={city}
                              readOnly
                              required
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div className="col-md-6 mb-4">
                          <div className="form-group">
                            <TextField
                              label="State"
                              variant="outlined"
                              className="w-100"
                              size="small"
                              name="state"
                              value={state}
                              readOnly
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="form-group">
                            <select
                              label="Country *"
                              variant="outlined"
                              size="small"
                              name="state"
                              id="country_field"
                              className="form-control"
                              value={country}

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

                        <div className="mb-4">
                          <div className="card-check-box-shipping1 d-flex align-items-center">
                            <input
                              type="checkbox"
                              id="billingSameAsShipping"
                              className=" ms-1 custom-checkbox1"
                              checked={billingSameAsShipping}
                              style={{ backgroundColor: "#ffad63", border: "none", width: "20px", height: "20px" }}
                              onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                            />
                            <label htmlFor="billingSameAsShipping" className="ms-2 mb-0"></label>
                            <p className="ms-2 mb-0">Billing address same as shipping address</p>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="cartRightBox pt-0 p-0">
            {!billingSameAsShipping && (
              <>
                <h1 className="hd mb-5">BILLING ADDRESS</h1>
                <div className="Form Contents">
                  <div className="row mt-3">

                    <div className="col-md-6 mb-4">
                      {/* Billing name */}
                      <TextField
                        label="Billing Name"
                        variant="outlined"
                        className="w-100"
                        size="small"
                        type="text"
                        required
                        value={billingName}
                        id="billing_name_field"
                        onChange={(e) => {
                          const value = e.target.value.replace(/^\s+/, ""); // Removes leading spaces only
                          setBillingName(value);
                        }}
                        inputProps={{ maxLength: 40 }}
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
                    <div className="col-md-6 mb-4">
                      <TextField
                        label="GST Number"
                        variant="outlined"
                        className="w-100"
                        size="small"
                        type="text"
                        value={gstNumber}

                        placeholder="Eg: 22ABCDE1234F1Z5"
                        id="gst_field"
                        onChange={handleGstChange}
                        //  error={gstError}
                        helperText={gstHelperText}
                        inputProps={{ maxLength: 15 }}
                      />

                    </div>
                    <div className="col-md-6 mb-4">
                      {/* Billing name */}
                      <TextField
                        label="Organization Name"
                        variant="outlined"
                        className="w-100"
                        size="small"
                        type="text"

                        value={organizationName}
                        inputProps={{ maxLength: 40 }}
                        id="organization_field"
                        onChange={(e) => {
                          const value = e.target.value.replace(/^\s+/, "");
                          setOrganizationName(value)
                        }
                        }
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
                    <div className="col-md-6 mb-4">
                      {/* phone no */}
                      <div className="form-group">
                        <TextField
                          label="Billing Phone Number"
                          variant="outlined"
                          className="w-100"
                          size="small"
                          type="text"
                          value={billingPhoneNo}
                          required
                          placeholder="Eg: +919876543210"
                          id="billing_phone_field"
                          inputProps={{ maxLength: 13 }} // +91 + 10 digits
                          onChange={(e) => {
                            let value = e.target.value;

                            // Always start with +91
                            if (!value.startsWith("+91")) {
                              value = "+91" + value.replace(/\D/g, "");
                            }

                            // Remove +91 for processing
                            const digitsOnly = value.replace("+91", "").replace(/\D/g, "");

                            // Limit to 10 digits after +91
                            if (digitsOnly.length > 10) {
                              value = "+91" + digitsOnly.substring(0, 10);
                            } else {
                              value = "+91" + digitsOnly;
                            }

                            setBillingPhoneNo(value);
                          }}
                          onKeyDown={(e) => {
                            // Prevent space or deletion of +91
                            if (e.key === ' ') e.preventDefault();
                            if (
                              (e.target.selectionStart <= 3 && ['Backspace', 'Delete'].includes(e.key)) ||
                              (e.ctrlKey && ['x', 'X'].includes(e.key)) // Prevent Ctrl+X on prefix
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />

                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      {/* pincode */}
                      <div className="form-group">
                        <TextField
                          label="PIN Code"
                          id="billing_pincode_field"
                          variant="outlined"
                          className="w-100"
                          size="small"
                          name="pincode"
                          placeholder="Pincode"
                          value={billingPostalCode}
                          onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(/\D/g, "").slice(0, 6);
                            const fakeEvent = { ...e, target: { ...e.target, value: sanitizedValue } };
                            handlePincodeChange(
                              fakeEvent,
                              setBillingPostalCode,
                              setBillingLocalities,
                              setBillingCity,
                              setBillingState,
                              setBillingCountry,
                              setBillingAddressLine
                            );
                          }}
                          required
                          inputProps={{ maxLength: 6 }}
                        />

                      </div>
                    </div>
                    <div className="Street mb-4">
                      <div className="Street">
                        {/* address */}
                        <div className="form-group">
                          <TextField
                            label="House number and street name"
                            variant="outlined"
                            className="w-100"
                            id="billing_address_field"
                            size="small"
                            name="streetAddressLine1"
                            value={billingAddress}
                            inputProps={{ maxLength: 40 }}
                            onChange={(e) => {
                              const value = e.target.value.replace(/^\s+/, ""); // Removes leading spaces only
                              setBillingAddress(value)
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-group">

                        <div className="custom-select-wrapper">
                          <select
                            id="billing_addressLine_field"
                            className="form-control custom-select"
                            value={billingAddressLine}
                            onChange={(e) =>
                              setBillingAddressLine(e.target.value)
                            }
                            required
                            disabled={billingLocalities.length === 0}
                          >
                            <option value="" style={{ fontSize: "15px" }}>Select Locality *</option>
                            {billingLocalities.map((locality, index) => (
                              <option key={index} value={locality}>
                                {locality}
                              </option>
                            ))}
                          </select>
                        </div>


                      </div>
                    </div>
                    {/* City */}
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <TextField
                          label="City/Town"
                          id="billing_city_field"
                          variant="outlined"
                          className="w-100"
                          size="small"
                          name="City "
                          value={billingCity}
                          readOnly
                          required
                        />
                      </div>
                    </div>
                    {/* State */}
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <TextField
                          label="State"
                          variant="outlined"
                          className="w-100"
                          size="small"
                          name="state"
                          id="billing_state_field"
                          value={billingState}
                          readOnly
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <select
                          label="Country *"
                          variant="outlined"
                          size="small"
                          name="state"
                          id="country_field"
                          className="form-control"
                          value={billingCountry}

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

                </div>
              </>
            )}

            <div class="button-container pt-0">
              <Button
                type="submit"
                className="btn-g btn-lg w-20"
                id="shipping_btn"
              >
                SAVE & CONTINUE
              </Button>
            </div>
          </section>
        </div>
      </form>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Verify Phone Number</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowOtpModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  maxLength="6"
                  value={inputotpCode}
                  onChange={(e) => setInputOtpCode(e.target.value)}
                  className="form-control"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOtpModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOtpSubmit}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
