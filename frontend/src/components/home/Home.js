import { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Product from "../product/Product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaHome, FaBell, FaVideo, FaEllipsisH } from "react-icons/fa"; // Example icons from Font Awesome
import "../product/ProductDetail.css";
import Slideshow from "../layouts/HomeSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { logEvent } from "../../actions/analyticsActions";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 2000]);
  const [priceChanged, setPriceChanged] = useState(price);
  const [categories, setCategories] = useState([]);

  const categoryList = [
    { name: "NVR", icon: <FaVideo /> },
    { name: "SMART HOME", icon: <FaHome /> },
    { name: "SENSORS", icon: <FaBell /> },
    { name: "CAMERA", icon: <FaCamera /> },
    { name: "OTHERS", icon: <FaEllipsisH /> },
  ];
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      return toast.error(error);
    }

    dispatch(getProducts(null, null, null, null, null, null, currentPage));
  }, [error, dispatch, currentPage, categories, priceChanged]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <Fragment>
      <Slideshow />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData
            title={"PROCURE-G - Glocal Sourcing made Smart & Simple."}
          />

          <section id="products" className="container-fluid">
            <h2 className=" hd">Popular Products</h2>
            <div className="productRow">
              {products &&
                products.map((product) => (
                  <div key={product._id} className="productCard">
                    <Product product={product} />
                  </div>
                ))}
            </div>
          </section>

          {productsCount > 0 && productsCount > resPerPage ? (
            <div className="d-flex justify-content-center mt-5 tab-slider">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={"Next"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass={"page-item"}
                linkClass={"page-link"}
              />
            </div>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
}
