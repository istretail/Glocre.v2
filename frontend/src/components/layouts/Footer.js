import React from "react";
import "./Footer.css";
import Icon1 from "../../images/payment  (1).png";
import Icon3 from "../../images/payment  (2).png";
import Icon2 from "../../images/payment  (3).png";
import Icon4 from "../../images/payment  (4).png";
import Logo from "../../images/procure-g-logo.png";
import { Link } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { Button } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import NewsletterImg from "../../images/newsletter.png";
// newsletter
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <section className="newsLetterSection">
        <div className="container-fluid">
          <div className="box d-flex align-items-center">
            <div className="info">
              <h2>
                Shop Smart, Shop Global
                <br />
                Glocre Delivers to You!
              </h2>
              <p>Start You'r Daily Shopping with us</p>
              <br />
              <div className="newsLetterBanner">
                <SendOutlinedIcon />
                <input type="text" placeholder="Your email address" />
                <Button className="bg-g">Subscribe</Button>
              </div>
            </div>

            <div className="img">
              <img src={NewsletterImg} className="w-100" />
            </div>
          </div>
        </div>
      </section>

      <div className="footerWrapper">
        <footer>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 part1">
                <Link to="/">
                  <img src={Logo} className="mb-3" />
                </Link>
                <br />
                <p>
                  <LocationOnOutlinedIcon />
                  &nbsp; <strong>Address :</strong>
                  2A, Meenakshi Gardens G.N Mills,
                  <br /> &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; Coimbatore,
                  Tamil Nadu 641029, India
                </p>
                <p>
                  <HeadphonesOutlinedIcon /> &nbsp;<strong>Call Us :</strong>{" "}
                  (+91) - 99438 94429{" "}
                </p>
                <p>
                  <EmailOutlinedIcon />
                  &nbsp; <strong>Email :</strong> support@glocre.com
                </p>
                <p>
                  <WatchLaterOutlinedIcon />
                  &nbsp; <strong>Support :</strong>
                  24/7 Customer Support
                </p>
              </div>

              <div className="col-md-9 part2">
                <div className="row">
                  <div className="col">
                    <h3>
                      Glocre
                      <hr style={{ width: "80%" }}></hr>
                    </h3>

                    <ul class="footer-list mb-sm-5 mb-md-0">
                      <li>
                        <Link to="/ourbus">Who We Are</Link>
                      </li>
                      <li>
                        <Link to="/sell">Become a Seller</Link>
                      </li>
                      <li>
                        <Link to="/policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link to="/terms">Terms &amp; Conditions</Link>
                      </li>
                      <li>
                        <Link to="/return">Return Policy</Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col">
                    <h3>
                      Quick Links
                      <hr style={{ width: "80%" }}></hr>
                    </h3>
                    <ul class="footer-list mb-sm-5 mb-md-0">
                      <li>
                        <Link to="/support">Support Center</Link>
                      </li>
                      <li>
                        <Link to="/orders">Track My Order</Link>
                      </li>
                      <li>
                        <Link to="/support">Online Assist</Link>
                      </li>
                      <li>
                        <Link to="/myprofile">My Profile</Link>
                      </li>
                      <li>
                        <Link to="/sell">Supply to Glocre</Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col">
                    <h3>
                      {" "}
                      Make Money with Us
                      <hr style={{ width: "80%" }}></hr>
                    </h3>
                    <ul class="footer-list mb-sm-5 mb-md-0">
                      <li>
                        <Link to="/sell">Sell on Glocre</Link>
                      </li>
                      <li>
                        <Link to="/support">Advertise Your Products</Link>
                      </li>
                      <li>
                        <Link to="/sell">Sell and Build Your Brand</Link>
                      </li>
                      <li>
                        <Link to="/sell">Global Selling</Link>
                      </li>
                      <li>
                        <Link to="/support">Connect us</Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col">
                    <h3>
                      Let Us Help You
                      <hr style={{ width: "80%" }}></hr>
                    </h3>
                    <ul class="footer-list mb-sm-5 mb-md-0">
                      <li>
                        <Link to="/myprofile">My Profile</Link>
                      </li>
                      <li>
                        <Link to="/support">Faqs</Link>
                      </li>
                      <li>
                        <Link to="/orders">My Order</Link>
                      </li>
                      <li>
                        <Link to="/return">Cancellation &amp; Return</Link>
                      </li>
                      <li>
                        <Link to="/support">Customer Services</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="row lastStrip">
              <div className="col-md-6 part3 d-flex align-items-center justify-content-start  part_3">
                <div className="d-flex align-items-center">
                  <h5>Payment: </h5>
                  <ul className="list-inline d-flex align-items-center">
                    <li className="list-inline-item">
                      <img
                        src={Icon1}
                        style={{ width: "fit-content", height: "40px" }}
                      />
                    </li>
                    <li className="list-inline-item">
                      <img
                        src={Icon2}
                        style={{ width: "fit-content", height: "40px" }}
                      />
                    </li>
                    <li className="list-inline-item">
                      <img
                        src={Icon4}
                        style={{ width: "fit-content", height: "40px" }}
                      />
                    </li>
                    <li className="list-inline-item">
                      <img
                        src={Icon3}
                        style={{ width: "fit-content", height: "40px" }}
                      />
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-6 part_1 d-flex align-items-center justify-content-end">
                <ul className="list-inline d-flex align-items-center">
                  <li className="list-inline-item ">
                    <Link to="/terms">
                      <p className="mb-0 list-inline-item ">
                        Terms & Conditions |
                      </p>
                    </Link>
                  </li>
                  <li className="list-inline-item mb-0">
                    <Link to="/policy">
                      <p className="mb-0 list-inline-item ">Privacy Policy |</p>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="/return">
                      <p className="mb-0 list-inline-item ">Return Policy</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <hr />

            <div className="row lastStrip">
              <div className="col-md-6 part_1 d-flex align-items-center">
                <p className="mb-0">
                  Copyright © 2025 GLOCRE All rights reserved.
                </p>
              </div>

              <div className="col-md-6 part3 d-flex align-items-center justify-content-end  part_3">
                <div className="d-flex align-items-center">
                  <h5>Follow Us : </h5>
                  <ul className="list list-inline">
                    <li className="list-inline-item">
                      <a
                        href="https://www.facebook.com/ISTforyou"
                        target="_blank"
                      >
                        <FacebookOutlinedIcon />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="mailto:support@glocre.com">
                        <EmailOutlinedIcon />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        href="https://www.instagram.com/ist_retail/?hl=en"
                        target="_blank"
                      >
                        <InstagramIcon />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        href="https://youtube.com/@ist_retail?si=Rt0R3LzJ3iaD7yTv"
                        target="_blank"
                      >
                        <YouTubeIcon />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* {context.windowWidth < 992 && context?.isBottomShow === true && (
        <div className="fixed-bottom-menu d-flex align-self-center justify-content-between">
          <Link to="/" onClick={() => context?.closeSearch()}>
            <Button className="circle">
              <div className="d-flex align-items-center justify-content-center flex-column">
                <IoHomeOutline />
                <span className="title">Home</span>
              </div>
            </Button>
          </Link>

          {context.enableFilterTab === true && (
            <Button className="circle" onClick={() => {
              openFilter();
              context?.closeSearch()
            }}>
              <div className="d-flex align-items-center justify-content-center flex-column">
                <CiFilter />
                <span className="title">Filters</span>
              </div>
            </Button>
          )}

          <Button className="circle" onClick={()=>context?.openSearch(true) }>
            <div className="d-flex align-items-center justify-content-center flex-column">
              <IoIosSearch />
              <span className="title">Search</span>
            </div>
          </Button>

          <Link to="/myList"  onClick={() => context?.closeSearch()}>
            <Button className="circle">
              <div className="d-flex align-items-center justify-content-center flex-column">
                <IoMdHeartEmpty />
                <span className="title">Wishlist</span>
              </div>
            </Button>
          </Link>

          <Link to="/orders"  onClick={() => context?.closeSearch()}>
          <Button className="circle">
            <div className="d-flex align-items-center justify-content-center flex-column">
              <IoBagCheckOutline />
              <span className="title">Orders</span>
            </div>
          </Button>
        </Link>
          

          <Link to="/my-account"  onClick={() => context?.closeSearch()}>
            <Button className="circle">
              <div className="d-flex align-items-center justify-content-center flex-column">
                <FaRegUser />
                <span className="title">Account</span>
              </div>
            </Button>
          </Link>
        </div>
      )} */}
    </>
  );
};

export default Footer;
