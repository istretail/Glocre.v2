import { Fragment, useEffect, useState, useRef } from "react";
import MetaData from "../layouts/MetaData";
import { useNavigate } from "react-router-dom";
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

import "react-range-slider-input/dist/style.css";

export default function ProductSearch({ onFilterChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products =[], loading, error, productsCount, resPerPage } =useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);



  const [rating, setRating] = useState(null);
  const { keyword, category } = useParams();

  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [price, setPrice] = useState([1, 2000]);            // Current selected price

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
        selectedMain,
        selectedCategory,
        selectedSubCategory,
        rating,
        currentPage
      )
    );
  }, [
    dispatch,
    currentPage,
    keyword,
    selectedMain,
    selectedCategory,
    selectedSubCategory,
    rating,
    JSON.stringify(price)
  ]);



  const filteredProducts = products?.filter(p => {
    return (
      (!selectedMain || p.maincategory === selectedMain) &&
      (!selectedCategory || p.category === selectedCategory) &&
      (!selectedSubCategory || p.subcategory === selectedSubCategory)
    );
  }) || [];

 
  
  const mainCategories = products && products.length ?[...new Set(products.map(p => p.maincategory))] : [];

  // Filter and get unique categories based on selected main
  const categories = selectedMain
    ? [...new Set(
      products
        .filter(p => p.maincategory === selectedMain)
        .map(p => p.category)
    )]
    : [];

  // Filter and get unique subcategories based on selected category
  const subCategories = selectedMain && selectedCategory
    ? [...new Set(
      products
        .filter(p =>
          p.maincategory === selectedMain && p.category === selectedCategory
        )
        .map(p => p.subcategory)
    )]
    : [];



  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };


  const handleMainChange = (cat) => {
    setSelectedMain(cat);
    setSelectedCategory(null);
    setSelectedSubCategory(null);

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
          <section className="listingPage">
            <div className="listingData">
              <div className="row">
                <div className="col-md-2 sidebarWrapper pt-0">
                  <div className="sidebar">
                      <div className="card border-0 shadow p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h3>Main Categories</h3>
                          {selectedMain && (
                            <button
                              className="btn-outline-secondary"
                              onClick={() => {
                                setSelectedMain(null);
                                setSelectedCategory(null);
                                setSelectedSubCategory(null);
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="catList">
                          {mainCategories.map(cat => (
                            <div
                              key={cat}
                              className="catItem d-flex align-items-center"
                              onClick={() => {
                                handleMainChange(cat);
                              }}
                            >
                              <h4 className="mb-0 ml-3 mr-3 text-capitalize">{cat}</h4>
                            </div>
                          ))}
                        </div>

                        {selectedMain && (
                          <>
                            <div className="d-flex justify-content-between align-items-center mt-4">
                              <h3>Categories</h3>
                              {selectedCategory && (
                                <button
                                  className=" btn-outline-secondary"
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
                                  onClick={() => {
                                    handleCategoryChange(cat);
                                  }}
                                >
                                  <h4 className="mb-0 ml-3 mr-3 text-capitalize">{cat}</h4>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {selectedCategory && (
                          <>
                            <div className="d-flex justify-content-between align-items-center mt-4">
                              <h3>Subcategories</h3>
                              {selectedSubCategory && (
                                <button
                                  className="btn-outline-secondary"
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
                                  onClick={() => {
                                    handleSubCategoryChange(sub);
                                  }
                                  }
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
                            className="form-check-input"
                            type="radio"
                            name="price"
                            id="price1"
                            onChange={() => setPrice([0, 1000])}
                            checked={price[0] === 0 && price[1] === 1000}
                          />
                          <label className="form-check-label" htmlFor="price1">
                            ₹0 – ₹1000
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="price"
                            id="price2"
                            onChange={() => setPrice([1000, 3000])}
                            checked={price[0] === 1000 && price[1] === 3000}
                          />
                          <label className="form-check-label" htmlFor="price2">
                            ₹1000 – ₹3000
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="price"
                            id="price3"
                            onChange={() => setPrice([3000, 5000])}
                            checked={price[0] === 3000 && price[1] === 5000}
                          />
                          <label className="form-check-label" htmlFor="price3">
                            ₹3000 – ₹5000
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="price"
                            id="price4"
                            onChange={() => setPrice([5000, 10000])}
                            checked={price[0] === 5000 && price[1] === 10000}
                          />
                          <label className="form-check-label" htmlFor="price4">
                            ₹5000 – ₹10000
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="price"
                            id="price5"
                            onChange={() => setPrice([10000, Infinity])}
                            checked={price[0] === 10000 && price[1] === Infinity}
                          />
                          <label className="form-check-label" htmlFor="price5">
                            ₹10000 and above
                          </label>
                        </div>
                      </div>


                    <div className="card border-0 shadow">
                      <h3>brand</h3>
                      {/* <div className="catList">
                        {categoryList.map((cat) => (
                          <div
                            className="catItem d-flex align-items-center"
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                          >
                            <h4 className="mb-0 ml-3 mr-3 text-capitalize">
                              {cat.name}
                            </h4>
                          </div>
                        ))}
                      </div> */}
                    </div>

                    <div className="card border-0 shadow">
                      <h3>Discount</h3>
                      {/* <div className="catList">
                        {categoryList.map((cat) => (
                          <div
                            className="catItem d-flex align-items-center"
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                          >
                            <span className="img">
                              <div width={30}>{cat.icon}</div>
                            </span>
                            <h4 className="mb-0 ml-3 mr-3 text-capitalize">
                              {cat.name}
                            </h4>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="col-md-10 rightContent homeProducts pt-0">
                  <div className="productRow pl-4 pr-3">
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
