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

import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import Select from '@mui/material/Select';

import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import { faList, faShoppingCart, faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Drawer from '@mui/material/Drawer';
import { getCategories } from "../../actions/productActions";
import { Modal, Box, Typography } from "@mui/material";
import { Button } from "@mui/material";
export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const { categories = [], error } = useSelector((state) => state.categoryState);
  const { items } = useSelector((state) => state.cartState);
  const { wishlist: witems = [] } = useSelector(
    (state) => state.wishlistState,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [showMobileInput, setShowMobileInput] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch(getCategories());
  }, [dispatch, error]);

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
    dispatch(fetchWishlist());
    dispatch(getCartItemsFromCart());
    return navigate("/login");
  };

  useEffect(() => {
    dispatch(getCartItemsFromCart());
    dispatch(fetchWishlist());
  }, [dispatch]);






  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };


  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const confirmLogout = () => {
    logoutHandler(); // Your existing logout function
    setLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };
  console.log(witems.length)

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
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters, numbers, and spaces
                        const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                        setKeyword(cleanedValue);
                      }}
                      onKeyDown={(e) => {
                        if (e.target.selectionStart === 0 && e.key === " ") e.preventDefault();
                      }}
                      value={keyword}
                    />
                    <SearchIcon className="searchIcon cursor ms-2" />
                  </div>
                </div>
              </div>

              <div className="col-sm-5 d-flex align-items-center part3 res-hide">
                <div className="ml-auto d-flex align-items-center">

                  <ul className="list list-inline mb-0 headerTabs" style={{ cursor: "pointer" }}>
                    <li className="list-inline-item">
                      <Link to="/becomeseller">
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
                            {witems.length}
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
                            {/* <li onClick={logoutHandler}>
                              <span className="drop-text">
                                <LogoutOutlinedIcon className="me-2" /> Log Out
                              </span>
                            </li> */}

                            <li onClick={() => setLogoutModalOpen(true)}>
                              <span className="drop-text">
                                <LogoutOutlinedIcon className="me-2" /> Log Out
                              </span>
                            </li>

                            <Modal open={logoutModalOpen} onClose={cancelLogout}>
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  bgcolor: "background.paper",
                                  p: 4,
                                  borderRadius: 2,
                                  width: 300,
                                  border: "none",
                                  outline: "none",
                                }}
                              >
                                <Typography variant="h6" mb={2} align="center" fontSize={17} color="#8c8c8c">
                                  Are you sure you want to log out?
                                </Typography>
                                <Box display="flex" justifyContent="space-between">
                                  <Button
                                    onClick={confirmLogout}
                                    className="left-but"
                                    sx={{
                                      margin: "3px"
                                    }}
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    onClick={cancelLogout}
                                    className="right-but"
                                    sx={{
                                      margin: "3px"
                                    }}
                                  >
                                    No
                                  </Button>
                                </Box>
                              </Box>
                            </Modal>

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
                                Sign Up
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
          zIndex: 2000,
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>

          <div className="d-flex justify-content- align-items-center">
            <div className="me-auto">
              <Link to="/">
                <img src={require("../../images/procure-g-logo.png")} className="" style={{ maxHeight: "25px" }} />
              </Link>
            </div>

            <Link to="/becomeseller">
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
                style={{ cursor: "pointer" }}
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
                    {/* <li>
                      <span className="dropdown-item text-danger" onClick={logoutHandler}>
                        <LogoutOutlinedIcon className="me-2" />
                        Log Out
                      </span>
                    </li> */}
                    <li onClick={() => setLogoutModalOpen(true)}>
                      <span className="dropdown-item">
                        <LogoutOutlinedIcon className="me-2" /> Log Out
                      </span>
                    </li>

                    <Modal open={logoutModalOpen} onClose={cancelLogout}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          bgcolor: "background.paper",
                          p: 4,
                          borderRadius: 2,
                          width: 300,
                          border: "none",
                          outline: "none",
                        }}
                      >
                        <Typography variant="h6" mb={2} align="center" fontSize={17} color="#8c8c8c">
                          Are you sure you want to log out?
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Button
                            onClick={confirmLogout}
                            className="left-but"
                            sx={{
                              margin: "3px"
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={cancelLogout}
                            className="right-but"
                            sx={{
                              margin: "3px"
                            }}
                          >
                            No
                          </Button>
                        </Box>
                      </Box>
                    </Modal>

                  </>
                ) : (
                  <>
                    <li >
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

            <Link to="./cart">
              <div
                className="position-relative d-flex justify-content-center align-items-center me-2"
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "#2f4d23",
                  height: "35px",
                  width: "35px",
                  borderRadius: "50%",
                  fontSize: "15px",
                }}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ fontSize: "10px", backgroundColor: "#ffad63" }}
                >
                  {items.length}
                </span>
              </div>
            </Link>

            <Link to="/wishlist">
              <div
                className="position-relative d-flex justify-content-center align-items-center me-2"
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "#2f4d23",
                  height: "35px",
                  width: "35px",
                  borderRadius: "50%",
                  fontSize: "15px",
                }}
              >
                <FavoriteBorderOutlinedIcon />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ fontSize: "10px", backgroundColor: "#ffad63" }}
                >
                  {witems.length}
                </span>
              </div>
            </Link>

            <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: "#ffad63", color: "#fff", height: "35px", width: "35px", borderRadius: "50%", fontSize: "15px" }} onClick={toggleDrawer}>
              <FontAwesomeIcon icon={faList} />
            </div>

            <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer" style={{ width: "700px" }}>
              <div className="drawer-header">
                <img src={require("../../images/procure-g-logo.png")} className="" style={{ height: "50px" }} alt="glocre" />
              </div>

              <div className="drawer-content">
                <ul className="drawer-links">
                  {categories
                    .flatMap((main) =>
                      main.categories?.map((cat) => ({
                        maincategory: main.maincategory,
                        category: cat.category,
                        subcategories: cat.subcategories || [],
                      }))
                    )
                    .slice(0, 7)
                    .map((catItem, i) => (
                      <li className="" key={i}>
                        <div
                          className="cursor-pointer font-semibold flex justify-between items-center"
                          onClick={() => handleToggle(i)}
                        >
                          <span className="text-left">{catItem.category}</span>
                          <span className="text-gray-400 text-sm ms-2" style={{ fontSize: "10px", color: "#8c8c8c" }}>
                            {openIndex === i ? "▲" : "▼"}
                          </span>
                        </div>

                        {openIndex === i && (
                          <ul className="dropdown_menu mt-2">
                            {catItem.subcategories.map((sub, j) => (
                              <li
                                key={j}
                                className="cursor-pointer drawer-sub-li mb-0 pb-0 pt-0"
                                style={{ color: "#8c8c8c" }}
                                onClick={() => {
                                  navigate(`/maincategory/${catItem.maincategory}`, {
                                    state: {
                                      category: catItem.category,
                                      subcategory: sub,
                                    },
                                  });
                                  toggleDrawer(); // Close drawer after navigation
                                }}
                              >
                                {sub}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </Drawer>
          </div>

          <div className="d-flex" style={{ alignItems: "center" }}>
            <div className="col-md-10 col-lg-10 col-11 p-0">
              <div className="search d-flex align-items-center">
                <input
                  type="text"
                  id="search_field"
                  className="mobile-search mt-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only letters, numbers, and spaces
                    const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                    setKeyword(cleanedValue);
                  }}
                  value={keyword}
                  style={{
                    borderRadius: "0px",
                    border: "1px solid #ccc",
                    padding: "5px",
                    width: "98%",
                    height: "35px",
                    fontSize: "12px"
                  }}
                  onKeyDown={(e) => {
                    if (e.target.selectionStart === 0 && e.key === " ") e.preventDefault();
                  }}
                  placeholder="Let us know what you are looking for?"
                />
              </div>

            </div>
            <div className="col-md-2 col-lg-2 col-1 mt-2" style={{ backgroundColor: "#ffad63", color: "#fff", height: "35px", width: "35px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }} >
              <SearchIcon className="searchIcon cursor ms-1" />
            </div>
          </div>

        </div>
      </section>


    </>
  );
}


