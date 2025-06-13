import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    uploadBanner,
    getBanners,
    deleteBanner,
} from "../../actions/userActions"; // adjust path if needed
import { Button, Spinner } from "react-bootstrap"; // optional if using Bootstrap
import Sidebar from "./Sidebar";
import MetaData from "../layouts/MetaData";
import { getAdminProducts } from "../../actions/productActions";
import { getUsers } from '../../actions/userActions'
import { adminOrders as adminOrdersAction } from '../../actions/orderActions'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMoneyBillTrendUp, faUser, faFilter, faPencil, faSearch, faDashboard, faList, faShoppingBag, faSort, faUserPlus, } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';


const AdminBannerPage = () => {
    const dispatch = useDispatch();

    const { banners = [], loading, error } = useSelector(state => state.authState); // adjust based on your root reducer

    const [bannerImage, setBannerImage] = useState(null);

    useEffect(() => {
        dispatch(getBanners());
    }, [dispatch]);

    const handleUpload = (e) => {
        e.preventDefault();

        if (!bannerImage) return;

        const formData = new FormData();
        formData.append("images", bannerImage);

        dispatch(uploadBanner(formData));
        setBannerImage(null); // clear after upload
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            dispatch(deleteBanner(id));
        }
    };

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
        <Fragment>
            <MetaData title="Admin Banner Management | GLOCRE" />
            <section className="newprod-section">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                   
                    
                          </div>   
                          
                                            
                    <div className="col-12 col-lg-10 col-md-12 newprod-right-glc">
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
                    
                                                <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer">
                                                    <div className="drawer-header">ADMIN DASHBOARD</div>
                                                    <div className="drawer-content">
                                                        <ul className="drawer-links">
                                                            <li><Link to="/admin/dashboard"><FontAwesomeIcon icon={faDashboard} className="me-2" />Dashboard</Link></li>
                                                            <li><Link to="/admin/products"><FontAwesomeIcon icon={faCartShopping} className="me-2" />Product List</Link></li>
                                                            <li><Link to="/admin/products/create"><FontAwesomeIcon icon={faShoppingBag} className="me-2" />Create Product</Link></li>
                                                            <li><Link to="/admin/orders"><FontAwesomeIcon icon={faSort} className="me-2" />Order List</Link></li>
                                                            <li><Link to="/admin/users"><FontAwesomeIcon icon={faUserPlus} className="me-2" />User List</Link></li>
                                                            <li><Link to="/admin/reviews"><FontAwesomeIcon icon={faPencil} className="me-2" />Review List</Link></li>
                                                            <li><Link to="/admin/edit-banner"><FontAwesomeIcon icon={faPencil} className="me-2" />Banner</Link></li>
                                                            <li><Link to="/admin/awsimages"><FontAwesomeIcon icon={faPencil} className="me-2" />Images</Link></li>
                                                            <li><Link to="/admin/subscribers"><FontAwesomeIcon icon={faPencil} className="me-2" />All Emails</Link></li>
                                                        </ul>
                                                    </div>
                                                </Drawer>
                                            </div>
                        <div className="container mt-4">
                            <h2>Manage Banner Images</h2>

                            <form onSubmit={handleUpload} className="mb-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setBannerImage(e.target.files[0])}
                                />
                                <Button type="submit" className="ms-2 btn-g border-0" disabled={loading}>
                                    {loading ? <Spinner size="sm" /> : "Upload"}
                                </Button>
                            </form>
                            <p>need image size in </p>
                            <h5>Width = 1660 px || Height = 400px </h5>
                            {error && <p className="text-danger">{error}</p>}

                            <div className="row">
                                {banners &&
                                    banners?.map((banner) => (
                                        <div className="col-md-3 mb-3" key={banner._id}>  {/* smaller col width */}
  <div className="card" style={{ maxWidth: "350px", margin: "auto" }}> {/* smaller card width */}
    <img
      src={banner.url}
      className="card-img-top"
      alt="banner"
      style={{
        height: "150px",   // smaller height
        width: "100%",
        objectFit: "contain",
        backgroundColor: "#f8f9fa", // light bg to avoid empty space looking odd
      }}
    />
    <div className="card-body text-center p-2">  {/* reduce padding */}
      <Button
        variant="danger"
        size="sm"        // smaller button size
        onClick={() => handleDelete(banner._id)}
        className="btn-g border-0 px-3 py-1"  // smaller padding inside button
      >
        Delete
      </Button>
    </div>
  </div>
</div>

                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>

    );
};

export default AdminBannerPage;
