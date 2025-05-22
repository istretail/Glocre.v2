import './sellerdashboard.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { getAdminProducts, getSellerProducts } from "../../actions/productActions";
import { getUsers } from '../../actions/userActions'
import { adminOrders as adminOrdersAction, getSellerOrders } from '../../actions/orderActions'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SellerSidebar from "./SellerSidebar";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { useState } from "react";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import avatar1 from '../../images/OIP.jpg';

// import img1 from '../../public/images/IMAGE-1.png';

export default function SellerDashboard() {
  const { products = [], sellerProductCount } = useSelector(state => state.productState);
  const { sellerOrders = [], orderCount, totalPrice } = useSelector(state => state.orderState);
  const dispatch = useDispatch();
  let outOfStock = 0;
  if (products.length > 0) {
    products.forEach(product => {
      if (product.stock === 0) {
        outOfStock = outOfStock + 1;
      }
    })
  }

  let totalAmount = 0;
  if (sellerOrders.length > 0) {
    sellerOrders.forEach(order => {
      totalAmount += order.totalPrice
    })
  }



  useEffect(() => {
    dispatch(getSellerProducts());
    dispatch(getSellerOrders())
  }, [])


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
      <section className="seller-dash-section">
        <div className="row container-fluid">
          <div className="col-12 col-lg-2">
            <SellerSidebar />
          </div>
            <div className="col-12 col-lg-10 col-md-12 pr-0">
            <Link to="/">
              <div className="mobile-logo p-2">
                <img src={require('../../images/procure-g-logo.png')} />
              </div>
            </Link>
            <div className="breadcrumbWrapperr">
              {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
              {isMobile ? (
                <div className="row mobile-topbar">
                  <div className="col-10">
                    <ul className="breadcrumb breadcrumb2 mb-0">
                      <li>
                        <Link to="/admin/dashboard" style={{ color: '#fff' }}>
                          Dashboard
                        </Link>
                      </li>
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
                    </ul>
                  </div>
                  <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
                    <div className="dash-cont-glc">
                      <div className="row">
                        <div className="topnav">
                          <div className="search-container">
                            <form className="d-flex">
                              <input
                                type="text"
                                placeholder="Search"
                                name="search"
                              />
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
                        <input
                          type="text"
                          placeholder="Search"
                          name="search"
                        />
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
                        style={{
                          backgroundImage: 'none',
                          border: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <FontAwesomeIcon icon={faFilter} />
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                </div>
              )}

              {/* Drawer Component */}
              <Drawer
                open={isDrawerOpen}
                onClose={toggleDrawer}
                direction="right"
                className="drawer"
              >
                <div className="drawer-header">
                  SELLER DASHBOARD
                  {/* <button className="drawer-close-btn" onClick={toggleDrawer}>&times;</button> */}
                </div>
                <div className="drawer-content">
                  <ul className="drawer-links">
                    <li>
                      <Link to="/seller/dashboard">
                        <FontAwesomeIcon icon={faDashboard} /> &nbsp;Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/products">
                        <FontAwesomeIcon icon={faCartShopping} />{' '}
                        &nbsp;Product List
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/products/create">
                        <FontAwesomeIcon icon={faShoppingBag} /> &nbsp;Create
                        Product
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/orders">
                        <FontAwesomeIcon icon={faSort} /> &nbsp;Order List
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/archive/product">
                        <FontAwesomeIcon icon={faSort} /> &nbsp;Archived Products
                      </Link>
                    </li>
                  </ul>
                </div>
              </Drawer>
            </div>

            <h3 style={{ color: '#ffad63', marginTop: '40px' }}>DASHBOARD</h3>


            <div className="row">
              <section className="seller-dashboard-section-procureg">
                <div className="row seller-dashboard-contents-procureg">
                  <div className="col-lg-4 col-sm-6 mb-3">
                    <div class="card">
                      <Link className="" to="">
                        <div
                          class="card-body"
                          style={{ backgroundColor: '#f5f5f5' }}
                        >
                          {/* content1 */}
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-3">
                              <FontAwesomeIcon
                                icon={faMoneyBillTrendUp}
                                className="icon-tick-procureg text-black"
                              />
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9">
                              <h6 className="card-title-1">Total Sales</h6>
                              {/* <p className="card-title-2">100 Orders</p> */}
                            </div>
                          </div>
                          <h3 className="card-title-3">
                            ₹ {Math.round(totalPrice)}
                          </h3>
                          <div className="d-flex justify-content-between">
                            <p className="card-title-4 text-black">
                              <FontAwesomeIcon
                                icon={faMoneyBillTrendUp}
                                className="me-2"
                              />
                              0
                            </p>
                            {/* <p className="card-title-5" style={{ marginTop: "4%" }}>+0.15k <span className="card-title-6"> in this week</span></p> */}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-3">
                    <div class="card">
                      <Link className="" to="/seller/products">
                        <div
                          class="card-body"
                          style={{ backgroundColor: '#f5f5f5' }}
                        >
                          {/* content2 */}
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-3">
                              <FontAwesomeIcon
                                icon={faCartShopping}
                                className="icon-tick-procureg text-black"
                              />
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9">
                              <h6 className="card-title-1">Products</h6>
                              {/* <p className="card-title-2">50+ products added </p> */}
                            </div>
                          </div>
                          <h3 className="card-title-3">
                            {sellerProductCount}
                          </h3>
                          <div className="d-flex justify-content-between">
                            <p className="card-title-4">
                              <FontAwesomeIcon
                                icon={faMoneyBillTrendUp}
                                className="me-2"
                              />
                              0
                            </p>
                            {/* <p className="card-title-5" style={{ marginTop: "4%" }} >+0.3k <span className="card-title-6">in this week</span></p> */}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6">
                    <div class="card">
                      <Link className="" to="/seller/orders">
                        <div
                          class="card-body"
                          style={{ backgroundColor: '#f5f5f5' }}
                        >
                          {/* content3 */}
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-3">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="icon-tick-procureg text-black"
                              />
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9">
                              <h6 className="card-title-1">Orders</h6>
                              {/* <p className="card-title-2">More than50+ visitors </p> */}
                            </div>
                          </div>
                          <h3 className="card-title-3">{orderCount}</h3>
                          <div className="d-flex justify-content-between">
                            <p className="card-title-4">
                              <FontAwesomeIcon
                                icon={faMoneyBillTrendUp}
                                className="me-2"
                              />
                              0
                            </p>
                            {/* <p className="card-title-5" style={{ marginTop: "4%" }} >+0.7k <span className="card-title-6">in this week</span></p> */}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}