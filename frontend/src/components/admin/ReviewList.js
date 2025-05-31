import { Fragment, useEffect, useState, useRef } from "react"
import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { deleteReview, getReviews } from "../../actions/productActions"
import { clearError, clearReviewDeleted } from "../../slices/singleProductSlice"
import Loader from '../layouts/Loader';

import { toast } from 'react-toastify'
import Sidebar from "./Sidebar"
import './reviewlist.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faCartShopping, faFilter, faPencil, faSearch, faTrash, faDashboard, faList, faShoppingBag, faSort, faUserPlus, } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import MetaData from "../layouts/MetaData"

export default function ReviewList() {
    const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(state => state.productState)
    const [productId, setProductId] = useState("");
    const dispatch = useDispatch();
    // const [clocreProductId, setclocreProductId] = useState('');
    const isFirstRender = useRef(true);

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteReview(productId, id))
    }
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false; // Skip first run
        return;
    }

    const debouncedSearch = debounce(() => {
        dispatch(getReviews(productId));
    }, 500);

    debouncedSearch();

    return () => {
        debouncedSearch.cancel && debouncedSearch.cancel();
    };
}, [productId, dispatch]);



    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isReviewDeleted) {
            toast('Review Deleted Succesfully!', {
                type: 'success',
                onOpen: () => dispatch(clearReviewDeleted())
            })
            dispatch(getReviews(productId))
            return;
        }


    }, [dispatch, error, isReviewDeleted])



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
        <MetaData title="Review List | GLOCRE" />
            <section className="reviewlist-section">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 pr-0">
                        <div className="mobile-logo">
                            <img src={require("../../images/procure-g-logo.png")} alt="glocre" />
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
                                            <li>Review List</li>
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
                                            <li>Review List</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
                                        <div className="dash-cont-glc">
                                            <div className="row">
                                                <div className="topnav">
                                                    <div className="search-container">
                                                        <form className="d-flex">
                                                            <input type="text" placeholder="Search" name="search"
                                                                value={productId}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                                                                    setProductId(cleanedValue)
                                                                }}
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
                                                <input type="text" placeholder="Search" name="search"
                                                    value={productId}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                                                        setProductId(cleanedValue)
                                                    }}
                                                />
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

                        <h3 className="" style={{ color: "#ffad63", marginTop: "40px" }}>REVIEW LIST</h3>



                        <section className=" mt-2">

                            <div className="cartWrapper pr-3 mt-4">
                                <div className="table-responsive" style={{ overflowX: "auto" }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: "200px" }}>NAME</th>
                                                <th style={{ minWidth: "200px" }}>RATING</th>
                                                <th style={{ minWidth: "200px" }}>COMMENTS</th>
                                                <th style={{ minWidth: "200px" }}>REVIEW TYPE</th>
                                                <th style={{ minWidth: "200px" }}>DATE</th>
                                                <th style={{ minWidth: "200px" }}>ACTIONS</th>
                                            </tr>
                                        </thead>

                                        <tbody >
                                            {loading ? (
                                                <Loader />
                                            ) : reviews.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <p style={{ color: "#8c8c8c", fontSize: "18px" }}>Please serach the product ID. to get a reviews of the product.</p>

                                                </div>
                                            ) : (
                                                reviews.map((review) => (
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <span style={{ color: "#000000b3", fontSize: "15px" }}>
                                                                    {review.user?.name || "Anonymous"}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span >
                                                                {review.rating}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span>
                                                                {review.comment}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className={review.rating < 3 ? "text-danger" : "text-success"}>
                                                                {review.rating < 3 ? "Bad" : "Good"}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span className="cursor">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <Button style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none" }} onClick={e => deleteHandler(e, review._id)} className="btn ms-2">
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

                        </section>


                    </div>
                </div>
            </section>
        </>
    )
}