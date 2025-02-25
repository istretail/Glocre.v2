import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../layouts/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, logout } from "../../actions/userActions";
import { getCartItemsFromCart } from "../../actions/cartActions";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../images/procure-g-logo.png";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import Select from '@mui/material/Select';
import Select from "../layouts/select";
import AddIcon from "@mui/icons-material/Add";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const { items } = useSelector((state) => state.cartState);
  const { wishlist } = useSelector((state) => state.wishlistState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [showMobileInput, setShowMobileInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (keyword.trim() !== "") {
      navigate(`/search/${keyword}`);
    }
  }, [keyword, navigate]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") {
      toast.error("Please enter a keyword");
      return;
    }
    // navigate(`/search/${keyword}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowMobileInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setKeyword("");
    }
  }, [location]);

  const logoutHandler = () => {
    dispatch(logout);
    return navigate("/login");
  };

  useEffect(() => {
    dispatch(getCartItemsFromCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     let position = window.pageYOffset;
  //     if (position > 100) {
  //       headerRef.current.classList.add("fixed");
  //     } else {
  //       headerRef.current.classList.remove("fixed");
  //     }
  //   });

  //   getCountry("https://countriesnow.space/api/v0.1/countries/");
  // }, []);

  const headerRef = useRef();
  const [countryData, setCountryData] = useState([]);
  const countryList = [];
  const getCountry = async (url) => {
    try {
      await axios.get(url).then((res) => {
        if (res !== null) {
          //console.log(res.data.data);
          res.data.data.map((item, index) => {
            countryList.push(item);
            //console.log(item.country)
          });

          //console.log(countryList)
          setCountryData(countryList);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const selectedSelectBoxItem = (name, id) => {
    if (name === "Your Location") {
      localStorage.setItem("location", "All");
    } else {
      localStorage.setItem("location", name);
    }
    window.location.href = "/";
  };

  return (
    <>
      <div className="headerWrapper" ref={headerRef}>
        <header>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-2 part1 d-flex align-items-center">
                <Link to="/">
                  <img src={logo} className="logo" />
                </Link>
              </div>

              <div className="col-sm-5 part2">
                <div className="headerSearch d-flex align-items-center">
                  <div
                    className="search d-flex align-items-center"
                    ref={inputRef}
                    onSubmit={searchHandler}
                  >
                    <input
                      type="text"
                      id="search_field"
                      className=" desktop-search"
                      placeholder="Search for items..."
                      onChange={e => setKeyword(e.target.value)}
                      value={keyword}
                    />
                    <SearchIcon className="searchIcon cursor ms-2" />
                  </div>
                </div>
              </div>

              <div className="col-sm-5 d-flex align-items-center part3 res-hide">
                <div className="ml-auto d-flex align-items-center">
                  <div className="countryWrapper">
                    <Select
                      data={countryData}
                      placeholder={'All'}
                      icon={
                        <LocationOnOutlinedIcon style={{ opacity: '0.5' }} />
                      }
                      view="country"
                      selectedSelectBoxItem={selectedSelectBoxItem}
                    />
                  </div>

                  <ul className="list list-inline mb-0 headerTabs">
                    <li className="list-inline-item">
                      <Link to="/sell">
                        <button
                          type="button"
                          class="btn bg-light"
                          style={{ fontWeight: 'bolder' }}
                        >
                          {' '}
                          <AddIcon /> SELL
                        </button>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link to="/wishlist">
                        <span>
                          <FavoriteBorderOutlinedIcon />
                          <span className="badge  rounded-circle">
                            {wishlist.length}
                          </span>
                          Wishlist
                        </span>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <span>
                        <Link to="./cart" id="cart">
                          <ShoppingCartOutlinedIcon />
                          <span className="badge  rounded-circle">
                            {items.length}
                          </span>
                          Cart
                        </Link>
                      </span>
                    </li>
                    <li className="list-inline-item">
                      {isAuthenticated ? (
                        <div className="dropdown">
                          <button
                            className="btn custom-dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <Person2OutlinedIcon className="me-2" />
                            Account
                          </button>
                          <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li>
                              {user?.role === 'admin' && (
                                <span
                                  className="drop-text"
                                  onClick={() => navigate('./admin/dashboard')}
                                >
                                  <DashboardOutlinedIcon className="me-2" />{' '}
                                  Dashboard
                                </span>
                              )}
                            </li>
                            <li>
                              {user?.role === 'seller' && (
                                <span
                                  className="drop-text"
                                  onClick={() => navigate('./seller/dashboard')}
                                >
                                  <DashboardOutlinedIcon className="me-2" />{' '}
                                  Seller DashBoard
                                </span>
                              )}
                            </li>

                            <li onClick={() => navigate('./myprofile')}>
                              <Link to="/orders">
                                <span className="drop-text">
                                  <AccountCircleOutlinedIcon className="me-2" />{' '}
                                  Profile
                                </span>
                              </Link>
                            </li>
                            <li onClick={() => navigate('./ourbus')}>
                              <Link to="/ourbus">
                                <span className="drop-text">
                                  <BusinessOutlinedIcon className="me-2" /> Our
                                  Business
                                </span>
                              </Link>
                            </li>
                            <li onClick={() => navigate('./orders')}>
                              <Link to="/myList">
                                <span className="drop-text">
                                  <ShoppingCartOutlinedIcon className="me-2" />{' '}
                                  My Orders
                                </span>
                              </Link>
                            </li>
                            <li onClick={logoutHandler}>
                              <span className="drop-text">
                                <LogoutOutlinedIcon className="me-2" /> Log Out
                              </span>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div
                          className="dropdown"
                          style={{ position: 'relative' }}
                        >
                          <button
                            style={{
                              fontSize: '14px',
                              borderRadius: '0%',
                              fontWeight: 'bold',
                            }}
                            className="btn btn-success dropdown-toggle text-white custom-dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Sign in
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                            style={{
                              zIndex: 1050, // Bootstrap's default high z-index for dropdowns
                              position: 'absolute', // Ensure it's positioned correctly
                            }}
                          >
                            <li>
                              <p
                                className="dropdown-item"
                                onClick={() => navigate('./login')}
                              >
                                Log in
                              </p>
                            </li>
                            <li>
                              <p
                                className="dropdown-item"
                                onClick={() => navigate('./register')}
                              >
                                Sign In
                              </p>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="afterHeader"></div>
    </>
  );
}
