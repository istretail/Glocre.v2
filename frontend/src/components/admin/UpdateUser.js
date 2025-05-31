import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from "react-router-dom";
import { getUser, updateUser } from "../../actions/userActions";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faCartShopping, faFilter, faPencil, faSearch, faDashboard, faList, faShoppingBag, faSort, faUserPlus, } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import MetaData from "../layouts/MetaData";

export default function UpdateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { id: userId } = useParams();

  const { loading, isUserUpdated, error, user } = useSelector(state => state.userState)
  const { user: authUser } = useSelector(state => state.authState)

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    dispatch(updateUser(userId, formData))
  }

  useEffect(() => {
    if (isUserUpdated) {
      toast('User Updated Succesfully!', {
        type: 'success',
        onOpen: () => dispatch(clearUserUpdated())
      })
      return;
    }

    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      })
      return
    }

    dispatch(getUser(userId))
  }, [isUserUpdated, error, dispatch])


  useEffect(() => {
    if (user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user])

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Navbar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
    <MetaData title={`Update User | GLOCRE`} />
      <section className="updateuser-section">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-10 col-md-12 pr-0">
            <div className="mobile-logo">
              <img src={require("../../images/procure-g-logo.png")} />
            </div>
            <div className="breadcrumbWrapperr">

              {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
              {isMobile ? (
                <div className="row mobile-topbar">
                  <div className="col-10">
                    <ul className="breadcrumb breadcrumb2 mb-0">
                      <li>
                        <Link to="/admin/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/admin/users" style={{ color: "#fff" }}>User List</Link>
                      </li>
                      <li>Update User List</li>
                    </ul>
                  </div>
                  <div className="col-2 p-0 d-flex justify-content-center align-items-center">
                    <button className="fab" onClick={toggleDrawer}>
                      <FontAwesomeIcon icon={faList} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row dash-navbar-big-glc small-sticky-navbar">
                  <div className="col-lg-3 col-md-12">
                    <ul className="breadcrumb breadcrumb2 mb-0">
                      <li>
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/admin/users">User List</Link>
                      </li>
                      <li>Update User List</li>
                    </ul>
                  </div>
                  <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
                    <div className="dash-cont-glc">
                      <div className="row">
                        <div className="topnav">
                          <div className="search-container">
                            <form className="d-flex">
                              <input type="text" placeholder="Search" name="search" />
                              <button type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-1 col-md-2 d-flex justify-content-center align-items-end">
                    <Dropdown className="d-inline">
                      <Dropdown.Toggle
                        variant="default"
                        id="dropdown-basic"
                        className="custom-filter-toggle"
                      >
                        <FontAwesomeIcon icon={faFilter} />
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                </div>
              )}
              {/* Search, Filter & Avatar Row (For Mobile) */}
              {isMobile && (
                <div className="row mobile-bottombar">
                  <div className="col-9 col-md-10 pr-0">
                    <div className="search-container">
                      <form className="d-flex">
                        <input type="text" placeholder="Search" name="search" />
                        <button type="submit">
                          <FontAwesomeIcon icon={faSearch} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-3 col-md-2  d-flex justify-content-center align-items-end">
                    <Dropdown className="d-inline">
                      <Dropdown.Toggle
                        variant="default text-white"
                        id="dropdown-basic"
                        className="text-dark dropdown1 icon-list-filter-procureg"
                        style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                      >
                        <FontAwesomeIcon icon={faFilter} />
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                </div>
              )}

              {/* Drawer Component */}
              <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer">
                <div className="drawer-header">
                  ADMIN DASHBOARD
                  {/* <button className="drawer-close-btn" onClick={toggleDrawer}>&times;</button> */}
                </div>
                <div className="drawer-content">
                  <ul className="drawer-links">
                    <li><Link to="/admin/dashboard"><FontAwesomeIcon icon={faDashboard} /> &nbsp;Dashboard</Link></li>
                    <li><Link to="/admin/products"><FontAwesomeIcon icon={faCartShopping} /> &nbsp;Product List</Link></li>
                    <li><Link to="/admin/products/create"><FontAwesomeIcon icon={faShoppingBag} /> &nbsp;Create Product</Link></li>
                    <li><Link to="/admin/orders"><FontAwesomeIcon icon={faSort} /> &nbsp;Order List</Link></li>
                    <li><Link to="/admin/users"><FontAwesomeIcon icon={faUserPlus} /> &nbsp;User List</Link></li>
                    <li><Link to="/admin/reviews"><FontAwesomeIcon icon={faPencil} /> &nbsp;Review List</Link></li>
                    <li><Link to="/admin/edit-banner"><FontAwesomeIcon icon={faPencil} className="me-2" />Banner</Link></li>
                    <li><Link to="/admin/awsimages"><FontAwesomeIcon icon={faPencil} className="me-2" />Images</Link></li>
                  </ul>
                </div>
              </Drawer>

            </div>


            <h3 style={{ color: "#ffad63", marginTop: "40px" }}>UPDATE USER</h3>
            <p>Glocre</p>


            <div className="update-user-glc">
              <form
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Email</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    // onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div className="form-group custom-select-wrapper">
                  <label htmlFor="category_field">Role</label>
                  <select
                    disabled={user._id === authUser._id}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-control custom-select"
                    id="category_field"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <>
                  <p>
                    <b className="info-box-p-b" style={{ width: "110px", fontSize: "clamp(0.7rem, 2vw, 16px)" }}>GST Number </b>
                    <b className="info-box-p-b2" style={{ fontSize: "clamp(0.7rem, 2vw, 16px)" }}>:    </b>
                    <span className="info-box-p-span" style={{ fontSize: "clamp(0.7rem, 2vw, 16px)" }}>
                      {user?.gstNumber && user.gstNumber.length > 0 ? (
                        `  ${user.gstNumber}`
                      ) : (
                          "  User has no address"
                      )}
                    </span>
                  </p>
                  <p>
                    <b className="info-box-p-b" style={{ width: "110px", fontSize: "clamp(0.7rem, 2vw, 16px)" }}>Business Address</b>
                    <b className="info-box-p-b2" style={{ fontSize: "clamp(0.7rem, 2vw, 16px)" }}>:  </b>
                    <span className="info-box-p-span" style={{ fontSize: "clamp(0.7rem, 2vw, 16px)" }}>
                        {user?.businessAddress && user.businessAddress.length > 0 ? (
                        `${user.businessAddress[0].address}, ${user.businessAddress[0].addressLine}, ${user.businessAddress[0].city}, ${user.businessAddress[0].state} - ${user.businessAddress[0].postalCode}, ${user.businessAddress[0].country}`
                      ) : (
                        "User has no address"
                      )}
                    </span>
                  </p>
                </>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    id="login_button"
                    type="submit"
                    disabled={loading}
                    className="btn p-2 mt-3"
                    style={{ backgroundColor: "#ffad63", color: "#fff" }}
                  >
                    UPDATE
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}