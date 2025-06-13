import { Fragment, useEffect, useState } from "react"
import '../admin/productlist.css'
import { useDispatch, useSelector } from "react-redux"
import { removeArchiveProduct, getArchiveProducts, } from "../../actions/productActions"
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify'
import { clearError, clearProductArchive, } from "../../slices/singleProductSlice"
import SellerSidebar from "./SellerSidebar"
import { faCartShopping, faFilter, faPencil, faSearch, faDashboard, faList, faShoppingBag, faSort, } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Dropdown, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Pagination from 'react-js-pagination';
import { Link, useNavigate } from "react-router-dom";
import { Modal, Box, Typography, Button } from "@mui/material";
import MetaData from "../layouts/MetaData";
export default function SellerArchiveProducts() {
  // const { loading = true, productsCount } = useSelector(state => state.productsState)
  const { loading = true, products = [], sellerProductCount, isProductDeleted, resPerPage, error } = useSelector(state => state.productsState)
  const { isProductUpdated } = useSelector(state => state.productState)
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clocreProductId, setclocreProductId] = useState('');
  const dispatch = useDispatch();

  const unarchiveHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(removeArchiveProduct(id))
  }

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      dispatch(getArchiveProducts(clocreProductId, filterStatus, 1)); // always reset to 1
      setCurrentPage(1);
    }, 500); // 500ms debounce

    debouncedSearch();

    // Cleanup on unmount
    return () => {
      debouncedSearch.cancel && debouncedSearch.cancel();
    };
  }, [clocreProductId, filterStatus, dispatch]);

  useEffect(() => {
    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      })
      return
    }
    if (isProductUpdated) {
      toast.success('Product Unarcived Successfully!', {
        onOpen: () => dispatch(clearProductArchive())
      })
      return;
    }
    dispatch(getArchiveProducts(searchKeyword, filterStatus, currentPage ))
  }, [dispatch, error, isProductDeleted, isProductUpdated, searchKeyword, filterStatus, currentPage])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

      const handleFilterChange = (status) => {
          setFilterStatus(status);
          setCurrentPageNo(1);
          // setFilterVisible(false);
        dispatch(getArchiveProducts(status));
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


  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };


  // 
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    setSelectedProductId(id);
    setNavModalOpen(true);
  };

  const handleNavConfirm = () => {
    navigate(`/seller/product/${selectedProductId}`);
  };

  const handleNavClose = () => {
    setNavModalOpen(false);
    setSelectedProductId(null);
  };

  const [unarchiveModalOpen, setUnarchiveModalOpen] = useState(false);
  const [productToUnarchive, setProductToUnarchive] = useState(null);
  const [unarchiveEvent, setUnarchiveEvent] = useState(null);
  const handleUnarchiveClick = (e, id) => {
    setUnarchiveEvent(e);
    setProductToUnarchive(id);
    setUnarchiveModalOpen(true);
  };

  const confirmUnarchive = () => {
    unarchiveHandler(unarchiveEvent, productToUnarchive);
    setUnarchiveModalOpen(false);
    setProductToUnarchive(null);
    setUnarchiveEvent(null);
  };

  const cancelUnarchive = () => {
    setUnarchiveModalOpen(false);
    setProductToUnarchive(null);
    setUnarchiveEvent(null);
  };


  return (
    <>
      <MetaData title="Seller Archived Products | GLOCRE" />
      <section className="seller-product-list-section ">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            <SellerSidebar />
          </div>
          <div className="col-12 col-lg-10 col-md-12 pr-0">
            <Link to="/">
              <div className="mobile-logo">
                <img
                  src={require('../../images/procure-g-logo.png')}
                  alt="glocre" />
              </div>
            </Link>
            <div className="breadcrumbWrapperr">
              {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
              {isMobile ? (
                <div className="row mobile-topbar">
                  <div className="col-10">
                    <ul className="breadcrumb breadcrumb2 mb-0">
                      <li>
                        <Link
                          to="/seller/dashboard"
                          style={{ color: '#fff' }}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>Archived Product List</li>
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
                        <Link to="/seller/dashboard">Dashboard</Link>
                      </li>
                      <li>Archived Product List</li>
                    </ul>
                  </div>
                  <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
                    <div className="dash-cont-glc">
                      <div className="row">
                        <div className="topnav">
                          <div className="search-container">
                            <form
                              className="d-flex"
                              onSubmit={e => {
                                e.preventDefault();
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Search"
                                value={searchKeyword}
                                onChange={e =>
                                  setSearchKeyword(e.target.value)
                                }
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
                        <FontAwesomeIcon
                          icon={faDashboard}
                          className="me-2"
                        />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/products">
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className="me-2"
                        />
                        Product List
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/products/create">
                        <FontAwesomeIcon
                          icon={faShoppingBag}
                          className="me-2"
                        />
                        Create Product
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/orders">
                        <FontAwesomeIcon icon={faSort} className="me-2" />
                        Order List
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/archive/product">
                        <FontAwesomeIcon icon={faSort} className="me-2" />
                        Archived Products
                      </Link>
                    </li>
                  </ul>
                </div>
              </Drawer>
            </div>

            <h3 style={{ color: '#ffad63', marginTop: '40px' }}>
              Archived Products List
            </h3>


            <section className="cartWrapper">
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '200px' }}>Name</th>
                      <th style={{ minWidth: '180px' }}>Status</th>
                      <th style={{ minWidth: '180px' }}>Date</th>
                      <th style={{ minWidth: '180px' }}>ID</th>
                      <th style={{ minWidth: '150px' }}>Update Product</th>
                      <th style={{ minWidth: '150px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <Loader />
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <div className="text-center py-5">
                        <p style={{ color: "#8c8c8c", fontSize: "18px" }}>You have no Archived products.</p>

                      </div>
                    ) : (
                      products.map(product => (
                        <tr key={product._id}>
<td
  
>
  <div className="d-flex align-items-center">
    <span 
    style = {{
         fontSize: '16px',
           color: '#888888',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        padding: '0px 8px', // Top-Bottom: 10px, Left-Right: 8px
      }} >
      {product.name}
    </span>
  </div>
</td>


                          <td
                            style={{
                              color:
                                product.status === 'approved'
                                  ? '#2f4d2a'
                                  : '#ffad63',
                              fontSize: '16px',
                            }}
                          >
                            {product.status || 'Pending'}
                          </td>
                          <td>
                            <span style={{ color: '#888888' }}>
                              {new Date(
                                product.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#888888' }}>
                              {product.clocreProductId}
                            </span>
                          </td>
                          {/* <td>
                            <Link
                              to={`/seller/product/${product._id}`}
                              className="btn"
                              style={{
                                backgroundColor: '#ffad63',
                                color: '#fff',
                              }}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Link>
                          </td> */}

                          <td>
                            <button
                              className="btn"
                              onClick={() => handleEditClick(product._id)}
                              style={{
                                backgroundColor: '#ffad63',
                                color: '#fff',
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </button>
                          </td>

                        

                          {/* <td>
                            <button className="m-3" onClick={e => unarchiveHandler(e, product._id)}
                              style={{ backgroundColor: "#2f4d2a", color: "#fff", fontSize: "15px", padding: "5px", borderRadius: "7px" }}
                            >Unarchive</button>
                          </td> */}

                          <td>
                            <button
                              className=""
                              onClick={(e) => handleUnarchiveClick(e, product._id)}
                              style={{
                                backgroundColor: "#2f4d2a",
                                color: "#fff",
                                fontSize: "15px",
                                padding: "5px",
                                borderRadius: "7px",
                              }}
                            >
                              Unarchive
                            </button>
                          </td>

                          <Modal open={unarchiveModalOpen} onClose={cancelUnarchive}>
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
                                Do you want to unarchive this product?
                              </Typography>
                              <Box display="flex" justifyContent="space-between">
                                <Button
                                  onClick={confirmUnarchive}
                                  className="left-but"
                                  sx={{
                                    margin: "3px"
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  onClick={cancelUnarchive}
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
                      ))
                    )}
                  </tbody>
                </table>
                <Modal open={navModalOpen} onClose={handleNavClose}>
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
                      Are you sure want to update this product?(Item will be moved to pending state)
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Button
                        onClick={handleNavConfirm}
                        className="left-but"
                        sx={{ margin: "3px" }}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={handleNavClose}
                        sx={{
                          backgroundColor: '#2f4d2a',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#2f4d2a50',
                          },
                          width: "100%",
                          margin: "3px"
                        }}
                      >
                        No
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </div>
            </section>
          </div>
          {sellerProductCount > 0 && sellerProductCount > resPerPage ? (
            <div className="d-flex justify-content-center mt-5 tab-slider">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={sellerProductCount}
                itemsCountPerPage={resPerPage}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass={'page-item'}
                linkClass={'page-link'}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>

  )
}