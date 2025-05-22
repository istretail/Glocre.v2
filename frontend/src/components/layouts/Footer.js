import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import "./Footer.css";
import Icon1 from "../../images/payment  (1).png";
import Icon3 from "../../images/payment  (2).png";
import Icon2 from "../../images/payment  (3).png";
import Icon4 from "../../images/payment  (4).png";
import Icon5 from "../../images/payment  (5).png";
import Logo from "../../images/procure-g-logo.png";
import { Link } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { Button } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import NewsletterImg from "../../images/banner-3 1.png";
import { subscribe } from '../../actions/userActions'
import { toast } from "react-toastify";
// newsletter
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const Footer = () => {
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email.trim()) {
      return toast.error('Please enter a valid email');
    }

    dispatch(subscribe(email))
      .then(() => {
        setEmail(''); // Clear input on success
      })
      .catch(() => {
        // Error is already handled in action via toast, so no need here
      });
  };

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
              <p>Official or personal, shop everything <br />you need with us</p>
              <br />
              <div className="newsLetterBanner">
                <SendOutlinedIcon className="newsiconfooter" />
                <input type="text" placeholder="Your email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                <Button className="bg-g" onClick={handleSubscribe}>Subscribe</Button>
              </div>
              <div className="mobile-newsletter">
                <div className="input-wrapper">
                  <SendOutlinedIcon className="input-icon" />
                  <input type="email" placeholder="Your email address" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button className="subscribe-button" onClick={handleSubscribe}>Subscribe</button>
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
                  &nbsp; <strong>We are Located at :</strong>
                  <br /> 2 A, Meenakshi Gardens G.N Mills,
                  <br /> Coimbatore,
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
                        <Link to="/ourbusiness">Who We Are</Link>
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
                      Let Us Help You
                      <hr style={{ width: "80%" }}></hr>
                    </h3>
                    <ul class="footer-list mb-sm-5 mb-md-0">
                      <li>
                        <Link to="/myprofile">My Profile</Link>
                      </li>
                      <li>
                        <Link to="/faqs">FAQ's</Link>
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

                  <div className="col">
                    <h3>
                      {" "}
                      Sell with Us
                      <hr style={{ width: "80%" }}></hr>
                    </h3>
                    <ul class="footer-list mb-sm-5 mb-md-0">
                      <li>
                        <Link to="/becomeseller">Sell on Glocre</Link>
                      </li>
                      <li>
                        <Link to="/support">Advertise Your Products</Link>
                      </li>
                      <li>
                        <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/becomeseller'}>
                          Track Your Sales
                        </Link>
                      </li>

                    </ul>
                  </div>


                </div>
              </div>
            </div>

            <hr />

            <div className="row lastStrip">
              <div className="col-md-6 part3 row part_3">
                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-sm-start text-center text-sm-start w-100">
                  <h5 className="mb-2 mb-sm-0 me-sm-2">We Accept Payment through:</h5>
                  <ul className="list-inline d-flex flex-wrap justify-content-center justify-content-sm-start align-items-center mb-0">
                    <li className="list-inline-item mx-2">
                      <img src={Icon1} style={{ height: "40px" }} alt="payment-icon-1" />
                    </li>
                    <li className="list-inline-item mx-2">
                      <img src={Icon2} style={{ height: "40px" }} alt="payment-icon-2" />
                    </li>
                    <li className="list-inline-item mx-2">
                      <img src={Icon4} style={{ height: "40px" }} alt="payment-icon-3" />
                    </li>
                    <li className="list-inline-item mx-2">
                      <img src={Icon5} style={{ height: "17px" }} alt="payment-icon-4" />
                    </li>
                    <li className="list-inline-item mx-2">
                      <img src={Icon3} style={{ height: "20px" }} alt="payment-icon-5" />
                    </li>
                  </ul>
                </div>
              </div>


              <div className="col-md-6 part_1 d-flex align-items-center justify-content-center justify-content-md-end text-center text-md-end">
                <ul className="list-inline d-flex flex-wrap align-items-center justify-content-center justify-content-md-end mb-0">
                  <li className="list-inline-item mx-2">
                    <Link to="/terms">
                      <p className="mb-0">Terms & Conditions |</p>
                    </Link>
                  </li>
                  <li className="list-inline-item mx-2">
                    <Link to="/policy">
                      <p className="mb-0">Privacy Policy |</p>
                    </Link>
                  </li>
                  <li className="list-inline-item mx-2">
                    <Link to="/return">
                      <p className="mb-0">Return Policy</p>
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
            <hr />

            <div className="row lastStrip">
              <div className="col-md-6 part_1 d-flex align-items-center justify-content-center justify-content-md-start text-center text-md-start mb-2 mb-md-0">
                <p className="mb-0">
                  Copyright © {currentYear} GLOCRE All rights reserved.
                </p>
              </div>

              <div className="col-md-6 part3 part_3">
                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-md-end text-center text-md-end w-100">
                  <h5 className="mb-2 mb-sm-0 me-sm-2">Follow Us:</h5>
                  <ul className="list list-inline d-flex justify-content-center justify-content-md-end align-items-center mb-0 pl-0">
                    <li className="list-inline-item mx-2">
                      <a
                        href="https://www.facebook.com/ISTforyou"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FacebookOutlinedIcon />
                      </a>
                    </li>
                    <li className="list-inline-item mx-2">
                      <a href="mailto:support@glocre.com">
                        <EmailOutlinedIcon />
                      </a>
                    </li>
                    <li className="list-inline-item mx-2">
                      <a
                        href="https://www.instagram.com/ist_retail/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
