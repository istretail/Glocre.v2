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
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { faCartShopping, faList, faDashboard, faShoppingBag, faSort, faPencil, faUserPlus, faShoppingCart, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Drawer from '@mui/material/Drawer';

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


  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <>
      <div className="headerWrapper">
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
                      placeholder="Lets us know What you are looking for ?"
                      onChange={e => setKeyword(e.target.value)}
                      value={keyword}
                    />
                    <SearchIcon className="searchIcon cursor ms-2" />
                  </div>
                </div>
              </div>

              <div className="col-sm-5 d-flex align-items-center part3 res-hide">
                <div className="ml-auto d-flex align-items-center">
                  {/* <div className="countryWrapper">
                    <Select
                      data={countryData}
                      placeholder={'All'}
                      icon={
                        <LocationOnOutlinedIcon style={{ opacity: '0.5' }} />
                      }
                      view="country"
                      selectedSelectBoxItem={selectedSelectBoxItem}
                    />
                  </div> */}

                  <ul className="list list-inline mb-0 headerTabs">
                    <li className="list-inline-item">
                      <Link to="/sell">
                        <button
                          type="button"
                          class="btn bg-light"
                          style={{ fontWeight: 'bolder' }}
                        >
                          {' '}
                          <CurrencyRupeeIcon className="" style={{ fontSize: "16px" }} /> SELL
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
                            {/* <li onClick={() => navigate('./ourbus')}>
                              <Link to="/ourbus">
                                <span className="drop-text">
                                  <BusinessOutlinedIcon className="me-2" /> Our
                                  Business
                                </span>
                              </Link>
                            </li> */}
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

      {/* Medium Mobile device */}
      <section
        className="mobile-navbar-glc"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1050,
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="d-flex justify-content- align-items-center">

          <div className="me-auto">
            <Link to="/">
              <img src={require("../../images/procure-g-logo.png")} className="" style={{ height: "35px" }} />
            </Link>
          </div>

          <Link to="/sell">
            <div className="d-flex justify-content-center align-items-center me-2" style={{ backgroundColor: "#f5f5f5", color: "#2f4d23", height: "35px", width: "35px", borderRadius: "50%", fontSize: "15px" }}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </Link>

          <div className="dropdown me-2">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#f5f5f5",
                color: "#2f4d23",
                height: "35px",
                width: "35px",
                borderRadius: "50%",
                fontSize: "15px",
                cursor: "pointer"
              }}
              id="dropdownMenuIconButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faUser} />
            </div>

            <ul
              className="dropdown-menu dropdown-menu-end mt-2"
              aria-labelledby="dropdownMenuIconButton"
            >
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <li>
                      <span
                        className="dropdown-item"
                        onClick={() => navigate('./admin/dashboard')}
                      >
                        <DashboardOutlinedIcon className="me-2" />
                        Dashboard
                      </span>
                    </li>
                  )}
                  {user?.role === 'seller' && (
                    <li>
                      <span
                        className="dropdown-item"
                        onClick={() => navigate('./seller/dashboard')}
                      >
                        <DashboardOutlinedIcon className="me-2" />
                        Seller Dashboard
                      </span>
                    </li>
                  )}
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => navigate('./myprofile')}
                    >
                      <AccountCircleOutlinedIcon className="me-2" />
                      Profile
                    </span>
                  </li>
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => navigate('./orders')}
                    >
                      <ShoppingCartOutlinedIcon className="me-2" />
                      My Orders
                    </span>
                  </li>
                  <li>
                    <span className="dropdown-item text-danger" onClick={logoutHandler}>
                      <LogoutOutlinedIcon className="me-2" />
                      Log Out
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => navigate('./login')}
                    >
                      <i className="me-2 fas fa-sign-in-alt" /> Log In
                    </span>
                  </li>
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => navigate('./register')}
                    >
                      <i className="me-2 fas fa-user-plus" /> Sign Up
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>


          <Link to="/cart">
            <div className="d-flex justify-content-center align-items-center me-2" style={{ backgroundColor: "#f5f5f5", color: "#2f4d23", height: "35px", width: "35px", borderRadius: "50%", fontSize: "15px" }}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
          </Link>

          <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: "#ffad63", color: "#fff", height: "35px", width: "35px", borderRadius: "50%", fontSize: "15px" }} onClick={toggleDrawer}>
            <FontAwesomeIcon icon={faList} />
          </div>

          <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer" style={{ width: "500px" }}>
            <div className="drawer-header">
              <img src={require("../../images/procure-g-logo.png")} className="" style={{ height: "50px" }} />
            </div>
            <div className="drawer-content">
              <ul className="drawer-links">
                <li><Link to="/"><FontAwesomeIcon icon={faDashboard} style={{ marginRight: "15px" }} />Jacks</Link></li>
                <li><Link to="/"><FontAwesomeIcon icon={faCartShopping} style={{ marginRight: "15px" }} />Wire</Link></li>
                <li><Link to="/"><FontAwesomeIcon icon={faShoppingBag} style={{ marginRight: "15px" }} />Corriender</Link></li>
              </ul>
            </div>
          </Drawer>

        </div>
      </section>


    </>
  );
}
