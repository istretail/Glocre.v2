import React, { Fragment, useState, useEffect } from "react";
import "./Footer.css";
import contactban from "../../images/GLOCRE-CONTACT-BANNER.png";
import enquirygif from "../../images/mogli-chat.gif";
import faqgif from "../../images/FAQs.gif";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, submitContactForm } from "../../actions/userActions";
import Loader from "./Loader";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import MetaData from "./MetaData";
export default function Support() {
  const { loading, isFormSubmitted, error } = useSelector((state) => state.userState)
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("+91");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [requirements, setRequirements] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [yourfunction, setYourFunction] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a complete formData object using the latest input values
    const updatedFormData = {
      name,
      organization: organizationName,
      function: yourfunction,
      mobile: phone,
      email,
      pincode,
      requirements,
    };
    dispatch(submitContactForm(updatedFormData));
  };
  
useEffect(() => {
  if (isFormSubmitted) {
    // toast("Password updated successfully", {
    //   type: "success",
    // });
    setName("");
    setOrganizationName("");
    setYourFunction("");
    setPhone("+91");
    setEmail("");
    setPincode("");
    setRequirements("");
    dispatch(clearAuthError()); // clear state after success too (optional)
    return;
  }

  if (error) {
    toast(error, {
      type: "error",
    });
    dispatch(clearAuthError()); 
    return;
  }
}, [isFormSubmitted, error, dispatch]);


  return (
    <>
      <MetaData title="Contact Us | GLOCRE" />
      {/* CONTACT US FORM */}
      <body className="body-contact-glc pt-0">
        {/* Banner */}
        <section className="contact-banner-glc">
          <div>
            <img src={contactban} className="img-fluid w-100" />
          </div>
        </section>
        {/* Form */}
        {loading ? (
          <Loader />
        ) : (
          <section className="container mb-5">

            {/* Contact form Heading */}
            <div className="contact-heading-glc">
              <p>FILL BELOW FORM TO CONTACT US</p>
              <h2>In line with your request</h2>
            </div>

            <Fragment>

              <form onSubmit={handleSubmit}>
                <section className="mb-5 col-lg-12">
                  <div className="row d-flex">
                    <div className="cartWrapper mt-1">
                      <div className="Form Contents">

                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="form-group">
                              <TextField
                                label="Name"
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="text"
                                required
                                placeholder="Name"
                                id="name"
                                value={name}
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
                            <div className="form-group">
                              <TextField
                                label="Organization Name"
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="text"
                                required
                                placeholder="Organization Name"
                                id="organization"
                                value={organizationName}
                                inputProps={{ maxLength: 40 }}
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
                          </div>

                          <div className="col-md-6 mb-4">
                            <div className="form-group">
                              <TextField
                                label="Your Function"
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="text"
                                required
                                placeholder="Your Function"
                                id="function"
                                  value={yourfunction}
                                inputProps={{ maxLength: 40 }}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/^\s+/, "");
                                  setYourFunction(value)
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
                          </div>

                          <div className="col-md-6 mb-4">
                            <div className="form-group">
                              <TextField
                                label="Phone Number"
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="text"
                                required
                                placeholder="Eg: +919876543210"
                                id="phone_field"
                                value={phone}
                                inputProps={{ maxLength: 13 }}
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

                                  setPhone(value);
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
                            <div className="form-group">
                              <TextField
                                label="E-Mail Address"
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="email"
                                required
                                placeholder="E-Mail Address"
                                id="email"
                                value={email}
                                  onChange={e => setEmail(e.target.value.replace(/\s/g, ''))}
                                  onKeyDown={(e) => {
                                    if (e.key === ' ') {
                                      e.preventDefault(); // Prevent space character
                                    }
                                  }}
                                  inputProps={{ pattern: "^[^\\s]+$", title: "Spaces are not allowed" }}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 mb-4">
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
                                required
                                value={pincode}
                                inputProps={{ maxLength: 6 }}
                                onChange={e => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                  setPincode(value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="">
                            <div className="form-group">
                              <TextField
                                label="Requirements"
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="text"
                                required
                                placeholder="Your Requirements ( Feedback / Suggestions / New Product Enquiry ) *"
                                id="requirements"
                                inputProps={{ maxLength: 300 }}
                                value={requirements}
                                onChange={e => setRequirements(e.target.value)}
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
                        </div>


                        <div className="d-flex justify-content-center mt-4">
                          <button
                            className="btn"
                            type="submit"
                            style={{ backgroundColor: "#2f4d2a", color: "#fff" }}
                          >
                            Submit
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </section>
              </form>

            </Fragment>



          </section>
        )}

        {/* </form> */}
        {/* Enquiry */}
        <section
          className="contact-details-glc mb-5"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div className="container">
            <div className="row">
              <div className="mb-4">
                <h3 style={{ color: "#2f4d2a" }}>FOR ENQUIRY ?</h3>
              </div>
              <Link to="/faqs">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div class="card">
                    <div class="card-body">
                      <div className="row" style={{ padding: "2% 0" }}>
                        <div className="col-lg-4">
                          <img src={faqgif} className="img-fluid w-100" />
                        </div>
                        <div
                          className="col-lg-8"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <h6
                            class="card-subtitle mb-2"
                            style={{ fontSize: "25px", color: "#ffad63" }}
                          >
                            FAQ's
                          </h6>
                          <p class="card-text">
                            You can manage your orders in Orders section
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </section>
      </body>
    </>
  );
}
