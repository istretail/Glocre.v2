import React from "react";
import "./Footer.css";
import contactban from "../../images/GLOCRE-CONTACT-BANNER.png";
import enquirygif from "../../images/mogli-chat.gif";
import faqgif from "../../images/FAQs.gif";

export default function Support() {
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
                Name <span>*</span>
              </p>
              <input type="text" id="fname" name="fname" />
            </div>
            <div className="col-lg-6">
              <p>
                Mobile Number <span>*</span>
              </p>
              <input type="text" id="fname" name="fname" />
            </div>
            <div className="col-lg-6">
              <p>
                E-Mail Address <span>*</span>
              </p>
              <input type="text" id="fname" name="fname" />
            </div>
            <div className="col-lg-6">
              <p>
                ZIP/PIN Code <span>*</span>
              </p>
              <input type="text" id="fname" name="fname" />
            </div>
            <div className="col-12">
              <p>
                Department <span>*</span>
              </p>
              <input type="text" id="fname" name="fname" />
            </div>
            <div className="col-12">
              <p>
                Additional Requirements <span>*</span>
              </p>
              <input
                type="text-area"
                id="fname"
                name="fname"
                style={{ height: "125px" }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-center pt-3">
            <button
              className="btn"
              type="btn"
              style={{ backgroundColor: "#2f4d2a", color: "#fff" }}
            >
              Submit
            </button>
          </div>
        </section>
        {/* Enquiry */}
        <section
          className="contact-details-glc"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div className="container">
            <div className="row">
              <div className="mb-5">
                <h3 style={{ color: "#2f4d2a" }}>FOR ENQUIRY ?</h3>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div class="card">
                  <div class="card-body">
                    <div className="row" style={{ padding: "2% 0" }}>
                      <div className="col-lg-4">
                        <img src={enquirygif} className="img-fluid w-100" />
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
                          Need Any Assistance?
                        </h6>
                        <p class="card-text">Glocre is here to help you</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>
          </div>
        </section>
      </body>
    </>
  );
}
