import { Fragment, useEffect, useState } from "react"
import '../admin/userlist.css';
import '../admin/orderlist.css'

import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getSellerOrders } from "../../actions/orderActions"
import { clearError, } from "../../slices/orderSlice"
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from 'react-js-pagination';
import SellerSidebar from "./SellerSidebar";
import { faCartShopping, faFilter, faPencil, faSearch,  faDashboard, faList,  faShoppingBag, faSort, } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Dropdown,  } from "react-bootstrap";


export default function SellerOrders() {
    const { sellerOrders = [], loading = true, error, orderCount, resPerPage } = useSelector(state => state.orderState)
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };
    // const debouncedSearch = debounce((term) => {
    //     dispatch(getSellerOrders(term, statusFilter));
    // }, 300);

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     if (!searchKeyword.trim()) return; // Prevent empty searches

    //     const isObjectId = /^[a-f\d]{24}$/i.test(searchKeyword.trim()); // Check for ObjectId format
    //     dispatch(getSellerOrders({ keyword: searchKeyword.trim(), idSearch: isObjectId }));
    // };

    // const handleFilterClick = () => {
    //     setFilterVisible(!filterVisible);
    // };

    const handleFilterChange = (orderStatus) => {
        setStatusFilter(orderStatus);
        setCurrentPage(1); // Reset to the first page when applying a new filter
        dispatch(getSellerOrders(searchKeyword, orderStatus, 1));
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }

        dispatch(getSellerOrders(searchKeyword, statusFilter, currentPage));
    }, [dispatch, searchKeyword, statusFilter, currentPage]);


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
            <section className="seller-order-list-glc">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <SellerSidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 ">

                        <Link to="/">
                            <div className="mobile-logo">
                                <img src={require('../../images/procure-g-logo.png')} alt="glocre" />
                            </div>
                        </Link>

                        <div className="breadcrumbWrapperr">

                            {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
                            {isMobile ? (
                                <div className="row mobile-topbar">
                                    <div className="col-10">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/seller/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                                            </li>
                                            <li>Order List</li>
                                        </ul>
                                    </div>
                                    <div className="col-2 text-end">
                                        <button className="fab" onClick={toggleDrawer}>
                                            <FontAwesomeIcon icon={faList} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row dash-navbar-big-glc">
                                    <div className="col-lg-3 col-md-12">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/seller/dashboard">Dashboard</Link>
                                            </li>
                                            <li>Order List</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6" style={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
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
                                    <div className="col-lg-1 col-md-2 dash-cont-glc" style={{ display: "flex", justifyContent: "center", alignItems: "end" }}>
                                        <Dropdown className="d-inline">
                                            <Dropdown.Toggle
                                                variant="default text-white"
                                                id="dropdown-basic"
                                                className="text-dark dropdown1 icon-list-filter-procureg"
                                                style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                            >
                                                <FontAwesomeIcon icon={faFilter} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleFilterChange("Processing")}>Processing</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("Shipped")}>Shipped</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("Delivered")}>Delivered</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    {/* <div className="col-lg-1 col-md-2 dash-cont-glc">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div> */}
                                </div>
                            )}
                            {/* Search, Filter & Avatar Row (For Mobile) */}
                            {isMobile && (
                                <div className="row mobile-bottombar">
                                    <div className="col-8">
                                        <div className="search-container">
                                            <form className="d-flex">
                                                <input type="text" placeholder="Search" name="search" value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)} />
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
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleFilterChange("Processing")}>Processing</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("Shipped")}>Shipped</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("Delivered")}>Delivered</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    {/* <div className="col-2 text-center">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div> */}
                                </div>
                            )}

                            {/* Drawer Component */}
                            <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer">
                                <div className="drawer-header">
                                    SELLER DASHBOARD
                                    {/* <button className="drawer-close-btn" onClick={toggleDrawer}>&times;</button> */}
                                </div>
                                <div className="drawer-content">
                                    <ul className="drawer-links">
                                        <li><Link to="/seller/dashboard"><FontAwesomeIcon icon={faDashboard} /> &nbsp;Dashboard</Link></li>
                                        <li><Link to="/seller/products"><FontAwesomeIcon icon={faCartShopping} /> &nbsp;Product List</Link></li>
                                        <li><Link to="/seller/products/create"><FontAwesomeIcon icon={faShoppingBag} /> &nbsp;Create Product</Link></li>
                                        <li><Link to="/seller/orders"><FontAwesomeIcon icon={faSort} /> &nbsp;Order List</Link></li>
                                    </ul>
                                </div>
                            </Drawer>

                        </div>

                        <h3 className="" style={{ color: "#ffad63", marginTop: "40px" }}>ORDERS LIST</h3>
                   
                        <section className="orderlist-section-procureg cartWrapper mt-2">
                            <div className="table-responsive" style={{ overflowX: "auto" }}>
                                <table className="table">
                                    <thead className="">
                                        <tr>
                                            <th style={{ minWidth: "250px" }}>Order ID</th>
                                            <th style={{ minWidth: "150px" }}>Status</th>
                                            <th style={{ minWidth: "180px" }}>Number of Items</th>
                                            <th style={{ minWidth: "150px" }}>Price</th>
                                            <th style={{ minWidth: "180px" }}>Date</th>
                                            <th style={{ minWidth: "180px" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    <Loader />
                                                </td>
                                            </tr>
                                        ) : sellerOrders.length === 0 ? (
                                            <div className="text-center py-5">
                                                <p style={{ color: "#8c8c8c", fontSize: "18px" }}>We have no orders.</p>
                                                
                                            </div>
                                        ) : (
                                            sellerOrders.map((SellerOrder) => (
                                                <tr key={SellerOrder._id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span style={{ fontSize: "16px", color: "#888888" }}>
                                                                {SellerOrder._id}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: SellerOrder.orderStatus.includes("Processing") ? "#2f4d2a" : "#ffad63", fontSize: "16px" }}>
                                                        {SellerOrder.orderStatus}
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#888888" }}>
                                                            {SellerOrder.orderItems.length}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#ffad63" }}>
                                                            ₹ {SellerOrder.itemsPrice}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#888888" }}>
                                                            {new Date(SellerOrder.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link to={`/seller/order/${SellerOrder._id}`} className="btn"
                                                            style={{ backgroundColor: "#ffad63", color: "#fff" }}
                                                        >
                                                            <FontAwesomeIcon icon={faPencil} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>


                        {orderCount > 0 && orderCount > resPerPage ? (
                            <div className="d-flex justify-content-center mt-5 tab-slider">
                                <Pagination
                                    activePage={currentPage}
                                    onChange={setCurrentPageNo}
                                    totalItemsCount={orderCount}
                                    itemsCountPerPage={resPerPage}
                                    nextPageText={"Next"}
                                    firstPageText={"First"}
                                    lastPageText={"Last"}
                                    itemClass={"page-item"}
                                    linkClass={"page-link"}
                                />
                            </div>
                        ) : null}


                    </div>
                </div>

            </section>
        </>
    )
}