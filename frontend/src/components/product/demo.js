import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getProduct } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { addCartItemToCart } from "../../actions/cartActions";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../../slices/cartSlice";
import {
  clearError,
  clearProduct,
  clearReviewSubmitted,
} from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./ProductDetail.css";
// import prod1 from '../../images/8.png'
import { Link } from "react-router-dom";
import ReactStars from "react-stars";
import { ratingClasses } from "@mui/material";
import subprod1 from "../../images/3.png";
import subprod2 from "../../images/3.png";
import subprod3 from "../../images/4.png";
import partner1 from "../../images/partner1.jpg";
import partner2 from "../../images/partner2.jpg";

export default function ProductDetail() {
  const {
    loading,
    product = {},
    isReviewSubmitted,
    error,
  } = useSelector((state) => state.productState);
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [mainMedia, setMainMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainMedia(product.images[0]);
    }
  }, [product.images]);

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber === 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const reviewHandler = () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }
    if (user) {
      dispatch(addCartItemToCart(product._id, quantity));
    } else {
      const cartItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0].url,
        stock: product.stock,
        quantity,
      };
      dispatch(addCartItem(cartItem));
      toast.success("Item added to cart successfully");
    }
  };

  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast("Review Submitted successfully", {
        type: "success",
        onOpen: () => dispatch(clearReviewSubmitted()),
      });
    }

    if (error) {
      toast(error, {
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }

    if (!product._id || isReviewSubmitted) {
      dispatch(getProduct(id));
    }
  }, [dispatch, id, isReviewSubmitted, error]);

  useEffect(() => {
    return () => {
      dispatch(clearProduct());
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fake

  const [activeImage, setActiveImage] = useState(require("../../images/6.png"));
  const [navOpen, setNavOpen] = useState(false);

  const productImages = [
    require("../../images/6.png"),
    require("../../images/6.png"),
    require("../../images/6.png"),
  ];

  const changeImage = (src) => {
    setActiveImage(src);
  };

  return (
    <>
      <div class="breadcrumbWrapper">
        <div class="container-fluid">
          <ul class="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to="/">Home</Link>{" "}
            </li>
            <li>Sign In</li>
          </ul>
        </div>
      </div>

      <section className="Product-page-ist container-fluid    ">
        <div className="product d-flex">
          <div className="column-xs-12 col-lg-4">
            <div className="product-gallery">
              <div className="product-image">
                <img className="active" src={activeImage} alt="Product" />
              </div>
              <ul className="image-list">
                {productImages.map((src, index) => (
                  <li key={index} className="image-item">
                    <img
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => changeImage(src)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="column-xs-12 col-lg-5 description">
            <h1>{product.name}</h1>
            <h2>
              1080p HD TVI AHD CVI CVBS CCTV Camera Wide Angle Security Camera
              Outdoor 180 Degree to Offer High Image Quality with 30pcs IR LEDs
              Long Distance
            </h2>
            <div className="description">
              <p>
                <span style={{ color: "skyblue", fontSize: "22px" }}>96%</span>{" "}
                <span style={{ color: "grey", fontStyle: "italic" }}>
                  of respondents would recommend this to a friend
                </span>
              </p>{" "}
              <div>
                <p
                  style={{
                    fontWeight: "500",
                    borderBottom: "2px solid #2f4d2a",
                    width: "23%",
                    paddingBottom: "7px",
                  }}
                  className="pt-3"
                >
                  Features & Benefits :
                </p>

                <ul
                  style={{
                    color: "#333333",
                    listStyleType: "none",
                  }}
                >
                  <li
                    style={{
                      margin: "0 0 10px",
                      position: "relative",
                      paddingLeft: "25px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#2f4d2a",
                        display: "inline-block",
                      }}
                    ></span>
                    Groundbreaking 1600mg Liposomal Vitamin C Complex
                  </li>
                  <li
                    style={{
                      margin: "0 0 10px",
                      position: "relative",
                      paddingLeft: "25px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#8c8c8c",
                        display: "inline-block",
                      }}
                    ></span>
                    Easy to swallow and miraculous absorption
                  </li>
                  <li
                    style={{
                      margin: "0 0 10px",
                      position: "relative",
                      paddingLeft: "25px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#8c8c8c",
                        display: "inline-block",
                      }}
                    ></span>
                    Satisfaction assured with a risk-free purchase
                  </li>
                </ul>
              </div>
              <div>
                <div class="accordion" id="accordionExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        STYLE : 2MP Analog 180 Degree
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      class="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <div className="d-flex">
                          <div className="">
                            <img
                              src={subprod1}
                              className="c"
                              style={{ height: "10vh", width: "100%" }}
                            />
                          </div>
                          <div className="">
                            <img
                              src={subprod2}
                              className="c"
                              style={{ height: "10vh", width: "100%" }}
                            />
                          </div>
                          <div className="">
                            <img
                              src={subprod3}
                              className="c"
                              style={{ height: "10vh", width: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <button className="add-to-cart">Add To Cart</button> */}
          </div>
          <div
            className="column-xs-12 col-lg-3"
            style={{
              boxShadow: "10px 10px 40px #eeeeee",
              top: "20px",
              height: "fit-content",
              padding: "2rem",
              borderRadius: "10px",
            }}
          >
            <div className="">
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>
            </div>
            <div className="">
              <p style={{ fontWeight: "bold" }}>Item #: {product._id}</p>
            </div>

            <div className="">
              <span
                style={{
                  fontSize: "27px",
                  fontWeight: "bold",
                  color: "#2f4d2a",
                }}
              >
                INR {product.price}
              </span>
            </div>

            <div className="">
              <div className="d-flex ">
                <ReactStars
                  count={5}
                  onChange={ratingClasses}
                  size={30}
                  className="mt-2"
                />
                <p style={{ paddingTop: "20px", color: "#2f4d2a" }}>
                  {" "}
                  &nbsp;&nbsp;&nbsp;5 rating&nbsp;&nbsp;&nbsp;
                </p>
              </div>
            </div>

            <div className="pt-2 pb-3">
              <div className="quantityDrop d-flex align-items-center">
                <Button onClick={decreaseQty}>
                  <RemoveIcon />
                </Button>
                <input type="number" value={quantity} readOnly />
                <Button onClick={increaseQty}>
                  <AddIcon />
                </Button>
              </div>
            </div>

            <div className="pt-2 pb-2">
              <button
                type="button"
                id="cart_btn"
                className="btn btn-secondary d-inline  text-white"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>

            <div className="pt-2 pb-2">
              <button className="btn btn-dark text-white c2">BUY NOW</button>
            </div>

            <div className="pt-2 ">
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "15px",
                  color: "#2f4d2a",
                  fontWeight: "bold",
                }}
              >
                Fastest cross-border delivery
              </p>
            </div>

            <div className="pb-2">
              <span
                style={{
                  fontSize: "14px",
                  color: "#2f4d2a",
                  fontWeight: "bold",
                }}
              >
                Our Top Logistics Partners
              </span>
              <div className="mt-2">
                <img src={partner1} className="img-fluid" />
                <img src={partner2} className="img-fluid ms-2" />
              </div>
            </div>

            {user ? (
              <button
                onClick={handleShow}
                id="review_btn"
                type="button"
                className="btn btn-success mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
              >
                Submit Your Review
              </button>
            ) : (
              <button
                onClick={handleShow}
                id="review_btn"
                type="button"
                className="btn btn-primary mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
              >
                Login to Post Review
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container">
        <h3
          style={{
            borderBottom: "3px solid #2f4d2a",
            width: "222px",
            paddingBottom: "10px",
            marginBottom: "30px",
          }}
        >
          Product Details
        </h3>
        <div class="d-flex gap-3">
          <div class="col-sm-6 mb-3 mb-sm-0">
            <div
              class="card"
              style={{ height: "250px", border: "2px solid #2f4d2a" }}
            >
              <div class="card-body">
                <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>
                  &nbsp; Specifications
                </h5>
                <p class="card-text mt-3">Brand name : Boltz Corporation</p>
                <p class="card-text">Efficiency (%) : 0.75</p>
                <p class="card-text">Country of Origin : India</p>
                <p class="card-text">
                  Lifting Weight :Single Hook-750Kg, Double Hook-1500Kg
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div
              class="card"
              style={{ height: "250px", border: "2px solid #2f4d2a" }}
            >
              <div class="card-body">
                <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>
                  &nbsp; Description
                </h5>
                <p class="card-text mt-3">
                  {" "}
                  At vivamus platea nibh in vitae risus. Dui eget ultricies
                  tristique viverra cras euismod enim placerat. Consequat
                  faucibus at sit morbi molestie pulvinar adipiscing blandit
                  morbi. Non justo sed enim ac. Elit morbi enim duis eget. Ac in
                  feugiat massa felis nisl tempor ac. Mauris lacus sapien ut
                  amet facilisi. Dictumst pellentesque feugiat at volutpat nisl.
                  Interdum ut in vivamus eget tincidunt mauris. Erat a phasellus
                  tempor pellentesque. Euismod et augue vivamus lacus nibh in
                  rhoncus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-3 mb-5">
        <div class="d-flex gap-3">
          <div class="col-sm-6 mb-3 mb-sm-0">
            <div
              class="card"
              style={{ height: "250px", border: "2px solid #2f4d2a" }}
            >
              <div class="card-body">
                <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>
                  &nbsp; Specifications
                </h5>
                <p class="card-text mt-3">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div
              class="card"
              style={{ height: "250px", border: "2px solid #2f4d2a" }}
            >
              <div class="card-body">
                <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>
                  &nbsp; Reviews
                </h5>
                <p class="card-text mt-3">NO REVIEWS FOR THIS PRODUCT</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
