import { Fragment, useEffect, useState } from "react"
import './userlist.css';
import './orderlist.css'
import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions"
import { clearError, clearOrderDeleted } from "../../slices/orderSlice"
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify'
import Sidebar from "./Sidebar"
import debounce from 'lodash.debounce'; // Install lodash.debounce if not already
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from 'react-js-pagination';
import avatar1 from '../../images/OIP.jpg'
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted, orderCount, resPerPage } = useSelector(state => state.orderState)
    const [searchKeyword, setSearchKeyword] = useState(""); // State for search input
    const [statusFilter, setStatusFilter] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteOrder(id))
    }
    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };
    const debouncedSearch = debounce((term) => {
        dispatch(adminOrdersAction(term, statusFilter));
    }, 300);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) return; // Prevent empty searches

        const isObjectId = /^[a-f\d]{24}$/i.test(searchKeyword.trim()); // Check for ObjectId format
        dispatch(adminOrdersAction({ keyword: searchKeyword.trim(), idSearch: isObjectId }));
    };
    const handleFilterClick = () => {
        setFilterVisible(!filterVisible);
    };

    const handleFilterChange = (orderStatus) => {
        setStatusFilter(orderStatus);
        setCurrentPage(1); // Reset to the first page when applying a new filter
        dispatch(adminOrdersAction(searchKeyword, orderStatus, 1));
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isOrderDeleted) {
            toast('Order Deleted Succesfully!', {
                type: 'success',
                onOpen: () => dispatch(clearOrderDeleted())
            })
            return;
        }

        dispatch(adminOrdersAction(searchKeyword, statusFilter, currentPage));
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
            <section className="orderlist-glc ">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 ">

                        <div className="mobile-logo">
                                <img src={require("../../images/procure-g-logo.png")}/>
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
                                                <Link to="/admin/dashboard">Dashboard</Link>
                                            </li>
                                            <li>Order List</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6" style={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                        <div className="dash-cont-glc">
                                            <div className="row">
                                                <div className="topnav">
                                                    <div className="search-container">
                                                        <form className="d-flex"
                                                            onSubmit={(e) => e.preventDefault()}
                                                            value={searchKeyword}
                                                            onChange={(e) => setSearchKeyword(e.target.value)}>
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
                                    <div className="col-lg-1 col-md-2 dash-cont-glc" style={{ display: "flex", justifyContent: "center" }}>
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
                                    <div className="col-lg-1 col-md-2 dash-cont-glc">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div>
                                </div>
                            )}
                            {/* Search, Filter & Avatar Row (For Mobile) */}
                            {isMobile && (
                                <div className="row mobile-bottombar">
                                    <div className="col-8">
                                        <div className="search-container">
                                            <form className="d-flex"
                                                onSubmit={(e) => e.preventDefault()}
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}>
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
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleFilterChange("Processing")}>Processing</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("Shipped")}>Shipped</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("Delivered")}>Delivered</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className="col-2 text-center">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
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
                                    </ul>
                                </div>
                            </Drawer>

                        </div>

                        <h3 className="" style={{ color: "#ffad63", marginTop: "40px" }}>ORDERS LIST</h3>
                        <p>Glocre</p>

                        {/* OLD ORDERLIST */}
                        {/* <div className="reviewlist-list-filter-procureg">
                    <div className="row">
                        <div className="col-lg-6">
                            <Dropdown className="d-inline text-dark">
                                <Dropdown.Toggle
                                    variant="default text-white"
                                    id="dropdown-basic"
                                    className="text-dark dropdown1 icon-list-filter-procureg"
                                    style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                >
                                    <FontAwesomeIcon icon={faFilter} className="" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleFilterChange("Processing")}>Processing</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleFilterChange("Shipped")}>Shipped</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleFilterChange("Delivered")}>Delivered</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
                                </Dropdown.Menu>

                            </Dropdown>
                        </div>
                        <div className="topnav col-lg-6">
                            <div className="search-container">
                                <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        name="search"
                                    />
                                    <button type="submit">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> */}

                        {/* <section className="orderlist-section-procureg mt-2">

                    <div className="orderlist-main-heading">
                        <div className="row">
                            <div className="col-lg-2">
                                <h6>
                                    ORDER ID
                                </h6>
                            </div>
                            <div className="col-lg-2">
                                <h6>
                                    STATUS
                                </h6>
                            </div>
                            <div className="col-lg-2">
                                <h6>
                                    NUMBER OF ITEMS
                                </h6>
                            </div>
                            <div className="col-lg-2">
                                <h6>
                                    PRICE
                                </h6>
                            </div>
                            <div className="col-lg-2">
                                <h6>
                                    DATE
                                </h6>
                            </div>
                            <div className="col-lg-2">
                                <h6>
                                    ACTION
                                </h6>
                            </div>
                        </div>
                    </div>

                    <hr />
                    {loading ? (
                        <Loader />
                    ) : (
                        adminOrders.map((adminOrder) => (
                            <div className="orderlist-main-contents mb-1">
                                <div className="row">
                                    <div className="col-lg-2">
                                        <p>{adminOrder._id}</p>
                                    </div>
                                    <div className="col-lg-2">
                                        <p style={{ color: adminOrder.orderStatus.includes('Processing') ? 'red' : 'green' }}>{adminOrder.orderStatus}</p>
                                    </div>
                                    <div className="col-lg-2">
                                        <p>{adminOrder.orderItems.length}</p>
                                    </div>
                                    <div className="col-lg-2">
                                        <p>₹{adminOrder.totalPrice}</p>
                                    </div>
                                    <div className="col-lg-2">
                                        <p>{new Date(adminOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-lg-2">

                                        <Link to={`/admin/order/${adminOrder._id}`} className="btn btn-primary"> <i className="fa fa-pencil"></i></Link>
                                        <Button onClick={e => deleteHandler(e, adminOrder._id)} className="btn btn-danger py-1 px-2 ml-2">
                                            <i className="fa fa-trash"></i>
                                        </Button>

                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section> */}


                        <div className="cartWrapper pr-3 mt-4">
                            <div className="table-responsive" style={{ overflowX: "auto" }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: "250px" }}>ORDER ID</th>
                                            <th style={{ minWidth: "150px" }}>STATUS</th>
                                            <th style={{ minWidth: "180px" }}>NUMBER OF ITEMS</th>
                                            <th style={{ minWidth: "150px" }}>PRICE</th>
                                            <th style={{ minWidth: "180px" }}>DATE</th>
                                            <th style={{ minWidth: "200px" }}>ACTION</th>
                                        </tr>
                                    </thead>

                                    <tbody >
                                        {loading ? (
                                            <Loader />
                                        ) : (
                                            adminOrders.map((adminOrder) => (
                                                <tr colSpan="6">
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span style={{ color: "#8c8c8c", fontSize: "15px" }}>
                                                                {adminOrder._id}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span style={{ color: adminOrder.orderStatus.includes('Processing') ? '#ffad63' : '#2f4d2a' }}>
                                                            {adminOrder.orderStatus}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span style={{ color: "#8c8c8c" }}>
                                                            {adminOrder.orderItems.length}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="text-g" style={{ color: "#8c8c8c" }}>
                                                            ₹{adminOrder.totalPrice}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="cursor" style={{ color: "#8c8c8c" }}>
                                                            {new Date(adminOrder.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Link to={`/admin/order/${adminOrder._id}`} style={{ backgroundColor: "#ffad63", outline: "none", border: "none" }} className="btn btn-primary"><FontAwesomeIcon icon={faPencil} /></Link>
                                                        <Button style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none" }} onClick={e => deleteHandler(e, adminOrder._id)} className="btn ms-2">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <br />
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