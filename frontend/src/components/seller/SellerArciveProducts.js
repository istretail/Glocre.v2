import { Fragment, useEffect, useState } from "react"
import '../admin/productlist.css'
import { useDispatch, useSelector } from "react-redux"
import { removeArchiveProduct, getArchiveProducts, } from "../../actions/productActions"
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify'
import { clearError, clearProductArchive, } from "../../slices/singleProductSlice"
import SellerSidebar from "./SellerSidebar"
import { Link } from "react-router-dom"
import { faCartShopping, faFilter, faPencil, faSearch, faDashboard, faList, faShoppingBag, faSort, } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Dropdown, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Pagination from 'react-js-pagination';
export default function SellerArchiveProducts() {
  // const { loading = true, productsCount } = useSelector(state => state.productsState)
  const { loading = true, products = [], sellerProductCount, isProductDeleted, resPerPage, error } = useSelector(state => state.productsState)
  const { isProductUpdated } = useSelector(state => state.productState)
  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const unarchiveHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(removeArchiveProduct(id))
  }

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
    dispatch(getArchiveProducts(searchKeyword, currentPage))
  }, [dispatch, error, isProductDeleted, isProductUpdated, searchKeyword, currentPage])

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


  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
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

                          className="text-dark"
                        >
                          approved
                        </Dropdown.Item>
                        <Dropdown.Item

                          className="text-dark"
                        >
                          pending
                        </Dropdown.Item>
                        <Dropdown.Item

                          className="text-dark"
                        >
                          All
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

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

                          className="text-dark"
                        >
                          approved
                        </Dropdown.Item>
                        <Dropdown.Item

                          className="text-dark"
                        >
                          pending
                        </Dropdown.Item>
                        <Dropdown.Item

                          className="text-dark"
                        >
                          All
                        </Dropdown.Item>
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
                  </ul>
                </div>
              </Drawer>
            </div>

            <h3 style={{ color: '#ffad63', marginTop: '40px' }}>
              PRODUCT LIST
            </h3>
            <p>Glocre</p>

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

                          <td>
                            <button className="m-3" onClick={e => unarchiveHandler(e, product._id)}>unarchive</button>
                          </td>
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

  )
}