import React, { useState, useEffect } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faBolt,
  faEye,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductDetail.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addCartItemToCart } from "../../actions/cartActions";
import { addCartItem } from "../../slices/cartSlice";
import { toast } from "react-toastify";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
const ProductModal = ({ show, handleClose, product }) => {
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainMedia, setMainMedia] = useState(null);

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainMedia(product.images[0]);
    }
  }, [product.images]);
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
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
        image: product.images[0].image,
        stock: product.stock,
        quantity,
      };
      dispatch(addCartItem(cartItem));
      toast.success("Item added to cart successfully");
    }
  };

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
  const openProductDetailPage = () => {
    window.open(`/products/${product._id}`, "_blank");
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      closebutton
      className="product-model"
    >
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="product-detail-modal1">
          <div className="additional-images-container1">
            {product.images &&
              product.images.length > 0 &&
              product.images.map((media, index) => (
                <div
                  className="additional-image1 mt-4"
                  key={media._id}
                  onMouseEnter={() => setMainMedia(media)}
                >
                  {media.mediaType === "image" ? (
                    <img
                      src={media.url}
                      alt={product.title}
                      height="100"
                      width="100"
                    />
                  ) : (
                    <video
                      className="additional-image1"
                      src={media.url}
                      height="100"
                      width="100"
                    />
                  )}
                </div>
              ))}
          </div>
          <div
            className="col-5 col-lg-5 img-fluid main-image-container-model"
            id="product_image"
          >
            {mainMedia &&
              (mainMedia.mediaType === "image" ? (
                <img
                  className="main-media"
                  src={mainMedia.url}
                  alt={product.title}
                  height="300"
                  width="300"
                />
              ) : (
                <video
                  className="main-media"
                  src={mainMedia.url}
                  alt={product.title}
                  height="300"
                  width="300"
                  autoPlay
                  loop
                />
              ))}
          </div>
          <div className="list-text text-center mt-3">
            <p style={{ fontSize: "1rem" }}>
              <FontAwesomeIcon icon={faTowerBroadcast} className="me-2" /> Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <p style={{ fontSize: "1rem" }}>
              <FontAwesomeIcon icon={faTowerBroadcast} className="me-2" /> Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <p style={{ fontSize: "1rem" }}>
              <FontAwesomeIcon icon={faTowerBroadcast} className="me-2" /> Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
        </div>
        <div className="product-info1">
          <p>{product.description}</p>
          <div className="quantity-control d-flex justify-content-between">
            <p style={{ fontSize: "1.3rem" }}>
              <FontAwesomeIcon icon={faTowerBroadcast} className="me-2" /> ₹
              {product.price}/-
            </p>
            <Link onClick={openProductDetailPage}>
              <Button type="button" id="cart_btn" className="btn btn-primary">
                Viwe More info
              </Button>
            </Link>
            <div className="stockCounter d-inline">
              <span
                className="btn minus"
                onClick={decreaseQty}
                style={{ fontSize: "1.5rem" }}
              >
                -
              </span>
              <input
                type="number"
                className="form-control count d-inline"
                value={quantity}
                readOnly
              />
              <span
                className="btn  plus"
                onClick={increaseQty}
                style={{ fontSize: "1.5rem" }}
              >
                +
              </span>
            </div>
            <Button
              type="button"
              id="cart_btn"
              className="btn btn-primary d-inline ml-4"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
