import { useEffect, useState } from "react"
import '../admin/productlist.css'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { addArchiveProduct, cloneProduct, getSellerProducts } from "../../actions/productActions"
import { clearError, clearProductCloned, clearProductDeleted, clearProductArchive } from "../../slices/singleProductSlice"
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Pagination from 'react-js-pagination';
import SellerSidebar from "./SellerSidebar"
import { faCartShopping, faFilter, faPencil, faSearch, faDashboard, faList, faShoppingBag, faSort, } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Dropdown, } from "react-bootstrap";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function SellerProducts() {

  const { loading = true, products = [], sellerProductCount, isProductDeleted, resPerPage, isProductCreated, isProductUpdated, error } = useSelector(state => state.productState)

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');


  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  const cloneHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(cloneProduct(id))
  }
  const archiveHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(addArchiveProduct(id))
  }
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };


  const handleFilterChange = (status) => {
    setFilterStatus(status);

    dispatch(getSellerProducts(searchKeyword, status));
  };
  useEffect(() => {
    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      })
      return
    }
    if (isProductDeleted) {
      toast('Product Deleted Succesfully!', {
        type: 'success',
        onOpen: () => dispatch(clearProductDeleted())
      })
      return;
    }
    if (isProductCreated) {
      toast.success('Product Cloned Successfully!', {
        onOpen: () => dispatch(clearProductCloned())
      })
      return;
    }
    if (isProductUpdated) {
      toast.success('Product Archived Successfully!', {
        onOpen: () => dispatch(clearProductArchive())
      })
      return;
    }
    dispatch(getSellerProducts(searchKeyword, filterStatus, currentPage))
  }, [dispatch, error, isProductDeleted, isProductUpdated, isProductCreated, searchKeyword, filterStatus, currentPage])


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

  // Inside your component:
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


  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [productToClone, setProductToClone] = useState(null);
  const [cloneEvent, setCloneEvent] = useState(null); // store the event
  const handleCloneClick = (e, id) => {
    setCloneEvent(e); // store the event
    setProductToClone(id);
    setCloneModalOpen(true);
  };

  const confirmClone = () => {
    cloneEvent.target.disabled = true;
    dispatch(cloneProduct(productToClone));
    setCloneModalOpen(false);
    setProductToClone(null);
    setCloneEvent(null);
  };

  const cancelClone = () => {
    setCloneModalOpen(false);
    setProductToClone(null);
    setCloneEvent(null);
  };


  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState(null);
  const [archiveEvent, setArchiveEvent] = useState(null);
  const handleArchiveClick = (e, id) => {
    setArchiveEvent(e);
    setProductToArchive(id);
    setArchiveModalOpen(true);
  };

  const confirmArchive = () => {
    archiveHandler(archiveEvent, productToArchive);
    setArchiveModalOpen(false);
    setProductToArchive(null);
    setArchiveEvent(null);
  };

  const cancelArchive = () => {
    setArchiveModalOpen(false);
    setProductToArchive(null);
    setArchiveEvent(null);
  };



  return (
    <>
      <section className="seller-product-list-section ">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            <SellerSidebar />
          </div>
          <div className="col-12 col-lg-10 col-md-12 ">
            <Link to="/">
              <div className="mobile-logo">
                <img
                  src={require('../../images/procure-g-logo.png')} alt="glocre"
                />
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
                      <li>Product List</li>
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
                      <li>Product List</li>
                    </ul>
                  </div>
                  <div
                    className="col-lg-7 col-md-6"
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'end',
                    }}
                  >
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
                  <div
                    className="col-lg-1 col-md-2 dash-cont-glc"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'end',
                    }}
                  >
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
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleFilterChange('approved')}
                          className="text-dark"
                        >
                          approved
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleFilterChange('pending')}
                          className="text-dark"
                        >
                          pending
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleFilterChange('')}
                          className="text-dark"
                        >
                          All
                        </Dropdown.Item>
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
                  <div className="col-2 text-center">
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
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleFilterChange('approved')}
                          className="text-dark"
                        >
                          approved
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleFilterChange('pending')}
                          className="text-dark"
                        >
                          pending
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleFilterChange('')}
                          className="text-dark"
                        >
                          All
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  {/* <div className="col-2 text-center">
                      <img src={avatar1} alt="Avatar" className="avatar" />
                    </div> */}
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
                  </ul>
                </div>
              </Drawer>
            </div>

            <h3 style={{ color: '#ffad63', marginTop: '40px' }}>
              PRODUCT LIST
            </h3>
        

            <section className="cartWrapper">
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '200px' }}>Name</th>
                      <th style={{ minWidth: '180px' }}>Status</th>
                      <th style={{ minWidth: '180px' }}>Date</th>
                      <th style={{ minWidth: '300px' }}>ID</th>
                      <th style={{ minWidth: '150px' }}>Update Product</th>
                      <th style={{ minWidth: '150px' }}>Clone</th>
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
                        <p style={{ color: "#8c8c8c", fontSize: "18px" }}>You have no products. Please create one.</p>
                        <Link to="/seller/products/create">
                          <button
                            className="btn mt-3"
                            style={{ backgroundColor: '#ffad63', color: '#fff' }}>
                            Create Product
                          </button>
                        </Link>
                      </div>
                    ) : (
                      products.map(product => (
                        <tr key={product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span
                                style={{ fontSize: '16px', color: '#888888' }}
                              >
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
                          </td>

                         


                          {/* <td>
                            <button onClick={e => cloneHandler(e, product._id)} style={{ backgroundColor: "#ffad63", color: "#fff", fontSize: "15px", padding: "5px", borderRadius: "7px" }}>Clone</button>
                          </td> */}

                          <td>
                            <button
                              onClick={(e) => handleCloneClick(e, product._id)}
                              style={{ backgroundColor: "#ffad63", color: "#fff", fontSize: "15px", padding: "5px", borderRadius: "7px" }}
                            >
                              Clone
                            </button>
                          </td>

                          <Modal open={cloneModalOpen} onClose={cancelClone}>
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
                                Want to clone this item?
                              </Typography>
                              <Box display="flex" justifyContent="space-between">
                                <Button
                                  onClick={confirmClone}
                                  className="left-but"
                                  sx={{
                                    margin: "3px"
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  onClick={cancelClone}
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

                          {/* <td>
                            <button className="m-3" onClick={e => archiveHandler(e, product._id)}
                              style={{ backgroundColor: "#2f4d2a", color: "#fff", fontSize: "15px", padding: "5px", borderRadius: "7px" }}
                            >Archive</button>
                          </td> */}

                          <td>
                            <button
                              className="m-3"
                              onClick={(e) => handleArchiveClick(e, product._id)}
                              style={{ backgroundColor: "#2f4d2a", color: "#fff", fontSize: "15px", padding: "5px", borderRadius: "7px" }}
                            >
                              Archive
                            </button>
                          </td>

                          <Modal open={archiveModalOpen} onClose={cancelArchive} >
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
                                Want to Unarchive this item?(item will be moved to pending state)
                              </Typography>
                              <Box display="flex" justifyContent="space-between">
                                <Button
                                  onClick={confirmArchive}
                                  className="left-but"
                                  sx={{
                                    margin: "3px"
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  onClick={cancelArchive}
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
  );
}