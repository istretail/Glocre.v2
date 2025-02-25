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
import Tooltip from "rc-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faStar } from "@fortawesome/free-solid-svg-icons";
import { FaCamera, FaHome, FaBell, FaVideo, FaEllipsisH } from "react-icons/fa";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "./ProductDetail.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import bannerImg from "../../main-images/banner (1).webp";
import Rating from "@mui/material/Rating";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function ProductSearch({ onFilterChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, maincategory, loading, error, productsCount, resPerPage } =
    useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 2000]);
  const [priceChanged, setPriceChanged] = useState(price);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [rating, setRating] = useState(null);
  const { keyword, category } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const priceDropdownRef = useRef(null); // New ref for price dropdown
  const categoryList = [
    { name: "NVR", icon: <FaVideo /> },
    { name: "SMART HOME", icon: <FaHome /> },
    { name: "SENSORS", icon: <FaBell /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "CAMERA", icon: <FaCamera /> },
  ];

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      return toast.error(error);
    }

    const subcategoryParams =
      activeSubcategory && activeSubcategory !== "All"
        ? `subcategory=${activeSubcategory}`
        : "";

    dispatch(
      getProducts(
        keyword,
        priceChanged,
        maincategory,
        category,
        subcategoryParams,
        rating,
        currentPage,
      ),
    );
  }, [
    error,
    dispatch,
    currentPage,
    keyword,
    maincategory,
    category,
    activeSubcategory,
    priceChanged,
    rating,
  ]);

  const handleSubCategoryClick = (selectedSubCategory) => {
    setActiveSubcategory(selectedSubCategory);
  };

  const handlePriceApply = () => {
    setPriceChanged(price);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setActiveSubcategory("All"); // Reset subcategory to 'All' when main category is clicked
  };

  // const handlePriceChange = (newPrice) => {
  //     setPrice(newPrice);
  // };

  const handleRadioChange = (priceRange) => {
    const [min, max] = priceRange.split("-").map((val) => parseInt(val, 10));
    setPrice([min, max]);
    setPriceChanged([min, max]);
  };

  const handleClearRatingFilter = () => {
    setPrice([1, 2000]);
    setPriceChanged([1, 2000]);
    setRating(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target)
      ) {
        // Close price dropdown on click outside
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
    if (onFilterChange) {
      onFilterChange(newPrice); // Call the function only if it's defined
    } else {
      console.error("onFilterChange is not defined.");
    }
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
                    <div className="card border-0 shadow">
                      <h3>Category</h3>
                      <div className="catList">
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
                      </div>
                    </div>

                    <div className="card border-0 shadow priceCard">
                      <h3 className="mb-4">Filter by price</h3>

                      <Slider
                        range={true}
                        min={1}
                        max={2000}
                        defaultValue={price}
                        onChange={handlePriceChange}
                      />

                      <div className="d-flex pt-2 pb-2 priceRange">
                        <span>
                          From:{" "}
                          <strong className="text-success">
                            Rs: {price[0]}
                          </strong>
                        </span>
                        <span className="ml-auto">
                          To:{" "}
                          <strong className="text-success">
                            Rs: {price[1]}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="card border-0 shadow">
                      <h3>brand</h3>
                      <div className="catList">
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
                      </div>
                    </div>

                    <div className="card border-0 shadow">
                      <h3>Discount</h3>
                      <div className="catList">
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
                      </div>
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
