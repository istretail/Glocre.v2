import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { createReview, getProduct, getRelatedProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import { Modal } from 'react-bootstrap';
import { addCartItemToCart } from "../../actions/cartActions";
import { addCartItem, } from "../../slices/cartSlice";
import { clearError, clearProduct, clearReviewSubmitted } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, } from 'swiper/modules';
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
// console.log(user)
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
    const [reviewError, setError] = useState("");

    const reviewHandler = () => {
        if (!rating) {
            setError("Please select a rating.");
            return;
        }

        if (!comment.trim()) {
            setError("Please enter a comment.");
            return;
        }

        setError(""); // Clear error if validation passes

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

        const variantLabel = selectedVariant ? ` (${selectedVariant.variantName})` : "";
        const cartItem = {
            product: product._id,
            name: product.name + variantLabel, // ← append variant name if exists
            price: selectedVariant ? selectedVariant.offPrice : product.offPrice,
            image: selectedVariant ? selectedVariant.images[0] : product.images[0],
            stock: selectedVariant ? selectedVariant.stock : product.stock,
            quantity,
            tax: product.tax,
            shippingCostlol: product.shippingCostlol,
            shippingCostNorth: product.shippingCostNorth,
            shippingCostEast: product.shippingCostEast,
            shippingCostWest: product.shippingCostWest,
            shippingCostSouth: product.shippingCostSouth,
            shippingCostCentral: product.shippingCostCentral,
            shippingCostNe: product.shippingCostNe,
            additionalShippingCost: product.additionalShippingCost,
            createdBy: product.createdBy,
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
            dispatch(addCartItem(cartItem));
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

    useEffect(() => {
        setQuantity(1);
    }, [selectedVariant]);
    
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
                                        <div className="custom-select-wrapper">
                                            <select
                                                id="variantSelect"
                                                className="form-control custom-select"
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
                                    </div>
                                )}
                                <div className="description pt-2">

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                        {product.brand && (
                                            <tr>
                                                <th style={{ fontSize: "17px" }}>Brand :&nbsp;</th>
                                                <td style={{ fontSize: "17px" }}> {product.brand}</td>
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

                                <div className="d-flex align-items-center w-100">
                                    <span className="price text-g font-weight-bold" style={{ fontSize: "25px" }}>
                                        {/* ₹{product?.offPrice || product?.variants?.[0]?.offPrice || product?.variants?.[1]?.offPrice || 0}.00/- */}
                                        ₹{selectedVariant ? selectedVariant?.offPrice : product?.offPrice || 0}.00/-
                                    </span>
                                    <span className="oldPrice ml-2">
                                        {/* ₹{product?.price || product?.variants?.[0]?.price || product?.variants?.[1]?.price || 0}.00/- */}
                                        ₹{selectedVariant ? selectedVariant?.price : product?.price || 0}.00/-
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
                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "60%",
                                                border: "1px solid #8c8c8c",
                                                borderRadius: "10px",
                                                marginTop: "10px",
                                                padding: "5px",
                                            }}
                                        >
                                            <button className="btn btn-outline-dark" onClick={decreaseQty}>-</button>

                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value >= 1) {
                                                        setQuantity(value);
                                                    }
                                                }}
                                                min="1"
                                                className="form-control text-center mx-2"
                                                style={{
                                                    width: "80px",
                                                    backgroundColor: "transparent",
                                                    color: "#000",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px"
                                                }}
                                                onKeyDown={(e) => {
                                                    // Prevent typing "-" or "e" (for exponential input)
                                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />


                                            <button className="btn btn-outline-dark" onClick={increaseQty}>+</button>
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

                                <textarea
                                    onChange={(e) => setComment(e.target.value)}
                                    name="review"
                                    id="review"
                                    className="form-control mt-3"
                                ></textarea>

                                {reviewError && <div className="text-danger mt-2">{reviewError}</div>}

                                <button
                                    disabled={loading}
                                    onClick={reviewHandler}
                                    aria-label="Close"
                                    className="my-3 float-right review-btn px-4 text-dark"
                                >
                                    Submit
                                </button>
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
                                        <p class="card-text">Product Condition : <b>{product.condition}</b></p>
                                        <p class="card-text">Country of Origin : <b>{product.countryofOrgin}</b></p>
                                        <p className="card-text">
                                            This Product is Returnable? : <b>{product.isRefundable ? 'Yes' : 'No'}</b>
                                        </p>

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

                                                    {product.fssai && product.fssai !=="undefined" &&(
                                                        <tr>
                                                            <th>FSSAI</th>
                                                            <td>{product.fssai}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemModelNum && (
                                                        <tr>
                                                            <th>Item Model Number</th>
                                                            <td>{product.itemModelNum}</td>
                                                        </tr>
                                                    )}
                                                    {product.sku && (
                                                        <tr>
                                                            <th>SKU</th>
                                                            <td>{product.sku}</td>
                                                        </tr>
                                                    )}
                                                    {product.upc && (
                                                        <tr>
                                                            <th>UPC</th>
                                                            <td>{product.upc}</td>
                                                        </tr>
                                                    )}
                                                    {product.hsn && (
                                                        <tr>
                                                            <th>HSN</th>
                                                            <td>{product.hsn}</td>
                                                        </tr>
                                                    )}
                                                    {product.manufactureDetails && (
                                                        <tr>
                                                            <th>Manufacture Details</th>
                                                            <td>{product.manufactureDetails}</td>
                                                        </tr>
                                                    )}
                                                    {product.productCertifications && (
                                                        <tr>
                                                            <th>Product Certifications</th>
                                                            <td>{product.productCertifications}</td>
                                                        </tr>
                                                    )}
                                                    {product.manufacturer && (
                                                        <tr>
                                                            <th>Manufacturer</th>
                                                            <td>{product.manufacturer}</td>
                                                        </tr>
                                                    )}
                                                    {product.unit && (
                                                        <tr>
                                                            <th>Unit</th>
                                                            <td>{product.unit}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemLength && (
                                                        <tr>
                                                            <th>Item Length</th>
                                                            <td>{product.itemLength}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemHeight && (
                                                        <tr>
                                                            <th>Item Height</th>
                                                            <td>{product.itemHeight}</td>
                                                        </tr>
                                                    )}
                                                    {product.itemWeight && (
                                                        <tr>
                                                            <th>Item Weight</th>
                                                            <td>{product.itemWeight}</td>
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