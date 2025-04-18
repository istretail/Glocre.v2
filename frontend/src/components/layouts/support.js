import React, { useState } from "react";
import "./Footer.css";
import contactban from "../../images/GLOCRE-CONTACT-BANNER.png";
import enquirygif from "../../images/mogli-chat.gif";
import faqgif from "../../images/FAQs.gif";
import { Link } from "react-router-dom";

export default function Support() {

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;

    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!mobilePattern.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Submit the form or do something with formData
    console.log("Form submitted:", formData);
  };


  return (
    <>
      {/* CONTACT US FORM */}
      <body className="body-contact-glc">
        {/* Banner */}
        <section className="contact-banner-glc">
          <div>
            <img src={contactban} className="img-fluid w-100" />
          </div>
        </section>
        {/* Form */}
        {/* <form onSubmit={handleSubmit}> */}
        <section className="container mb-5">

          {/* Contact form Heading */}
          <div className="contact-heading-glc">
            <p>FILL BELOW FORM TO CONTACT US</p>
            <h2>WITH YOU REQUIREMENT</h2>
          </div>

          {/* Input Feilds */}

          <div className="row input-contact-glc">

            <div className="col-lg-6">
              <p>
                Your Name <span>*</span>
              </p>
              <input type="text" name="name" required onChange={handleChange} />
            </div>
            <div className="col-lg-6">
              <p>
                Organization Name
              </p>
              <input type="text" name="organization" onChange={handleChange} />
            </div>
            <div className="col-lg-6">
              <p>
                Your Function
              </p>
              <input type="text" name="function" onChange={handleChange} />
            </div>
            <div className="col-lg-6">
              <p>
                Mobile Number <span>*</span>
              </p>
              <input
                type="tel"
                name="mobile"
                required
                pattern="[0-9]{10}"
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-6">
              <p>
                E-Mail Address<span>*</span>
              </p>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-6">
              <p>
                Pincode <span>*</span>
              </p>
              <input type="text" name="pincode" required onChange={handleChange} />
            </div>
            <div className="col-12">
              <p>
                Your Requirements ( Feedback / Suggestions / New Product Enquiry ) <span>*</span>
              </p>
              <input
                type="text-area"
                id="fname"
                name="requirements" required
                style={{ height: "125px" }}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-center pt-3">
            <button
              className="btn"
              type="submit"
              style={{ backgroundColor: "#2f4d2a", color: "#fff" }}
            >
              Submit
            </button>
          </div>



        </section>
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
