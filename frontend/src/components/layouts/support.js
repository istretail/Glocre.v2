import React, { Fragment, useState } from "react";
import "./Footer.css";
import contactban from "../../images/GLOCRE-CONTACT-BANNER.png";
import enquirygif from "../../images/mogli-chat.gif";
import faqgif from "../../images/FAQs.gif";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitContactForm } from "../../actions/userActions";
import Loader from "./Loader";
import { TextField } from "@mui/material";

export default function Support() {
  const { loading } = useSelector((state) => state.userState)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    function: "",
    mobile: "",
    email: "",
    pincode: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const mobilePattern = /^[0-9]{10}$/;

  //   if (!emailPattern.test(formData.email)) {
  //     alert("Please enter a valid email address.");
  //     return;
  //   }

  //   if (!mobilePattern.test(formData.mobile)) {
  //     alert("Please enter a valid 10-digit mobile number.");
  //     return;
  //   }

  //   // Submit the form or do something with formData
  //   console.log("Form submitted:", formData);
  // };



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData, () => {
      // Reset form after successful submission
      setFormData({
        name: "",
        organization: "",
        function: "",
        mobile: "",
        email: "",
        pincode: "",
        requirements: "",
      });
    }));
  };



  return (
    <>
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
                                onChange={handleChange}
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
                                id="Organization Name"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 mb-4">
                            <div className="form-group">
                              <TextField
                                label="Your Function "
                                variant="outlined"
                                className="w-100"
                                size="small"
                                type="text"
                                required
                                placeholder="Your Function "
                                id="Your Function "
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
                                type="text"
                                required
                                placeholder="E-Mail Address"
                                id="E-Mail Address"
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
                                id="Requirements"
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
