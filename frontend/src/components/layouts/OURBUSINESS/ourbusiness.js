import React from "react";
import "./ourbus.css";
import ourbusineeg1 from "../OURBUSINESS/OURBUSINESS--IMAGES/OURBUSINESSG1.png";
import { Link } from "react-router-dom";
import Nav from "../nav";
import MetaData from "../MetaData";

export default function Ourbusiness() {
  return (
    <>
      <MetaData title="Our Business | GLOCRE" />
      <Nav />

      <body className="container-fluid">
        <section className="empowering-global-section-procureg">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 empowering-global-left-procureg p-0">
                <img src={ourbusineeg1} className="img-fluid w-100" />
              </div>
              <div className="col-lg-6 p-0 mt-2 empowering-global-right-procureg">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">
                      Empowering Global Trade: Simplifying Industrial
                      Transactions with  Glocre
                    </h5>
                    <p class="card-text">
                      Glocre is a global e-commerce platform that connects
                      buyers and sellers, simplifying transactions with fast
                      shipping, reliable support, and opportunities for
                      consumers to expand their reach and ensure seamless,
                      high-quality experiences.
                    </p>
                    <Link to="/becomeseller">
                    <button className="mt-3">Get started</button>
                    </Link>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="our-business-section-procureg">
          <div className="container">
            <div className="our-business-contents-procureg">
              <h3>OUR BUSINESS AT GLOCRE</h3>
              <p>
                Glocre connects global buyers and sellers with
                seamless, efficient e - commerce solutions.
              </p>
            </div>
          </div>

          <div className="global-buyer-contents-procureg">
            <div class="card ">

              <div class=" global-buyer-full-contents-procureg container">
                <div className="row">
                  < div className="col-lg-6 mb-5 global-buyer-right-contents-procureg" >
                    <div className="row">
                      <div className="col-lg-6">
                        <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">Strategy</h5>
                            <p class="card-text">
                              Our strategy is to provide a seamless, efficient
                              e-commerce platform that connects global buyers
                              and sellers, offering fast shipping, reliable
                              customer support, and growth opportunities for
                              both businesses and consumers.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">Goal</h5>
                            <p class="card-text">
                              Our goal is to empower users in the global
                              industrial marketplace by simplifying product
                              transactions, expanding market reach, and
                              delivering high-quality products through a
                              reliable and user-friendly platform.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 global-buyer-right-contents-procureg">
                    <div className="row mt-4">
                      <div className="col-lg-6">
                        <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">What We Do</h5>
                            <p class="card-text">
                              We facilitate global transactions by offering an
                              e-commerce platform where buyers can easily
                              purchase industrial products, and consumers and
                              businesses can sell their products, growing their
                              reach and market presence.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">Why We Do It</h5>
                            <p class="card-text">
                              We aim to streamline the industrial marketplace by
                              providing innovative solutions that drive business
                              growth, enhance customer satisfaction, and foster
                              a global community of buyers and sellers..
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="our-core-section-procureg mt-5 mb-5">
          <div className="container">
            <div className="our-core-heading-procureg">
              <h3>OUR CORE VALUES</h3>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="row g-4" style={{ width: "100%", maxWidth: "1700px" }}>
                <div className="col-lg-6 pl-0">
                  <div className="our-core-sub-section-procureg p-4" style={{ backgroundColor: "#fff", borderRadius: "15px" }}>
                    <h3>Customer-Centricity</h3>
                    <p>
                      We focus on delivering exceptional customer experiences through fast
                      shipping, reliable support, and seamless transactions. Our goal is to
                      consistently meet and exceed customer expectations, building
                      long-lasting relationships.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 pl-0">
                  <div
                    className="our-core-sub-section-procureg p-4"
                    style={{ backgroundColor: "#fff", borderRadius: "15px" }}
                  >
                    <h3>Innovation</h3>
                    <p>
                      We continuously improve our platform using the latest technology to
                      simplify the buying and selling process. By staying ahead of market
                      trends, we ensure our users have access to efficient,
                      state-of-the-art solutions.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 pl-0">
                  <div
                    className="our-core-sub-section-procureg p-4"
                    style={{ backgroundColor: "#fff", borderRadius: "15px" }}
                  >
                    <h3>Global Connectivity</h3>
                    <p>
                      We bridge the gap between buyers and sellers worldwide, enabling
                      businesses to expand their reach and engage in cross-border trade.
                      Our platform promotes global commerce and fosters international
                      growth opportunities.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 pl-0">
                  <div
                    className="our-core-sub-section-procureg p-4"
                    style={{ backgroundColor: "#fff", borderRadius: "15px" }}
                  >
                    <h3>Reliability</h3>
                    <p>
                      We are committed to providing dependable service with consistent,
                      high-quality experiences. Our focus on trust and reliability ensures
                      customers can count on us for timely support and smooth transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>

        <section className="empower-accelerate-section-procureg">
          <div className="container empower-accelerate-heading-procureg">
            <h3>
              Together, we connect, empower, and accelerate your <br /> business
              on a global scale
            </h3>
            <p>
              We collaborate to expand your reach, enhance growth, and drive
              success in <br /> the global marketplace.
            </p>
          </div>

          <div className="container empower-accelerate-4card-procureg">
            <div className="row ">
              <div className="col-lg-4">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">01</h5>
                    <h6 class="card-subtitle mb-2">
                      Sign Up & Product Listing
                    </h6>
                    <p class="card-text">
                      Create an account and list your industrial products or
                      explore available options on our platform.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4" style={{ marginTop: "10%" }}>
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">02</h5>
                    <h6 class="card-subtitle mb-2">Order Placement</h6>
                    <p class="card-text">
                      Buyers place secure orders, and sellers efficiently
                      process them with fast shipping and reliable service.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4" style={{ marginTop: "20%" }}>
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">03</h5>
                    <h6 class="card-subtitle mb-2">Customer Support</h6>
                    <p class="card-text">
                      Our dedicated support team ensures smooth transactions,
                      and feedback helps improve the overall experience for all
                      users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="key-benefits-section-procureg">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 key-benefits-left-procureg">
                <h3>
                  Key Benefits of  Glocre: Empowering Global Trade <br /> and
                  Growth
                </h3>
                <p>
                  Glocre provides businesses and consumers with global reach,
                  seamless transactions, and growth opportunities on an
                  efficient,
                  <br /> reliable platform for industrial success.
                </p>
              </div>
              <div className="col-lg-7 ">
                <div className="key-benefits-right-procureg">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Global Reach:</h5>
                      <p class="card-text">
                        Glocre connects buyers and sellers globally, breaking
                        down geographical barriers for seamless cross-border
                        trade. This opens up access to a larger, international
                        marketplace.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="key-benefits-right-procureg mt-3">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Seamless Transactions:</h5>
                      <p class="card-text">
                        Our platform simplifies the purchasing and selling
                        process, ensuring fast shipping and dependable customer
                        support for smooth transactions. We make every step easy
                        and efficient.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="key-benefits-right-procureg mt-3">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Business Growth Opportunities:</h5>
                      <p class="card-text">
                        We provide businesses and consumers with the tools and
                        resources needed to expand their reach, optimize sales,
                        and thrive in the global marketplace.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="buying-selling-section-procureg mb-5">
          <div class="card ">
            <div class=" container">
              <div className="buying-selling-contents-procureg">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="">
                      <h5 class="card-title text-dark">01</h5>
                      <h6 class="card-title">Buying on  Glocre</h6>
                      <p class="card-text">
                        Glocre offers buyers easy access to a wide variety of{" "}
                        <br /> industrial products from global sellers. With a
                        user-friendly platform, <br /> secure transactions, fast
                        shipping, and reliable customer support, we ensure{" "}
                        <br /> a seamless and efficient purchasing experience.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 text-end">
                    <div className="">
                      <h5 class="card-title text-dark" > 02 </h5>
                        <h6 class="card-title">Selling on  Glocre</h6>
                        <p class="card-text">
                          For sellers,  Glocre provides an opportunity to reach a
                          global marketplace, expand their business, and increase
                          sales. Our platform offers tools and resources to help
                          sellers manage listings, process orders, and deliver
                          products efficiently, driving growth and success.
                        </p>
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
