import Sidebar from "./Sidebar";
import './dash.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { getAdminProducts } from "../../actions/productActions";
import { getUsers } from '../../actions/userActions'
import { adminOrders as adminOrdersAction } from '../../actions/orderActions'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping,  faMoneyBillTrendUp,  faUser, faFilter, faPencil, faSearch, faDashboard, faList,  faShoppingBag, faSort, faUserPlus,} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, } from "react-bootstrap";

import Drawer from '@mui/material/Drawer';
import React from "react";
import { useState } from "react";

// import img1 from '../../public/images/IMAGE-1.png';

export default function Dashboard() {
    const { products = [], productsCount } = useSelector(state => state.productsState);
    const { adminOrders = [], orderCount, totalPrice } = useSelector(state => state.orderState);
    const {  userConut } = useSelector(state => state.userState);
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
    if (adminOrders.length > 0) {
        adminOrders.forEach(order => {
            totalAmount += order.totalPrice
        })
    }



    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getUsers());
        dispatch(adminOrdersAction())
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


            <section className="dash-section">
                <div className="row container-fluid">
                    <div className="col-12 col-lg-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 ">

                        <div className="mobile-logo">
                            <img src={require("../../images/procure-g-logo.png")}/>
                        </div>

                        <div className="breadcrumbWrapperr">
                            {isMobile ? (
                                <div className="row mobile-topbar">
                                    <div className="col-10">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/admin/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-2 text-end">
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
                                                variant="default text-white"
                                                id="dropdown-basic"
                                                className="text-dark dropdown1 icon-list-filter-procureg"
                                                style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                            >
                                                <FontAwesomeIcon icon={faFilter} />
                                            </Dropdown.Toggle>
                                        </Dropdown>
                                    </div>
                                    {/* <div className="col-lg-1 col-md-2">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div> */}
                                </div>
                            )}

                            {isMobile && (
                                <div className="row mobile-bottombar">
                                    <div className="col-8">
                                        <div className="search-container">
                                            <form className="d-flex">
                                                <input type="text" placeholder="Search" name="search" />
                                                <button type="submit">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-2 text-center">
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
                                    {/* <div className="col-2 text-center">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div> */}
                                </div>
                            )}

                            <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer">
                                <div className="drawer-header">ADMIN DASHBOARD</div>
                                <div className="drawer-content">
                                    <ul className="drawer-links">
                                        <li><Link to="/admin/dashboard"><FontAwesomeIcon icon={faDashboard} className="me-2"/>Dashboard</Link></li>
                                        <li><Link to="/admin/products"><FontAwesomeIcon icon={faCartShopping} className="me-2"/>Product List</Link></li>
                                        <li><Link to="/admin/products/create"><FontAwesomeIcon icon={faShoppingBag} className="me-2"/>Create Product</Link></li>
                                        <li><Link to="/admin/orders"><FontAwesomeIcon icon={faSort} className="me-2"/>Order List</Link></li>
                                        <li><Link to="/admin/users"><FontAwesomeIcon icon={faUserPlus} className="me-2"/>User List</Link></li>
                                        <li><Link to="/admin/reviews"><FontAwesomeIcon icon={faPencil} className="me-2"/>Review List</Link></li>
                                    </ul>
                                </div>
                            </Drawer>
                        </div>

                        <h3 style={{ color: "#ffad63", marginTop: "40px" }}>DASHBOARD</h3>
                      

                        <div className="row">
                            {/* NEW DASHBOARD */}
                            <section className="dashboard-section-procureg">

                                <div className="row dashboard-contents-procureg">

                                    <div className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mb-4">
                                        <div class="card">
                                            <Link className="" to="">
                                                <div class="card-body" style={{
                                                    backgroundColor: "#f5f5f5"
                                                }}>

                                                    {/* content1 */}
                                                    <div className="row">
                                                        <div className="col-lg-3 col-sm-3">
                                                            <FontAwesomeIcon icon={faMoneyBillTrendUp} className="icon-tick-procureg text-black" />
                                                        </div>
                                                        <div className="col-lg-9 col-sm-9">
                                                            <h6 className="card-title-1">Total Sales</h6>
                                                            <p className="card-title-2">{adminOrders.length}</p>
                                                        </div>
                                                    </div>
                                                    <h3 className="card-title-3">₹ {Math.round(totalPrice)}</h3>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="card-title-4 text-black"><FontAwesomeIcon icon={faMoneyBillTrendUp} className="me-2" />0</p>
                                                        <p className="card-title-5" style={{ marginTop: "4%" }}>0 <span className="card-title-6"> in this week</span></p>
                                                    </div>

                                                </div>
                                            </Link>
                                        </div>

                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mb-4">
                                        <div class="card">
                                            <Link className="" to="/admin/products">
                                                <div class="card-body" style={{ backgroundColor: "#f5f5f5" }}>

                                                    {/* content2 */}
                                                    <div className="row">
                                                        <div className="col-lg-3 col-sm-3">
                                                            <FontAwesomeIcon icon={faCartShopping} className="icon-tick-procureg text-black" />
                                                        </div>
                                                        <div className="col-lg-9 col-sm-9">
                                                            <h6 className="card-title-1">Products</h6>
                                                            {/* <p className="card-title-2">50+ products added </p> */}
                                                        </div>
                                                    </div>
                                                    <h3 className="card-title-3">{productsCount}</h3>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="card-title-4"><FontAwesomeIcon icon={faMoneyBillTrendUp} />0</p>
                                                        <p className="card-title-5" style={{ marginTop: "4%" }} >0 <span className="card-title-6">in this week</span></p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mb-4">
                                        <div class="card">
                                            <Link className="" to="/admin/orders">
                                                <div class="card-body" style={{ backgroundColor: "#f5f5f5" }}>

                                                    {/* content3 */}
                                                    <div className="row">
                                                        <div className="col-lg-3 col-sm-3">
                                                            <FontAwesomeIcon icon={faUser} className="icon-tick-procureg text-black" />
                                                        </div>
                                                        <div className="col-lg-9 col-sm-9">
                                                            <h6 className="card-title-1">Orders</h6>
                                                            {/* <p className="card-title-2">More than50+ visitors </p> */}
                                                        </div>
                                                    </div>
                                                    <h3 className="card-title-3">{orderCount}</h3>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="card-title-4"><FontAwesomeIcon icon={faMoneyBillTrendUp} />+0</p>
                                                        <p className="card-title-5" style={{ marginTop: "4%" }} >0 <span className="card-title-6">in this week</span></p>
                                                    </div>

                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mb-4">
                                        <div class="card">
                                            <Link className="" to="/admin/users">
                                                <div class="card-body" style={{ backgroundColor: "#f5f5f5" }}>

                                                    {/* content3 */}
                                                    <div className="row">
                                                        <div className="col-lg-3 col-sm-3">
                                                            <FontAwesomeIcon icon={faUser} className="icon-tick-procureg text-black" />
                                                        </div>
                                                        <div className="col-lg-9 col-sm-9">
                                                            <h6 className="card-title-1">Users</h6>
                                                            {/* <p className="card-title-2">More than50+ visitors </p> */}
                                                        </div>
                                                    </div>
                                                    <h3 className="card-title-3">{userConut}</h3>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="card-title-4"><FontAwesomeIcon icon={faMoneyBillTrendUp} />+0</p>
                                                        <p className="card-title-5" style={{ marginTop: "4%" }} >0 <span className="card-title-6">in this week</span></p>
                                                    </div>

                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-10 col-xs-12 mb-4">
                                        <div class="card">
                                            <Link className="" to="/admin/analytics">
                                                <div class="card-body" style={{ backgroundColor: "#f5f5f5" }}>

                                                    {/* content3 */}
                                                    <div className="row">
                                                        <div className="col-lg-3 col-sm-3">
                                                            <FontAwesomeIcon icon={faUser} className="icon-tick-procureg text-black" />
                                                        </div>
                                                        <div className="col-lg-9 col-sm-9">
                                                            <h6 className="card-title-1">Analysis</h6>
                                                            {/* <p className="card-title-2">More than50+ visitors </p> */}
                                                        </div>
                                                    </div>
                                                    <h3 className="card-title-3">{userConut}</h3>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="card-title-4"><FontAwesomeIcon icon={faMoneyBillTrendUp} />+0</p>
                                                        <p className="card-title-5" style={{ marginTop: "4%" }} >0 <span className="card-title-6">in this week</span></p>
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
    )
}