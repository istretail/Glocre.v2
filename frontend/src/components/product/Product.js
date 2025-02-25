import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addCartItemToCart } from "../../actions/cartActions";
import { addCartItem } from "../../slices/cartSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import "./ProductDetail.css";
import { addToWishlist, removeFromWishlist } from "../../actions/userActions"; // Update as per your Redux actions
import { logEvent } from "../../actions/analyticsActions";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Product({ product }) {
  const { user } = useSelector((state) => state.authState);
  const { wishlist } = useSelector((state) => state.wishlistState); // Access wishlist from Redux store
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if the product is already in the wishlist
    if (wishlist && wishlist.some((item) => item._id === product._id)) {
      setIsInWishlist(true);
    }
  }, [wishlist, product._id]);

  const handleAddToCart = (event) => {
    event.stopPropagation(); // Prevents the event from bubbling up to the card's onClick handler
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
    logEvent({ event: "add_to_cart", productId: product._id });
  };

  const handleWishlistToggle = (event) => {
    event.stopPropagation(); // Prevents event from triggering the product detail page
    setIsWishlisted(!isWishlisted);

    if (!user) {
      toast.error("Please log in to use the Wishlist feature");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      setIsInWishlist(false);
      toast.success("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(product._id));
      setIsInWishlist(true);
      toast.success("Added to Wishlist");
    }
  };

  const [isWishlisted, setIsWishlisted] = useState(false);
const openProductDetailPage = () => {
  window.location.href = `/products/${product._id}`;
};


  return (
    <>
      <div className="productGrid">
        <div className=" mb-4">
          <div className=" pb-0 pt-2">
            <div className="productThumb" onClick={openProductDetailPage}>
              <div className="imgWrapper">
                <div className="wrapper mb-3">
                  <img
                    src={
                      product?.images?.[0] ||
                      product?.variants?.[0]?.images?.[0] ||
                      product?.variants?.[1]?.images?.[0] ||
                      "/images/default.jpg"
                    }
                    className="w-100"
                    alt={product.name}
                  />
                </div>
                <div className="overlay transition"></div>
                <ul className="actions list-inline mb-0">
                  <li className="list-inline-item">
                    <a
                      className=""
                      onClick={handleWishlistToggle}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ color: isWishlisted ? "red" : "#ffad63" }} // Change color based on state
                      />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a>VIEW MORE</a>
                  </li>
                </ul>
              </div>

              <div className="info">
                <span className="d-block catName">
                  <b>{product.category}</b>
                </span>
                <h6 className="title mb-3">
                  <b>{product.name}</b>
                </h6>

                <span className="brand d-block text-g">
                  {/* By <Link className="text-g" onClick={(e) => e.stopPropagation()}>{product._id}</Link> */}
                  By <Link className="text-g">{product.brand}</Link>
                </span>

                <div className="d-flex align-items-center mt-3 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="price text-g font-weight-bold">
                      ₹{product.offPrice}.00/-
                    </span>
                    <span className="oldPrice ml-2">₹{product.price}.00/-</span>
                  </div>
                </div>
                <button
                  type="button"
                  id="cart_btn1"
                  className="btn pro-btn"
                  style={{
                    backgroundColor: "#2f4d2a",
                    fontWeight: "bolder",
                    textTransform: "uppercase",
                  }}
                  disabled={product.stock === 0}
                  onClick={openProductDetailPage}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
