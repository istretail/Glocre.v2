import { Fragment, useEffect, useState, useRef } from "react";
import MetaData from "../layouts/MetaData";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Product from "../product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import Nav from "../layouts/nav";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import "react-range-slider-input/dist/style.css";
import { faFilter, faSort, faStar } from "@fortawesome/free-solid-svg-icons";

export default function ProductCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { products = [], loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(null);
  const { keyword, maincategory, category, subcategory } = useParams();
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [price, setPrice] = useState([0, 200000]);

  // 1. Toast error separately
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  // 2. Fetch products separately
  useEffect(() => {
    dispatch(
      getProducts(
        keyword,
        price,
        maincategory,
        category,
        subcategory,
        rating,
        currentPage
      )
    );
  }, [
    dispatch,
    currentPage,
    keyword,
    maincategory,
    selectedCategory,
    selectedSubCategory,
    rating,
    JSON.stringify(price)
  ]);
  useEffect(() => {
    if (location.state) {
      const { category, subcategory } = location.state;
      setSelectedCategory(category || null);
      setSelectedSubCategory(subcategory || null);
      // clear it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);


  // Get all unique categories from products
  const categories = products && products.length
    ? [...new Set(products.map(p => p.category))]
    : [];

  // Filter and get unique subcategories based on selected category
  const subCategories = selectedCategory
    ? [...new Set(
      products
        .filter(p => p.category === selectedCategory)
        .map(p => p.subcategory)
    )]
    : [];
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryChange = (sub) => {
    setSelectedSubCategory(sub);
  };

  return (
    <>
      <Nav />
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Results"} />

          {/* Medium & Small screen filter/sort */}
          <div className="d-block d-md-none px-3 mobileSticky">
            <div className="d-flex w-100">
              {/* CATEGORY Dropdown */}
              <Dropdown className="w-50 text-center">
                <Dropdown.Toggle
                  as="div"
                  className="mobileBtn-l py-2"
                  style={{ cursor: "pointer" }}
                >
                  CATEGORIES
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100 p-3 dropdo-menu-prodcat">

                  <div className="d-flex justify-content-between align-items-center">
                    <h6>Categories</h6>
                    {selectedCategory && (
                      <button
                        className="cancel-cat-but-glc"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedSubCategory(null);
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="catList">
                    {categories.map(cat => (
                      <div
                        key={cat}
                        className="catItem d-flex align-items-center"
                        onClick={() => handleCategoryChange(cat)}
                      >
                        <h4 className="mb-0 ml-3 mr-3 text-capitalize">{cat}</h4>
                      </div>
                    ))}
                  </div>

                  {selectedCategory && (
                    <>
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <h6>Subcategories</h6>
                        {selectedSubCategory && (
                          <button
                            className="cancel-cat-but-glc"
                            onClick={() => setSelectedSubCategory(null)}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="catList">
                        {subCategories.map(sub => (
                          <div
                            key={sub}
                            className="catItem d-flex align-items-center"
                            onClick={() => handleSubCategoryChange(sub)}
                          >
                            <h4 className="mb-0 ml-3 mr-3 text-capitalize">{sub}</h4>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                </Dropdown.Menu>
              </Dropdown>

              {/* PRICE FILTER Dropdown Placeholder */}
              <Dropdown className="w-50 text-center">
                <Dropdown.Toggle
                  as="div"
                  className="mobileBtn-r py-2"
                  style={{ cursor: "pointer" }}
                >
                  {/* <FontAwesomeIcon icon={faSort} className="me-2" /> */}
                  FILTER BY PRICE
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100 p-3 dropdo-menu-prodcat">
                  <div className="priceCard">
                    <h5 className="mb-3" style={{ fontSize: "14px" }}>Filter by Price</h5>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input custom-checkbox1"
                        name="price"
                        id="price1"
                        onChange={() => setPrice([0, 1000])}
                        checked={price[0] === 0 && price[1] === 1000}
                        style={{
                          outline: "1px solid #ffad63",
                          border: "none",
                          width: "20px",
                          height: "20px",
                          backgroundColor: price[0] === 0 && price[1] === 1000 ? "#ffad63" : "transparent",
                        }}
                      />
                      <label className="form-check-label" htmlFor="price1">
                        ₹0 – ₹1000
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="price"
                        id="price2"
                        onChange={() => setPrice([1000, 3000])}
                        checked={price[0] === 1000 && price[1] === 3000}
                        style={{
                          outline: "1px solid #ffad63",
                          width: "20px",
                          border: "none",
                          height: "20px",
                          backgroundColor: price[0] === 1000 && price[1] === 3000 ? "#ffad63" : "transparent",
                        }}
                      />
                      <label className="form-check-label" htmlFor="price2">
                        ₹1000 – ₹3000
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="price"
                        id="price3"
                        onChange={() => setPrice([3000, 5000])}
                        checked={price[0] === 3000 && price[1] === 5000}
                        style={{
                          outline: "1px solid #ffad63",
                          border: "none",
                          width: "20px",
                          height: "20px",
                          backgroundColor: price[0] === 3000 && price[1] === 5000 ? "#ffad63" : "transparent",
                        }}
                      />
                      <label className="form-check-label" htmlFor="price3">
                        ₹3000 – ₹5000
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="price"
                        id="price4"
                        onChange={() => setPrice([5000, 10000])}
                        checked={price[0] === 5000 && price[1] === 10000}
                        style={{
                          outline: "1px solid #ffad63",
                          border: "none",
                          width: "20px",
                          height: "20px",
                          backgroundColor: price[0] === 5000 && price[1] === 10000 ? "#ffad63" : "transparent",
                        }}
                      />
                      <label className="form-check-label" htmlFor="price4">
                        ₹5000 – ₹10000
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="price"
                        id="price5"
                        onChange={() => setPrice([10000, Infinity])}
                        checked={price[0] === 10000 && price[1] === Infinity}
                        style={{
                          outline: "1px solid #ffad63",
                          border: "none",
                          width: "20px",
                          height: "20px",
                          backgroundColor: price[0] === 10000 && price[1] === Infinity ? "#ffad63" : "transparent",
                        }}
                      />
                      <label className="form-check-label" htmlFor="price5">
                        ₹10000 and above
                      </label>
                    </div>

                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Big screen */}
          <section className="listingPage">
            <div className="listingData">
              <div className="row">
                <div className="col-md-2 sidebarWrapper pt-0">
                  <div className="sidebar">
                    <div className="card border-0 shadow p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h3>Categories</h3>
                        {selectedCategory && (
                          <button
                            className="cancel-cat-but-glc"
                            onClick={() => {
                              setSelectedCategory(null);
                              setSelectedSubCategory(null);
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="catList">
                        {categories.map(cat => (
                          <div
                            key={cat}
                            className="catItem d-flex align-items-center"
                            onClick={() => handleCategoryChange(cat)}
                          >
                            <h4 className="mb-0 ml-3 mr-3 text-capitalize">{cat}</h4>
                          </div>
                        ))}
                      </div>

                      {selectedCategory && (
                        <>
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <h3>Subcategories</h3>
                            {selectedSubCategory && (
                              <button
                                className="cancel-cat-but-glc"
                                onClick={() => setSelectedSubCategory(null)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          <div className="catList">
                            {subCategories.map(sub => (
                              <div
                                key={sub}
                                className="catItem d-flex align-items-center"
                                onClick={() => handleSubCategoryChange(sub)}
                              >
                                <h4 className="mb-0 ml-3 mr-3 text-capitalize">{sub}</h4>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="card border-0 shadow priceCard">
                      <h3 className="mb-4">Filter by Price</h3>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input custom-checkbox1"
                          name="price"
                          id="price1"
                          onChange={() => setPrice([0, 1000])}
                          checked={price[0] === 0 && price[1] === 1000}
                          style={{
                            outline: "1px solid #ffad63",
                            border: "none",
                            width: "20px",
                            height: "20px",
                            backgroundColor: price[0] === 0 && price[1] === 1000 ? "#ffad63" : "transparent",
                          }}
                        />
                        <label className="form-check-label" htmlFor="price1">
                          ₹0 – ₹1000
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="price"
                          id="price2"
                          onChange={() => setPrice([1000, 3000])}
                          checked={price[0] === 1000 && price[1] === 3000}
                          style={{
                            outline: "1px solid #ffad63",
                            width: "20px",
                            border: "none",
                            height: "20px",
                            backgroundColor: price[0] === 1000 && price[1] === 3000 ? "#ffad63" : "transparent",
                          }}
                        />
                        <label className="form-check-label" htmlFor="price2">
                          ₹1000 – ₹3000
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="price"
                          id="price3"
                          onChange={() => setPrice([3000, 5000])}
                          checked={price[0] === 3000 && price[1] === 5000}
                          style={{
                            outline: "1px solid #ffad63",
                            border: "none",
                            width: "20px",
                            height: "20px",
                            backgroundColor: price[0] === 3000 && price[1] === 5000 ? "#ffad63" : "transparent",
                          }}
                        />
                        <label className="form-check-label" htmlFor="price3">
                          ₹3000 – ₹5000
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="price"
                          id="price4"
                          onChange={() => setPrice([5000, 10000])}
                          checked={price[0] === 5000 && price[1] === 10000}
                          style={{
                            outline: "1px solid #ffad63",
                            border: "none",
                            width: "20px",
                            height: "20px",
                            backgroundColor: price[0] === 5000 && price[1] === 10000 ? "#ffad63" : "transparent",
                          }}
                        />
                        <label className="form-check-label" htmlFor="price4">
                          ₹5000 – ₹10000
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="price"
                          id="price5"
                          onChange={() => setPrice([10000, Infinity])}
                          checked={price[0] === 10000 && price[1] === Infinity}
                          style={{
                            outline: "1px solid #ffad63",
                            border: "none",
                            width: "20px",
                            height: "20px",
                            backgroundColor: price[0] === 10000 && price[1] === Infinity ? "#ffad63" : "transparent",
                          }}
                        />
                        <label className="form-check-label" htmlFor="price5">
                          ₹10000 and above
                        </label>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="col-md-10 rightContent homeProducts pt-0">
                  <div className="productRow  pl-3 pr-3">
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <div key={product._id} className="productCard p-1">
                          <Product product={product} />
                        </div>
                      ))
                    ) : (
                      <p className="mt-5">
                        There are no products with this keyword.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {resPerPage <= productsCount && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText={"Next"}
                  prevPageText={"Prev"}
                  firstPageText={"First"}
                  lastPageText={"Last"}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            )}
          </section>

        </>
      )}
    </>
  );
}
