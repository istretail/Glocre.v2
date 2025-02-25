import React, { useEffect, useState } from "react";
import "./Trake.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPhone } from "@fortawesome/free-solid-svg-icons";

import trackorderimg1 from "../TRACKORDER/TRACKORDER -- IMAGES/product-1.443e2083a0b257268099.jpeg";
import Header from "../header/Header";

export default function Trackorderpage() {
  const [progress, setProgress] = useState(); // Initial progress
  const { orderStatus = "Order Confirmed" } = Trackorderpage;

  useEffect(() => {
    // Update progress based on orderStatus
    switch (orderStatus) {
      case "Order Confirmed":
        setProgress(17);
        break;
      case "Shipped":
        setProgress(50);
        break;
      case "Delivered":
        setProgress(99);
        break;
      default:
        setProgress(0); // Default to initial progress
        break;
    }
  }, [orderStatus]);

  return (
    <>
      <Header />

      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb" style={{ paddingLeft: "12px" }}>
        <ol class="container track-order-breadcrumb-procureg breadcrumb">
          <li class="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <span>Track Order</span>
          </li>
        </ol>
      </nav>

      {/* ORDER TRACKING */}
      <section className="container order-tracking-section-procureg">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">My Orders / Tracking</h6>

            <hr />

            <h5 class="card-title2">Order ID : OD4543657552 </h5>

            <div className="order-tracking-box-contents-procureg">
              <div className="row">
                <div className="col-lg-3">
                  <div className="">
                    <h5>Estimated time of delivery</h5>
                    <p>29 Nov 2024</p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="">
                    <h5>Shipped by</h5>
                    <p>
                      Bluedart, | <FontAwesomeIcon icon={faPhone} />{" "}
                      +18994754565{" "}
                    </p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="">
                    <h5>Status</h5>
                    <p>{orderStatus}</p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="">
                    <h5>Tracking #:</h5>
                    <p>BD4696366266 </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="order-tracking-2nd-hr mt-5" />

            <div style={{ margin: "3% 0" }}>
              <div
                className="progress"
                style={{ backgroundColor: "#fff", height: "7px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <div class="d-flex justify-content-around order-tracking-progress-contents-procureg">
              <div className="col-lg-4">
                <div>
                  <FontAwesomeIcon icon={faCheck} className="iconnn" />
                  <h6>Order Confirmed</h6>
                </div>
              </div>
              <div className="col-lg-4">
                <div>
                  <FontAwesomeIcon icon={faCheck} className="iconnn" />
                  <h6>Shipped</h6>
                </div>
              </div>
              <div className="col-lg-4">
                <div>
                  <FontAwesomeIcon icon={faCheck} className="iconnn" />
                  <h6>Delivered</h6>
                </div>
              </div>
            </div>

            <div className="order-tracking-pdf-contents-procureg">
              <div class="card col-3">
                <div class="card-body">
                  <div className="row">
                    <div className="col-lg-3">
                      <img
                        class="card-img-top"
                        src={trackorderimg1}
                        alt="Card image cap"
                      />
                    </div>
                    <div
                      className="col-lg-9"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div>
                        <h5>Biometric</h5>
                        <h6>Electronic</h6>
                        <p>7562222522122</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-tracking-buttons-procureg">
              <button>Download Invoice</button>
              <button>Back to home</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
