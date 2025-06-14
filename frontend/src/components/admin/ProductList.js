import { Fragment, useEffect, useState } from "react"
import './productlist.css'
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getAdminProducts, deleteProduct } from "../../actions/productActions"
import { clearError, clearProductDeleted } from "../../slices/singleProductSlice"
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify'
import Sidebar from "./Sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dropdown, Button } from "react-bootstrap";
import Pagination from 'react-js-pagination';
import { faCartShopping, faFilter, faPencil, faSearch, faDashboard, faList, faShoppingBag, faSort, faUserPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Modal, Box, Typography } from "@mui/material";
import MetaData from "../layouts/MetaData"
export default function ProductList() {
    const { products = [], loading = true, productsCount, resPerPage, error, filteredProductsCount } = useSelector(state => state.productsState)
    const { isProductDeleted, error: productError } = useSelector(state => state.productState)
    const [clocreProductId, setclocreProductId] = useState('');
    const [searchKeyword, setSearchKeyword] = useState(''); // this is submitted one
    const [filterStatus, setFilterStatus] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // const [limit, setLimit] = useState(10);

    const dispatch = useDispatch();
    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteProduct(id))
    }

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }
    useEffect(() => {
        const debouncedSearch = debounce(() => {
            dispatch(getAdminProducts(clocreProductId, filterStatus, 1)); // always reset to 1
            setCurrentPage(1);
        }, 500); // 500ms debounce

        debouncedSearch();

        // Cleanup on unmount
        return () => {
            debouncedSearch.cancel && debouncedSearch.cancel();
        };
    }, [clocreProductId, filterStatus, dispatch]);

    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     setSearchKeyword(clocreProductId); // trigger a new search
    //     setCurrentPage(1); // reset to first page on new keyword
    //   };


    // const handleFilterClick = () => {
    //     setFilterVisible(!filterVisible);
    // };
    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPageNo(1);
        setFilterVisible(false);
        dispatch(getAdminProducts(status));
    };

    useEffect(() => {
        if (error || productError) {
            toast(error || productError, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }
        if (isProductDeleted) {
            toast('Product Deleted Succesfully!', {
                type: 'success',
                onOpen: () => dispatch(clearProductDeleted())
            });
            return;
        }

        dispatch(getAdminProducts(searchKeyword, filterStatus, currentPage));
    }, [dispatch, error, isProductDeleted, searchKeyword, filterStatus, currentPage]);


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



    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const confirmProductDelete = (e) => {
        deleteHandler(e, productToDelete);
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };
    const handleDeleteClick = (id) => {
        // console.log(id);
        setProductToDelete(id);
        setDeleteModalOpen(true);
    };

    const cancelProductDelete = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    return (
        <>
        <MetaData title="Product List | GLOCRE" />
            <section className="prodlist-section">
                <div className="row container-fluid">
                    <div className="col-lg-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 pr-0">
                        <div className="mobile-logo">
                        < Link to = "/" >
                            <img src={require("../../images/procure-g-logo.png")} />
                            </Link>
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
                                            <li>Product List</li>
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
                                            <li>Product List</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
                                        <div className="dash-cont-glc">
                                            <div className="row">
                                                <div className="topnav">
                                                    <div className="search-container">
                                                        <form className="d-flex" >
                                                            <input
                                                                type="text"
                                                                placeholder="Search"
                                                                name="search"
                                                                value={clocreProductId}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                                                                    setclocreProductId(cleanedValue)
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
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleFilterChange("approved")}>Approved</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleFilterChange("pending")}>Pending</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleFilterChange("rejected")}>Rejected</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
                                            </Dropdown.Menu>
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
                                                <input type="text" placeholder="Search" name="search"
                                                    // value={clocreProductId}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const cleanedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                                                        setclocreProductId(cleanedValue)}
                                                    }
                                                />
                                                <button type="submit">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-2 d-flex justify-content-center align-items-end">
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
                                                <Dropdown.Item onClick={() => handleFilterChange("approved")}>Approved</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("pending")}>Pending</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("rejected")}>Rejected</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
                                            </Dropdown.Menu>
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

                        <h3 className="" style={{ color: "#ffad63", marginTop: "40px" }}>PRODUCT LIST</h3>


                        <div className="">
                            <div className="cartWrapper pr-3 mt-4">
                                <div className="table-responsive" style={{ overflowX: "auto" }}>
                                    <table className="table" >
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: "200px" }}>NAME</th>
                                                <th style={{ minWidth: "200px" }}>STATUS</th>
                                                <th style={{ minWidth: "200px" }}>STOCK</th>
                                                <th style={{ minWidth: "200px" }}>CREATED AT</th>
                                                <th style={{ minWidth: "200px" }}>UPDATED AT</th>
                                                <th style={{ minWidth: "200px" }}>Product ID</th>
                                                <th style={{ minWidth: "200px" }}>Update</th>
                                                <th style={{ minWidth: "200px" }}>DELETE</th>
                                            </tr>
                                        </thead>

                                        <tbody >
                                            {loading ? (
                                                <Loader colSpan="6" />
                                            ) : products.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <p style={{ color: "#8c8c8c", fontSize: "18px" }}>You have no products. Please create one.</p>
                                                    <Link to="/admin/products/create">
                                                        <button
                                                            className="btn mt-3"
                                                            style={{ backgroundColor: '#ffad63', color: '#fff' }}>
                                                            Create Product
                                                        </button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                products.map((product) => (
                                                    <>
                                                        <tr key={product._id}>
                                                            <td >
                                                                <div className="d-flex align-items-center">
                                                                    <span style={{ color: "#8c8c8c" }}>
                                                                        {product.name}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span style={{ color: product.status === 'approved' ? 'green' : '#ffad63' }}>
                                                                    {product.status || 'Pending'}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span style={{ color: "#8c8c8c" }}>
                                                                    {product.variants && product.variants.length > 0
                                                                        ? 'Available'
                                                                        : product.stock > 0
                                                                            ? product.stock
                                                                            : 'Out of Stock'}

                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="text-g">
                                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="text-g">
                                                                    {new Date(product.updatedAt).toLocaleDateString()}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className="cursor" style={{ color: "#8c8c8c" }}>
                                                                    {product.clocreProductId}
                                                                </span>
                                                            </td>


                                                            <td >
                                                                <Link to={`/admin/products/${product._id}`}>
                                                                    <span className="cursor btn btn-primary" style={{ backgroundColor: "#ffad63", outline: "none", border: "none" }}>
                                                                        <FontAwesomeIcon icon={faPencil} />
                                                                    </span>
                                                                </Link>
                                                            </td>

                                                            {/* <td>
                                                                <Button style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none", color: "#fff" }} onClick={(e) => deleteHandler(e, product._id)} className="btn ms-2">
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Button>
                                                            </td> */}

                                                            <td>
                                                                <Button
                                                                    style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none", color: "#fff" }}
                                                                    onClick={() => handleDeleteClick(product._id)}
                                                                    className="btn ms-2"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Button>
                                                            </td>

                                                            <Modal open={deleteModalOpen} onClose={cancelProductDelete}>
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
                                                                        Are you sure want to delete this product?(It wont be recovered)
                                                                    </Typography>
                                                                    <Box display="flex" justifyContent="space-between">
                                                                        <Button
                                                                            onClick={confirmProductDelete}
                                                                            className="left-but"
                                                                            sx={{
                                                                                margin: "3px"
                                                                            }}
                                                                        >
                                                                            Yes
                                                                        </Button>
                                                                        <Button
                                                                            onClick={cancelProductDelete}
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


                                                        </tr>
                                                    </>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <br />
                            {filteredProductsCount > 0 && filteredProductsCount > resPerPage ? (
                                <div className="d-flex justify-content-center mt-5 tab-slider">
                                    <Pagination
                                        activePage={currentPage}
                                        onChange={setCurrentPageNo}
                                        totalItemsCount={filteredProductsCount}
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

                </div>
            </section>
        </>
    )
}