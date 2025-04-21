// import { Fragment, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { createReview, getProduct, getRelatedProducts } from "../../actions/productActions";
// import Loader from "../layouts/Loader";
// import MetaData from "../layouts/MetaData";
// import { Modal } from 'react-bootstrap';
// import { addCartItemToCart } from "../../actions/cartActions";
// import { addCartItem, removeCartItem, updateCartItemQuantity } from "../../slices/cartSlice";
// import { clearError, clearProduct, clearReviewSubmitted } from "../../slices/singleProductSlice";
// import { toast } from "react-toastify";
// import ProductReview from "./ProductReview";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// import 'swiper/swiper-bundle.css';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
// import './ProductDetail.css'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen } from "@fortawesome/free-solid-svg-icons";
// import Product from "./Product";
// import { logEvent } from "../../actions/analyticsActions";
// export default function ProductDetail() {
//   const { loading, product = {}, isReviewSubmitted, error } = useSelector((state) => state.productState);
//   const { relatedProducts, loading: relatedLoading } = useSelector((state) => state.relatedProductsState);
//   const { user } = useSelector((state) => state.authState);
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const [quantity, setQuantity] = useState(1);
//   const [mainMedia, setMainMedia] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [mainImage, setMainImage] = useState('');    // Set the first image as the default main image.
//   // Add this state
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   useEffect(() => {
//     if (product.images && product.images.length > 0) {
//       setMainImage(product.images[0].image); // Set the first image as the default main image
//     }
//   }, [product.images]);
//   // Related Product
//   useEffect(() => {
//     if (!product._id || isReviewSubmitted) {
//       dispatch(getProduct(id));
//     }

//     // Fetch related products when the main product is loaded
//     if (product.maincategory) {
//       dispatch(getRelatedProducts(product.maincategory));
//     }
//   }, [dispatch, id, isReviewSubmitted, product.maincategory]);
//   const handleThumbnailClick = (image) => {
//     setMainImage(image);
//   };

//   useEffect(() => {
//     if (product.images && product.images.length > 0) {
//       setMainMedia(product.images[0]);
//     }
//   }, [product.images]);

//   const getAvailableStock = () => {
//     return selectedVariant ? selectedVariant.stock : product.stock;
//   };

//   const increaseQty = () => {
//     const availableStock = getAvailableStock();
//     if (availableStock === 0 || quantity >= availableStock) return;
//     setQuantity((prevQuantity) => prevQuantity + 1);
//   };

//   const decreaseQty = () => {
//     if (quantity === 1) return;
//     setQuantity((prevQuantity) => prevQuantity - 1);
//   };



//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const [rating, setRating] = useState(1);
//   const [comment, setComment] = useState("");

//   const reviewHandler = () => {
//     const formData = new FormData();
//     formData.append("rating", rating);
//     formData.append("comment", comment);
//     formData.append("productId", id);
//     dispatch(createReview(formData));
//   };

//   const handleAddToCart = () => {
//     if (quantity > (selectedVariant ? selectedVariant.stock : product.stock)) {
//       toast.error("Quantity exceeds available stock");
//       return;
//     }
//     const cartItem = {
//       product: product._id,
//       name: product.name,
//       price: selectedVariant ? selectedVariant.price : product.price,
//       image: selectedVariant ? selectedVariant.images[0] : product.images[0],
//       stock: selectedVariant ? selectedVariant.stock : product.stock,
//       quantity,
//       tax: product.tax,
//       variant: selectedVariant ? {
//         _id: selectedVariant._id,
//         variantType: selectedVariant.variantType,
//         variantName: selectedVariant.variantName,
//         price: selectedVariant.price,
//         offPrice: selectedVariant.offPrice,
//         stock: selectedVariant.stock,
//         images: selectedVariant.images,
//       } : null
//     };

//     if (user) {
//       dispatch(addCartItemToCart(cartItem));
//     } else {
//       dispatch(addCartItem(cartItem)); // Update Redux state
//       toast.success("Item added to cart successfully");
//     }

//   };
//   useEffect(() => {
//     if (product.variants && product.variants.length > 0) {
//       setSelectedVariant(product.variants[0]);
//       setMainImage(product.variants[0].images[0]); // Set the first image of the first variant as the default main image
//     } else if (product.images && product.images.length > 0) {
//       setMainImage(product.images[0]); // Set the first image as the default main image
//     }
//   }, [product.variants, product.images]);
//   useEffect(() => {
//     if (isReviewSubmitted) {
//       handleClose();
//       toast("Review Submitted successfully", {
//         type: "success",
//         onOpen: () => dispatch(clearReviewSubmitted())
//       });
//     }

//     if (error) {
//       toast(error, {
//         type: "error",
//         onOpen: () => dispatch(clearError())
//       });
//       return;
//     }

//     if (!product._id || isReviewSubmitted) {
//       dispatch(getProduct(id));
//     }
//   }, [dispatch, id, isReviewSubmitted, error]);

//   useEffect(() => {
//     return () => {
//       dispatch(clearProduct());
//     };
//   }, []);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//   useEffect(() => {
//     const startTime = Date.now();
//     return () => {
//       const timeSpent = (Date.now() - startTime) / 1000;
//       logEvent({ event: 'page_view', pageUrl: window.location.pathname, timeSpent });
//     };
//   }, []);

//   return (
//     <Fragment>
//       {loading ? <Loader /> :
//         <Fragment>
//           <MetaData title={product.name} />
//           <section className="Product-page-ist">

//             <div className="second-nav">
//               <nav
//                 style={{
//                   "--bs-breadcrumb-divider":
//                     "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E\")",
//                 }}
//                 aria-label="breadcrumb"
//               >
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <a href="#">Home</a>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Products
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Power Tools
//                   </li>
//                 </ol>
//               </nav>
//             </div>

//             <div className="product d-flex">
//               {/* Product Image Gallery */}
//               <div className="column-xs-12 col-lg-4">
//                 <div className="product-gallery">
//                   {/* Carousel for Product Images */}
//                   <div className="main-image-container">
//                     <img
//                       className="main-img"
//                       src={mainImage}
//                       alt={product.name}
//                     />
//                   </div>

//                   {/* Thumbnail List */}
//                   <ul className="image-list1">
//                     {selectedVariant && selectedVariant.images.length > 0 ? (
//                       selectedVariant.images.map((src, index) => (
//                         <li
//                           key={index}
//                           className={`image-item1 ${mainImage === src ? 'active-thumbnail' : ''}`}
//                           onClick={() => handleThumbnailClick(src)} // Set main image on click
//                         >
//                           <img
//                             src={src} // Use the correct image URL
//                             alt={`Thumbnail ${index + 1}`}
//                             className="thumbnail-img" // Optionally add styling class for thumbnail images
//                           />
//                         </li>
//                       ))
//                     ) : (
//                       product.images && product.images.map((src, index) => (
//                         <li
//                           key={index}
//                           className={`image-item1 ${mainImage === src ? 'active-thumbnail' : ''}`}
//                           onClick={() => handleThumbnailClick(src)} // Set main image on click
//                         >
//                           <img
//                             src={src} // Use the correct image URL
//                             alt={`Thumbnail ${index + 1}`}
//                             className="thumbnail-img" // Optionally add styling class for thumbnail images
//                           />
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 </div>
//               </div>
//               <div className="column-xs-12 col-lg-5 description">

//                 <h2>{product.name}</h2>
//                 {/* Add this inside the return statement where you want to render the dropdown */}
//                 {product.variants && product.variants.length > 0 && (
//                   <div className="form-group">
//                     <label htmlFor="variantSelect">{product.variants[0].variantType}</label>
//                     <select
//                       id="variantSelect"
//                       className="form-control"
//                       value={selectedVariant ? selectedVariant._id : ''}
//                       onChange={(e) => {
//                         const variant = product.variants.find(v => v._id === e.target.value);
//                         setSelectedVariant(variant);
//                         setMainImage(variant.images[0]); // Update main image
//                       }}
//                     >
//                       {product.variants.map((variant) => (
//                         <option key={variant._id} value={variant._id}>
//                           {variant.variantName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//                 <div className="description">
//                   <h1>{product._id}</h1>
//                   <p>
//                     <span style={{ color: "skyblue", fontSize: "22px" }}>96%</span>
//                     <span style={{ color: "grey", fontStyle: "italic" }}>
//                       of respondents would recommend this to a friend
//                     </span>
//                   </p>
//                   <div>
//                     <p
//                       style={{
//                         fontWeight: "500",
//                         borderBottom: "2px solid #2f4d2a",
//                         width: "23%",
//                         paddingBottom: "7px"
//                       }}
//                       className="pt-3">
//                       Features & Benefits:
//                     </p>

//                     {/* Display Key Features Dynamically */}
//                     <ul
//                       style={{
//                         color: "#333333",
//                         listStyleType: "none",
//                       }}>
//                       {product.keyPoints && product.keyPoints.length > 0 ? (
//                         product.keyPoints.map((feature, index) => (
//                           <li
//                             key={index}
//                             style={{
//                               margin: "0 0 10px",
//                               position: "relative",
//                               paddingLeft: "25px"
//                             }}>
//                             <span
//                               style={{
//                                 position: "absolute",
//                                 left: "0",
//                                 top: "50%",
//                                 transform: "translateY(-50%)",
//                                 width: "10px",
//                                 height: "10px",
//                                 borderRadius: "50%",
//                                 backgroundColor: "#2f4d2a",
//                                 display: "inline-block"
//                               }}>
//                             </span>
//                             {feature} {/* Render each feature */}
//                           </li>
//                         ))
//                       ) : (
//                         <li style={{ color: "red", fontStyle: "italic" }}>
//                           No key features available.
//                         </li>
//                       )}
//                     </ul>
//                   </div>

//                   <div>
//                     {/* Accoridian */}
//                   </div>
//                 </div>

//                 {/* <button className="add-to-cart">Add To Cart</button> */}
//               </div>
//               <div className="column-xs-12 col-lg-3" style={{ boxShadow: "10px 10px 40px #eeeeee", top: "20px", height: "fit-content", padding: "2rem", borderRadius: "10px" }}>
//                 <div className="">
//                   <p style={{ fontWeight: "bold" }}>Item #: {product.clocreProductId}</p>
//                 </div>

//                 <div className="">
//                   <span style={{ fontSize: "27px", fontWeight: "bold", color: "#2f4d2a" }}>
//                     INR {selectedVariant ? selectedVariant.price : product.price}
//                   </span>
//                 </div>

//                 <div className="">
//                   <div className="d-flex items-center w-100">
//                     <div className="rating-outer d-flex align-items-center">
//                       <div className="rating-inner1" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
//                     </div>

//                     <div className="d-flex align-items-center ml-2">
//                       {user ? (
//                         <button onClick={handleShow} id="review_btn" type="button" className="btn" data-toggle="modal" data-target="#ratingModal">
//                           <FontAwesomeIcon icon={faPen} />
//                         </button>
//                       ) : (
//                         <div className="" style={{ width: '50%' }}></div>
//                       )}
//                     </div>
//                   </div>

//                 </div>

//                 <div className="pt-2 pb-3">
//                   <div className="">
//                     <span style={{ fontWeight: "500", color: "#2f4d2a" }}>Stock :</span>
//                     <span style={{ color: "#2f4d2a" }}> {selectedVariant ? selectedVariant.stock : product.stock} </span><br />
//                     <button className="btn btn-outline-dark  m-2" onClick={decreaseQty}>-</button>
//                     <button className="btn btn-outline-dark  m-2" readOnly>{quantity}</button>
//                     <button className="btn btn-outline-dark  m-2" onClick={increaseQty}>+</button>
//                   </div>
//                 </div>

//                 <div className="pt-2 pb-2">
//                   <button className="btn btn-secondary text-white c2"
//                     onClick={handleAddToCart}>ADD TO CART</button>
//                 </div>

//                 <div className="pt-2 pb-2">
//                   <button className="btn btn-dark text-white c2">BUY NOW</button>
//                 </div>

//                 <div className="pt-2 ">
//                   <p style={{ fontStyle: "italic", fontSize: "15px", color: "#2f4d2a", fontWeight: "bold" }}>Fastest cross-border delivery</p>
//                 </div>

//                 <div className="pb-2">
//                   <span style={{ fontSize: "14px", color: "#2f4d2a", fontWeight: "bold" }}>Our Top Logistics Partners</span>
//                   <div className="mt-2">
//                     {/* <img src={partner1} className="img-fluid" />
//                                         <img src={partner2} className="img-fluid ms-2" /> */}
//                   </div>
//                 </div>

//               </div>
//             </div>
//             <Modal show={show} onHide={handleClose}>
//               <Modal.Header closeButton>
//                 <Modal.Title>Post Your valuable Reviews</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <ul className="stars">
//                   {[1, 2, 3, 4, 5].map(star => (
//                     <li
//                       value={star}
//                       key={star}
//                       onClick={() => setRating(star)}
//                       className={`star ${star <= rating ? 'orange' : ''}`}
//                       onMouseOver={(e) => e.target.classList.add('yellow')}
//                       onMouseOut={(e) => e.target.classList.remove('yellow')}
//                     >
//                       <i className="fa fa-star"></i>
//                     </li>
//                   ))}
//                 </ul>

//                 <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3"></textarea>
//                 <button disabled={loading} onClick={reviewHandler} aria-label="Close" className="my-3 float-right review-btn px-4 text-dark">Submit</button>
//               </Modal.Body>
//             </Modal>

//           </section>

//           <section className="container">
//             <h3 style={{ borderBottom: "3px solid #2f4d2a", width: "222px", paddingBottom: "10px", marginBottom: "30px" }}>Product Details</h3>
//             <div class="d-flex gap-3">
//               <div class="col-sm-6 mb-3 mb-sm-0">
//                 <div class="card" style={{ height: "250px", border: "2px solid #2f4d2a" }}>
//                   <div class="card-body">
//                     <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>&nbsp; Specifications</h5>
//                     <p class="card-text mt-3">Brand name : <b>{product.brand}</b></p>
//                     <p class="card-text">Efficiency (%) : 0.75</p>
//                     <p class="card-text">Country of Origin : India</p>
//                     <p class="card-text">Lifting Weight  :Single Hook-750Kg, Double Hook-1500Kg</p>
//                   </div>
//                 </div>
//               </div>
//               <div class="col-sm-6">
//                 <div class="card" style={{ height: "250px", border: "2px solid #2f4d2a" }}>
//                   <div class="card-body">
//                     <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>&nbsp; Description</h5>
//                     <p class="card-text mt-3">{product.description}</p>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="container mt-3 mb-5">
//             <div class="d-flex gap-3">
//               <div className="col-sm-6 mb-3 mb-sm-0">
//                 <div className="card" style={{ height: "450px", border: "2px solid #2f4d2a" }}>
//                   <div className="card-body">
//                     <h5 className="card-title" style={{ borderLeft: "6px solid #222" }}>&nbsp; Specifications</h5>
//                     <div
//                       style={{
//                         height: "50%", // Adjust height as needed
//                         overflowY: "auto",
//                         padding: "5px",
//                         borderRadius: "4px"
//                       }}>
//                       <table className="table">
//                         <tbody>
//                           {product.brand && product.brand !== "undefined" && (
//                             <tr>
//                               <th>Brand</th>
//                               <td>{product.brand}</td>
//                             </tr>
//                           )}
//                           {product.itemModelNum && product.itemModelNum !== "undefined" && (
//                             <tr>
//                               <th>Item Model Number</th>
//                               <td>{product.itemModelNum}</td>
//                             </tr>
//                           )}
//                           {product.serialNum && product.serialNum !== "undefined" && (
//                             <tr>
//                               <th>Serial Number</th>
//                               <td>{product.serialNum}</td>
//                             </tr>
//                           )}
//                           {product.connectionType && product.connectionType !== "undefined" && (
//                             <tr>
//                               <th>Connection Type</th>
//                               <td>{product.connectionType}</td>
//                             </tr>
//                           )}
//                           {product.hardwarePlatform && product.hardwarePlatform !== "undefined" && (
//                             <tr>
//                               <th>Hardware Platform</th>
//                               <td>{product.hardwarePlatform}</td>
//                             </tr>
//                           )}
//                           {product.os && product.os !== "undefined" && (
//                             <tr>
//                               <th>Operating System</th>
//                               <td>{product.os}</td>
//                             </tr>
//                           )}
//                           {product.powerConception && product.powerConception !== "undefined" && (
//                             <tr>
//                               <th>Power Conception</th>
//                               <td>{product.powerConception}</td>
//                             </tr>
//                           )}
//                           {product.batteries && product.batteries !== "undefined" && (
//                             <tr>
//                               <th>Batteries</th>
//                               <td>{product.batteries}</td>
//                             </tr>
//                           )}
//                           {product.packageDimension && product.packageDimension !== "undefined" && (
//                             <tr>
//                               <th>Package Dimension</th>
//                               <td>{product.packageDimension}</td>
//                             </tr>
//                           )}
//                           {product.portDescription && product.portDescription !== "undefined" && (
//                             <tr>
//                               <th>Port Description</th>
//                               <td>{product.portDescription}</td>
//                             </tr>
//                           )}
//                           {product.connectivityType && product.connectivityType !== "undefined" && (
//                             <tr>
//                               <th>Connectivity Type</th>
//                               <td>{product.connectivityType}</td>
//                             </tr>
//                           )}
//                           {product.compatibleDevices && product.compatibleDevices !== "undefined" && (
//                             <tr>
//                               <th>Compatible Devices</th>
//                               <td>{product.compatibleDevices}</td>
//                             </tr>
//                           )}
//                           {product.powerSource && product.powerSource !== "undefined" && (
//                             <tr>
//                               <th>Power Source</th>
//                               <td>{product.powerSource}</td>
//                             </tr>
//                           )}
//                           {product.specialFeatures && product.specialFeatures !== "undefined" && (
//                             <tr>
//                               <th>Special Features</th>
//                               <td>{product.specialFeatures}</td>
//                             </tr>
//                           )}
//                           {product.includedInThePackage && product.includedInThePackage !== "undefined" && (
//                             <tr>
//                               <th>Included In The Package</th>
//                               <td>{product.includedInThePackage}</td>
//                             </tr>
//                           )}
//                           {product.manufacturer && product.manufacturer !== "undefined" && (
//                             <tr>
//                               <th>Manufacturer</th>
//                               <td>{product.manufacturer}</td>
//                             </tr>
//                           )}
//                           {product.itemSize && product.itemSize !== "undefined" && (
//                             <tr>
//                               <th>Item Size</th>
//                               <td>{product.itemSize}</td>
//                             </tr>
//                           )}
//                           {product.itemWidth && product.itemWidth !== "undefined" && (
//                             <tr>
//                               <th>Item Width</th>
//                               <td>{product.itemWidth}</td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>

//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="col-sm-6">
//                 <div class="card" style={{ height: "450px", border: "2px solid #2f4d2a" }}>
//                   <div class="card-body">
//                     <h5 class="card-title" style={{ borderLeft: "6px solid #222" }}>&nbsp; Reviews</h5>
//                     <div
//                       style={{
//                         height: "80%", // Adjust height as needed
//                         overflowY: "auto",
//                         padding: "5px",
//                         borderRadius: "4px"
//                       }}>
//                       <p class="card-text mt-3">{product.reviews && product.reviews.length > 0 && <ProductReview reviews={product.reviews} />}</p>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//           {/* original */}
//           <div className="related-products">
//             <h2 className="related-products-title">Related Products</h2>
//             {relatedLoading ? (
//               <Loader />
//             ) : (
//               <Swiper
//                 modules={[Navigation, Pagination, Scrollbar]}
//                 navigation
//                 spaceBetween={20}
//                 slidesPerView={isMobile ? 1 : 4}
//               >
//                 {relatedProducts.map((relatedProduct) => (
//                   <SwiperSlide key={relatedProduct._id}>
//                     <Product product={relatedProduct} />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             )}
//           </div>

//         </Fragment>
//       }
//     </Fragment>
//   );
// }


import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { createReview, getProduct, getRelatedProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import { Modal } from 'react-bootstrap';
import { addCartItemToCart } from "../../actions/cartActions";
import { addCartItem, removeCartItem, updateCartItemQuantity } from "../../slices/cartSlice";
import { clearError, clearProduct, clearReviewSubmitted } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './ProductDetail.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Product from "./Product";
import { logEvent } from "../../actions/analyticsActions";
import Nav from "../layouts/nav";
export default function ProductDetail() {
  const { loading, product = {}, isReviewSubmitted, error } = useSelector((state) => state.productState);
  const { relatedProducts, loading: relatedLoading } = useSelector((state) => state.relatedProductsState);
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [mainMedia, setMainMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mainImage, setMainImage] = useState('');    // Set the first image as the default main image.
  // Add this state
  const [selectedVariant, setSelectedVariant] = useState(null);
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainImage(product.images[0].image); // Set the first image as the default main image
    }
  }, [product.images]);
  // Related Product
  useEffect(() => {
    if (!product._id || isReviewSubmitted) {
      dispatch(getProduct(id));
    }

    // Fetch related products when the main product is loaded
    if (product.maincategory) {
      dispatch(getRelatedProducts(product.maincategory));
    }
  }, [dispatch, id, isReviewSubmitted, product.maincategory]);
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainMedia(product.images[0]);
    }
  }, [product.images]);

  const getAvailableStock = () => {
    return selectedVariant ? selectedVariant.stock : product.stock;
  };

  const increaseQty = () => {
    const availableStock = getAvailableStock();
    if (availableStock === 0 || quantity >= availableStock) return;
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQty = () => {
    if (quantity === 1) return;
    setQuantity((prevQuantity) => prevQuantity - 1);
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
    if (quantity > (selectedVariant ? selectedVariant.stock : product.stock)) {
      toast.error("Quantity exceeds available stock");
      return;
    }
    const cartItem = {
      product: product._id,
      name: product.name,
      price: selectedVariant ? selectedVariant.price : product.price,
      image: selectedVariant ? selectedVariant.images[0] : product.images[0],
      stock: selectedVariant ? selectedVariant.stock : product.stock,
      quantity,
      tax: product.tax,
      variant: selectedVariant ? {
        _id: selectedVariant._id,
        variantType: selectedVariant.variantType,
        variantName: selectedVariant.variantName,
        price: selectedVariant.price,
        offPrice: selectedVariant.offPrice,
        stock: selectedVariant.stock,
        images: selectedVariant.images,
      } : null
    };

    if (user) {
      dispatch(addCartItemToCart(cartItem));
    } else {
      dispatch(addCartItem(cartItem)); // Update Redux state
      toast.success("Item added to cart successfully");
    }

  };
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].images[0]); // Set the first image of the first variant as the default main image
    } else if (product.images && product.images.length > 0) {
      setMainImage(product.images[0]); // Set the first image as the default main image
    }
  }, [product.variants, product.images]);
  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast("Review Submitted successfully", {
        type: "success",
        onOpen: () => dispatch(clearReviewSubmitted())
      });
    }

    if (error) {
      toast(error, {
        type: "error",
        onOpen: () => dispatch(clearError())
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({ event: 'page_view', pageUrl: window.location.pathname, timeSpent });
    };
  }, []);
 
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title={product.name} />
                    <Nav />
                    <div className="breadcrumbWrapper mb-2">
                        <div className="container-fluid">
                            <ul className="breadcrumb breadcrumb2 mb-0">
                                <li>
                                    <Link to={"/"}>Home</Link>
                                </li>
                                <li><Link to={"/"}>Product</Link></li>
                                <li>Access Control</li>
                            </ul>
                        </div>
                    </div>
                    <section className="Product-page-glc container-fluid">
 
                        {/* product details*/}
                        <div className="product row">
                            {/* Product Image Gallery */}
                            <div className="column-xs-12 col-lg-4">
                                <div className="product-gallery">
                                    {/* Carousel for Product Images */}
                                    <div className="main-image-container">
                                        <img
                                            className="prod-img-main-glc"
                                            src={mainImage}
                                            alt={product.name}
                                        />
                                    </div>
 
                                    {/* Thumbnail List */}
                                    <ul className="d-flex">
                                        {selectedVariant && selectedVariant.images.length > 0 ? (
                                            selectedVariant.images.map((src, index) => (
                                                <li
                                                    key={index}
                                                    className={`${mainImage === src ? 'active-thumbnail' : ''}`}
                                                    onClick={() => handleThumbnailClick(src)} // Set main image on click
                                                >
                                                    <img
                                                        src={src} // Use the correct image URL
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="prod-img-down-glc" // Optionally add styling class for thumbnail images
                                                    />
                                                </li>
                                            ))
                                        ) : (
                                            product.images && product.images.map((src, index) => (
                                                <li
                                                    key={index}
                                                    className={`${mainImage === src ? 'active-thumbnail' : ''}`}
                                                    onClick={() => handleThumbnailClick(src)} // Set main image on click
                                                >
                                                    <img
                                                        src={src} // Use the correct image URL
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="prod-img-down-glc" // Optionally add styling class for thumbnail images
                                                    />
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="column-xs-12 col-lg-5 description">
 
                                <h2>{product.name}</h2>
                                <hr />
                                {/* Add this inside the return statement where you want to render the dropdown */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="form-group">
                                        <label htmlFor="variantSelect">{product.variants[0].variantType}</label>
                                        <select
                                            id="variantSelect"
                                            className="form-control"
                                            value={selectedVariant ? selectedVariant._id : ''}
                                            onChange={(e) => {
                                                const variant = product.variants.find(v => v._id === e.target.value);
                                                setSelectedVariant(variant);
                                                setMainImage(variant.images[0]); // Update main image
                                            }}
                                        >
                                            {product.variants.map((variant) => (
                                                <option key={variant._id} value={variant._id}>
                                                    {variant.variantName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="description pt-2">
 
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <h1>{product._id}</h1>
                                        {product.brand && (
                                            <tr>
                                                <th style={{fontSize:"17px"}}>Brand :&nbsp;</th>
                                                <td style={{fontSize:"17px"}}> {product.brand}</td>
                                            </tr>
                                        )}
                                    </div>
 
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: "500",
                                                width: "100%",
                                            }}
                                            className="pt-2">
                                            Features & Benefits:
                                        </p>
                                        <hr />
 
                                        {/* Display Key Features Dynamically */}
                                        <ul style={{ paddingLeft: "20px" }}>
                                            {product.keyPoints && product.keyPoints.length > 0 ? (
                                                product.keyPoints.map((feature, index) => (
                                                    <li
                                                        key={index}
                                                        style={{
                                                            fontSize: "18px",
                                                            margin: "0 0 10px",
                                                            color: "#8c8c8c",
                                                            listStyleType: "disc",
                                                        }}
                                                    >
                                                        <p style={{ color: "#8c8c8c" }}></p>
                                                        {feature}
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ color: "#ffad63", fontStyle: "italic" }}>No key features available.</li>
                                            )}
                                        </ul>
 
                                    </div>
 
                                    <div>
                                        {/* Accoridian */}
                                    </div>
                                </div>
 
                                {/* <button className="add-to-cart">Add To Cart</button> */}
                            </div>
                            <div className="column-xs-12 col-lg-3 order-details-glc" style={{ boxShadow: "10px 10px 40px #eeeeee", top: "20px", height: "fit-content", padding: "2rem", borderRadius: "10px" }}>
                                <div className="">
                                    <p style={{ fontWeight: "bold" }}>Item #: {product.clocreProductId}</p>
                                </div>
 
                                <div className="">
                                    <span style={{ fontSize: "27px", fontWeight: "bold", color: "#2f4d2a" }}>
                                        INR {selectedVariant ? selectedVariant.price : product.price}
                                    </span>
                                </div>
 
                                <div className="">
                                    <div className="d-flex items-center w-100">
                                        <div className="rating-outer d-flex align-items-center">
                                            <div className="rating-inner1" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                        </div>
 
                                        <div className="d-flex align-items-center ml-2">
                                            {user ? (
                                                <button onClick={handleShow} id="review_btn" type="button" className="btn" data-toggle="modal" data-target="#ratingModal">
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                            ) : (
                                                <div className="" style={{ width: '50%' }}></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
 
                                <div className="pt-2 pb-3">
                                    <div className="">
                                        <span style={{ fontWeight: "500", color: "#2f4d2a" }}>Stock :</span>
                                        <span style={{ color: "#2f4d2a" }}> {selectedVariant ? selectedVariant.stock : product.stock} </span><br />
                                        <div className="d-flex align-items-center justify-content-center" style={{ width: "35%", backgroundColor: "none", color: "#fff", border: "1px solid #8c8c8c", outline: "none", borderRadius: "10px", marginTop: "10px      " }}>
                                            <button className="btn " onClick={decreaseQty}>-</button>
                                            <button className="btn " readOnly>{quantity}</button>
                                            <button className="btn " onClick={increaseQty}>+</button>
                                        </div>
                                    </div>
                                </div>
 
                                <div className="pt-2 pb-2">
                                    <button className="btn col-12"
                                        style={{ backgroundColor: "none", color: "#ffad63", border: "2px solid #ffad63", outline: "none" }}
                                        // disabled={product.stock === 0}
                                        onClick={handleAddToCart}>ADD TO CART</button>
                                </div>
 
                                <div className="pt-2 ">
                                    <p style={{ fontStyle: "italic", fontSize: "15px", color: "#2f4d2a", fontWeight: "bold" }}>Fastest cross-border delivery</p>
                                </div>
 
                            </div>
                        </div>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Post Your valuable Reviews</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <li
                                            value={star}
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`star ${star <= rating ? 'orange' : ''}`}
                                            onMouseOver={(e) => e.target.classList.add('yellow')}
                                            onMouseOut={(e) => e.target.classList.remove('yellow')}
                                        >
                                            <i className="fa fa-star"></i>
                                        </li>
                                    ))}
                                </ul>
 
                                <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3"></textarea>
                                <button disabled={loading} onClick={reviewHandler} aria-label="Close" className="my-3 float-right review-btn px-4 text-dark">Submit</button>
                            </Modal.Body>
                        </Modal>
 
                    </section>
 
 
                    {/* product details 1 */}
                    <section className="container-fluid">
                        <h3 className="hd" style={{ borderBottom: "2px solid #ffad63", width: "9.5%", paddingBottom: "10px", marginBottom: "30px", marginTop: "30px" }}>Product Details</h3>
                        <div class="row">
                            <div class="col-sm-6 mb-3 mb-sm-0">
                                <div class="card" style={{ height: "250px", border: "2px solidrgba(140, 140, 140, 0.49)" }}>
                                    <div class="card-body">
                                        <h5 class="card-title" style={{ borderLeft: "6px solid #ffad63" }}>&nbsp; Specifications</h5>
                                        <p class="card-text mt-3">Brand name : <b>{product.brand}</b></p>
                                        <p class="card-text">Efficiency (%) : 0.75</p>
                                        <p class="card-text">Country of Origin : India</p>
                                        <p class="card-text">Lifting Weight  :Single Hook-750Kg, Double Hook-1500Kg</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="card" style={{ height: "250px", border: "2px solidrgba(140, 140, 140, 0.49)" }}>
                                    <div class="card-body">
                                        <h5 class="card-title" style={{ borderLeft: "6px solid #ffad63" }}>&nbsp; Description</h5>
                                        <p class="card-text mt-3">{product.description}</p>
 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
 
                    {/* product details 2 */}
                    <section className="container-fluid mt-3 mb-5">
                        <div class="row">
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card" style={{ height: "450px", border: "2px solidrgba(140, 140, 140, 0.49)" }}>
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ borderLeft: "6px solid #ffad63" }}>&nbsp; Additional Information</h5>
                                        <div
                                            style={{
                                                height: "90%", // Adjust height as needed
                                                overflowY: "auto",
                                                marginTop: "12px",
                                                padding: "5px",
                                                borderRadius: "4px",
                                                fontSize: "16px"
                                            }}>
                                            <table className="table">
                                                <tbody>
                                                    {product.brand && (
                                                        <tr>
                                                            <th>Brand</th>
                                                            <td>{product.brand}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemModelNum && (
                                                        <tr>
                                                            <th>Item Model Number</th>
                                                            <td>{product.itemModelNum}</td>
                                                        </tr>
                                                    )}
                                                    {product.serialNum && (
                                                        <tr>
                                                            <th>Serial Number</th>
                                                            <td>{product.serialNum}</td>
                                                        </tr>
                                                    )}
                                                    {product.connectionType && (
                                                        <tr>
                                                            <th>Connection Type</th>
                                                            <td>{product.connectionType}</td>
                                                        </tr>
                                                    )}
                                                    {product.hardwarePlatform && (
                                                        <tr>
                                                            <th>Hardware Platform</th>
                                                            <td>{product.hardwarePlatform}</td>
                                                        </tr>
                                                    )}
                                                    {product.os && (
                                                        <tr>
                                                            <th>Operating System</th>
                                                            <td>{product.os}</td>
                                                        </tr>
                                                    )}
                                                    {product.powerConception && (
                                                        <tr>
                                                            <th>Power Conception</th>
                                                            <td>{product.powerConception}</td>
                                                        </tr>
                                                    )}
                                                    {product.batteries && (
                                                        <tr>
                                                            <th>Batteries</th>
                                                            <td>{product.batteries}</td>
                                                        </tr>
                                                    )}
                                                    {product.packageDimension && (
                                                        <tr>
                                                            <th>Package Dimension</th>
                                                            <td>{product.packageDimension}</td>
                                                        </tr>
                                                    )}
                                                    {product.portDescription && (
                                                        <tr>
                                                            <th>Port Description</th>
                                                            <td>{product.portDescription}</td>
                                                        </tr>
                                                    )}
                                                    {product.connectivityType && (
                                                        <tr>
                                                            <th>Connectivity Type</th>
                                                            <td>{product.connectivityType}</td>
                                                        </tr>
                                                    )}
                                                    {product.compatibleDevices && (
                                                        <tr>
                                                            <th>Compatible Devices</th>
                                                            <td>{product.compatibleDevices}</td>
                                                        </tr>
                                                    )}
                                                    {product.powerSource && (
                                                        <tr>
                                                            <th>Power Source</th>
                                                            <td>{product.powerSource}</td>
                                                        </tr>
                                                    )}
                                                    {product.specialFeatures && (
                                                        <tr>
                                                            <th>Special Features</th>
                                                            <td>{product.specialFeatures}</td>
                                                        </tr>
                                                    )}
                                                    {product.includedInThePackage && (
                                                        <tr>
                                                            <th>Included In The Package</th>
                                                            <td>{product.includedInThePackage}</td>
                                                        </tr>
                                                    )}
                                                    {product.manufacturer && (
                                                        <tr>
                                                            <th>Manufacturer</th>
                                                            <td>{product.manufacturer}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemSize && (
                                                        <tr>
                                                            <th>Item Size</th>
                                                            <td>{product.itemSize}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemWidth && (
                                                        <tr>
                                                            <th>Item Width</th>
                                                            <td>{product.itemWidth}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
 
                            <div class="col-sm-6">
                                <div class="card" style={{ height: "450px", border: "2px solidrgba(140, 140, 140, 0.49)" }}>
                                    <div class="card-body">
                                        <h5 class="card-title" style={{ borderLeft: "6px solid #ffad63" }}>&nbsp; Reviews</h5>
                                        <div
                                            style={{
                                                height: "80%", // Adjust height as needed
                                                overflowY: "auto",
                                                padding: "5px",
                                                borderRadius: "4px"
                                            }}>
                                            <p class="card-text mt-3">{product.reviews && product.reviews.length > 0 && <ProductReview reviews={product.reviews} />}</p>
                                        </div>
 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* original */}
                    <div className="related-products container-fluid">
                        <h2 className="related-products-title">Related Products</h2>
                        {relatedLoading ? (
                            <Loader />
                        ) : (
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar]}
                                navigation
                                spaceBetween={20}
                                slidesPerView={isMobile ? 1 : 4}
                            >
                                {relatedProducts.map((relatedProduct) => (
                                    <SwiperSlide key={relatedProduct._id}>
                                        <Product product={relatedProduct} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </>
            }
        </>
    );
}