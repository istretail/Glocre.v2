import React from "react";
import "./seller.css";
import prosellerimg1 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG1.png";
import prosellerimg2 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG2.png";
import prosellerimg3 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG3.png";
import prosellerimg4 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG4.png";
import prosellerimg5 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG5.png";
import prosellerimg6 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG6.png";
import prosellerimg7 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG7.png";
import prosellerimg8 from "../SELLERPAGE/SELLERPAGE--IMAGES/SELLERPAGEIMG8.png";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";
import { useNavigate } from "react-router-dom";
export default function ProcuregSeller() {
  const navigate = useNavigate();
  const registerHandler = () => {
    navigate("/login?redirect=register/seller");
  };
  return (
    <>
    <MetaData title={"Become a Seller"} />
      {/* START YOUR B2B */}
      <section className="start-your-b2b-section-procureg">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 start-your-b2b-left-contents-procureg">
              <h3>
                START YOUR B2B <br /> PROCUREMENT WITH <br />
                <span>GLOCRE</span>
              </h3>
              <p>
                GLOCRE is a B2B procurement platform that streamlines the
                sourcing and purchasing process for businesses. It helps
                organizations efficiently manage suppliers, negotiate better
                deals, and optimize procurement workflows.
              </p>
              <Link onClick={registerHandler()} style={{ color: "white" }}> 
              <button className="col-lg-3 col-5 text-white">
                {" "}
                Register
              </button>
              </Link>
             
            </div>
            <div className="col-lg-6 start-your-b2b-right-contents-procureg">
              <div>
                <img src={prosellerimg1} className="img-fluid w-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="why-choose-section-procureg">
        <div className="container">
          <div className="why-choose-heading-procureg">
            <h3>
              Why choose B2B procurement with <br />
              <span>GLOCRE ?</span>
            </h3>
            <div>
              <p>
                At GLOCRE, we stand as a unique e-commerce platform offering a
                wide range of utility products to meet diverse industrial needs.
                We are committed to establishing ourselves as a 'trusted seller'
                hub, providing our sellers with a secure platform to grow their
                businesses on a larger scale. As your dedicated seller partner,
                we’ve seen substantial growth and success, with an ongoing goal
                of capturing businesses across India. Today, our website
                showcases an extensive collection of over 10,00,000+ SKUs
                sourced from globally recognized brands, positioning GLOCRE as
                a reliable and trusted destination for all industrial
                requirements.
              </p>
            </div>
          </div>
          <div className="why-choose-3-contents-procureg">
            <div className="row" style={{ marginLeft: "5%" }}>
              <div className="col-lg-4 mb-2">
                <div class="card">
                  <img src={prosellerimg6} />
                  <h5 class="card-title">Add Products</h5>
                </div>
              </div>
              <div className="col-lg-4 mb-2">
                <div class="card">
                  <img src={prosellerimg7} />
                  <h5 class="card-title">Available Globally</h5>
                </div>
              </div>
              <div className="col-lg-4 mb-2">
                <div class="card">
                  <img src={prosellerimg8} />
                  <h5 class="card-title">
                    Start selling <br /> with your GSTIN
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAY TO BECOME SELLER */}
      <center className="way-to-seller-section-procureg">
        <div className="way-to-seller-heading-procureg">
          {/* <button>HOW IT WORKS</button> */}
          <h3>
            Our way to become a seller process is <br /> <span>very easy</span>
          </h3>
        </div>
        <div className="way-to-seller-4-contents-procureg">
          <div className="row container">
            <div className="col-lg-3">
              <div class="card">
                <img src={prosellerimg2} />
                <div class="card-body">
                  <h5 class="card-title">
                    Sign up as a <br />
                    vendor
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div class="card">
                <img src={prosellerimg3} />
                <div class="card-body">
                  <h5 class="card-title">Add Products</h5>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div class="card">
                <img src={prosellerimg4} />
                <div class="card-body">
                  <h5 class="card-title">Receive Orders</h5>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div class="card">
                <img src={prosellerimg5} />
                <div class="card-body">
                  <h5 class="card-title">
                    Receive payment in <br /> your account
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </center>
    </>
  );
}
