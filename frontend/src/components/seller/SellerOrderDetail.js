import { Fragment, useEffect, useState } from "react";
import SellerSidebar from "./SellerSidebar"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getSellerSingleOrder, orderDetail as orderDetailAction, updateOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";
import { clearOrderUpdated, clearError } from "../../slices/orderSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatar1 from '../../images/OIP.jpg';
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import MetaData from "../layouts/MetaData";

export default function SellerOrderDetail() {
  const { orderDatail = [], loading, error, orderDetail } = useSelector(state => state.orderState)
  const { user = [null], orderItems = [], shippingInfo = {}, totalPrice = 0, paymentInfo = {}, orderStatus } = orderDetail;
  const isPaid = paymentInfo.status === 'succeeded' ? true : false;
  const { id: orderId } = useParams();


  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {

    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      })
      return
    }

    dispatch(getSellerSingleOrder(orderId))
  }, [error, dispatch])

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
    <MetaData title={`Order #${orderId} | GLOCRE`} />
      <section className="seller-order-details-glc">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            <SellerSidebar />
          </div>
          <div className="col-12 col-lg-10 col-md-12 pr-0">
            <Link to="/">
              <div className="mobile-logo">
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
                      <li>
                        <Link to="/seller/orders" style={{ color: '#fff' }}>
                          Order List
                        </Link>
                      </li>
                      <li>Update Order List</li>
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
                        <Link to="/seller/orders">Order List</Link>
                      </li>
                      <li>Update Order List</li>
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
                  {/* <div className="col-lg-1 col-md-2 dash-cont-glc">
                      <img src={avatar1} alt="Avatar" className="avatar" />
                    </div> */}
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
                        <FontAwesomeIcon icon={faSort} /> &nbsp;ArchivedProducts
                      </Link>
                    </li>
                  </ul>
                </div>
              </Drawer>
            </div>

            <h2
  className="text-xl sm:text-2xl font-semibold mt-12"
  style={{
    color: '#ffad63',
    marginTop: '40px',
    overflowWrap: 'anywhere',  // Force word wrap
    wordBreak: 'break-word'    // Fallback for older content
  }}
>
  Order #{orderId}
</h2>


            <hr />

            <h4 className="mb-4 mt-3">Order Status:</h4>
            <p
              className={
                orderStatus && orderStatus.includes('Delivered')
                  ? '#2fad2a'
                  : '#ffad63'
              }
            >
              <b>{orderDatail.orderStatus}</b>
            </p>

            <h4 className="my-4">Order Items:</h4>

            {/* <div className="cart-item my-1">
                            {orderDatail.orderItems && orderDatail.orderItems.map(item => (
                                <div className="row my-5" key={item.id}>
                                    <div className="col-2 col-lg-2">
                                        <img src={item.image} alt={item.name} height="45" width="65" />
                                    </div>

                                    <div className="col-3 col-lg-5">
                                        <p>{item._id}</p>
                                    </div>
                                    <div className="col-3 col-lg-5">
                                        <Link to={`/products/${item.product}`} style={{ color: 'black' }}>{item.name}</Link>
                                    </div>


                                    <div className="col-2 col-lg-2 mt-4 mt-lg-0">
                                        <p>₹{item.price}</p>
                                    </div>

                                    <div className="col-2 col-lg-3 mt-4 mt-lg-0">
                                        <p>{item.quantity} Piece(s)</p>
                                    </div>
                                </div>
                            ))}

                        </div> */}

            <div className="">
              <div className="cartWrapper mt-4">
                <div
                  className="table-responsive"
                  style={{ overflowX: 'auto' }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '120px' }}>Product</th>
                        <th style={{ minWidth: '250px' }}>Product id</th>
                        <th style={{ minWidth: '200px' }}>Product Name</th>
                        <th style={{ minWidth: '150px' }}>Total Products</th>
                        <th style={{ minWidth: '150px' }}>Price</th>
                      </tr>
                    </thead>
                    {orderDatail.orderItems &&
                      orderDatail.orderItems.map(item => (
                        <tbody key={item.id}>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="img">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ height: '75px', width: '75px' }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <Link to={`/products/${item.product}`}>
                                <span className="text-g">{item._id}</span>
                              </Link>
                            </td>

                            <td>
                              <Link
                                to={`/products/${item.product}`}
                                style={{ color: 'black', fontSize: '16px' }}
                              >
                                <span style={{ color: '#8c8c8c' }}>
                                  {item.name}
                                </span>
                              </Link>
                            </td>

                            <td>
                              <span style={{ color: '#8c8c8c' }}>
                                {item.quantity} Piece(s)
                              </span>
                            </td>

                            <td>
                              <span style={{ color: '#8c8c8c' }}>
                                ₹{item.price}
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
        </div>
      </section>
    </>
  );
}