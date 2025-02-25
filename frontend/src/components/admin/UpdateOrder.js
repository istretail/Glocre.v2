import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction, updateOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from 'lodash.debounce'; // Install lodash.debounce if not already
import avatar1 from '../../images/OIP.jpg'
import { Button } from "react-bootstrap";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';

export default function UpdateOrder() {


    const { loading, isOrderUpdated, error, orderDetail } = useSelector(state => state.orderState)
    const { user = [null], orderItems = [], shippingInfo = {}, totalPrice = 0, paymentInfo = {} } = orderDetail;
    const isPaid = paymentInfo.status === 'succeeded' ? true : false;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const { id: orderId } = useParams();


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrder(orderId, orderData))
    }

    useEffect(() => {
        if (isOrderUpdated) {
            toast('Order Updated Succesfully!', {
                type: 'success',
                onOpen: () => dispatch(clearOrderUpdated())
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

        dispatch(orderDetailAction(orderId))
    }, [isOrderUpdated, error, dispatch])


    useEffect(() => {
        if (orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    }, [orderDetail])

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
            <section className="updateorder-section">
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
                                            <li>
                                                <Link to="/admin/orders" style={{ color: "#fff" }}>Orders List</Link>
                                            </li>
                                            <li>Update Orders</li>
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
                                            <li>
                                                <Link to="/admin/orders">Orders List</Link>
                                            </li>
                                            <li>Update Orders</li>
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

                        <div className="row">

                            <div className="col-12 col-lg-8">
                                <h2 className="" style={{ color: "#ffad63", marginTop: "40px" }}>Order # {orderDetail._id}</h2>

                                <h4 className="mb-4 mt-3">Shipping Info</h4>
                                <p><b>Name:</b> {user && user.name}</p>
                                <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                                <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                                <p><b>Amount:</b> ₹{totalPrice}</p>

                                <hr />

                                <div className="cart-item">
                                    <tbody>
                                        <tr>
                                            <td width="30%">
                                                <div className="">
                                                    <h4 className="my-4">Payment:</h4>
                                                    <hr />
                                                    <p className={isPaid ? 'greenColor' : 'redColor'} ><b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>
                                                    <hr />
                                                </div>
                                            </td>
                                            <td width="30%">
                                                <h4 className="my-4">Order Status:</h4>
                                                <hr />
                                                <p className={orderStatus && orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'} ><b>{orderStatus}</b></p>
                                                <hr />
                                            </td>
                                        </tr>
                                    </tbody>

                                </div>

                                <h4 className="my-4">Order Items:</h4>
                                <div className="">
                                    <div className="cartWrapper mt-4">
                                        <div className="table-responsive" style={{ overflowX: "auto" }}>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th style={{ minWidth: "150px" }}>Product</th>
                                                        <th style={{ minWidth: "200px" }}>Product Name</th>
                                                        <th style={{ minWidth: "120px" }}>Price</th>
                                                        <th style={{ minWidth: "150px" }}>Total Products</th>
                                                    </tr>
                                                </thead>
                                                {orderItems && orderItems.map(item => (
                                                    <tbody >
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="img">
                                                                        <img src={item.image} alt={item.name} style={{ height: "75px", width: "75px" }} />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Link to={`/products/${item.product}`} >
                                                                    <span className="text-g">
                                                                        {item.name}
                                                                    </span>
                                                                </Link>
                                                            </td>

                                                            <td>
                                                                <p>₹{item.price}</p>
                                                            </td>

                                                            <td>
                                                                <span className="text-g">
                                                                    <p>{item.quantity} Piece(s)</p>
                                                                </span>
                                                            </td>

                                                        </tr>
                                                    </tbody>
                                                ))}
                                            </table>
                                        </div>
                                    </div>
                                    <br />

                                </div>
                            </div>

                            <div className="col-12 col-lg-4" style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                                {/* Right Section */}
                                <div className="cartRightBox" style={{ width: "100%" }}>
                                    <div className="card">
                                        <h4 className="">Order Status</h4>
                                        <div className="form-group mb-3">
                                            <select
                                                className="form-control"
                                                onChange={e => setOrderStatus(e.target.value)}
                                                value={orderStatus}
                                                name="status"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>

                                        </div>
                                        <Button className=""
                                            style={{ backgroundColor: "#ffad63", color: "#fff", border: "none", outline: "none" }}
                                            disabled={loading}
                                            onClick={submitHandler}
                                        >Update Status</Button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div >
                </div >
            </section>
        </>

    )
}