import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addCartItemToCart } from "../../actions/cartActions";
import { addCartItem } from "../../slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../actions/userActions";
import { logEvent } from "../../actions/analyticsActions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Product({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authState);
  const { wishlist } = useSelector((state) => state.wishlistState);
  const [quantity, setQuantity] = useState(1);

  const isInWishlist = wishlist?.some(
    (item) => item?._id === product?._id
  );

  // console.log("WishList", wishlist);
  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to use the Wishlist feature");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(product._id));
      toast.success("Added to Wishlist");
    }
  };

  const openProductDetailPage = () => {
    window.location.href = `/products/${product._id}`;
  };

  return (
    <div className="product-card" onClick={openProductDetailPage}>
      <div className="product-tilt-effect">
        <div className="heart-top-right">
          <a onClick={handleWishlistToggle} style={{ cursor: "pointer" }}>
            <FontAwesomeIcon
              icon={faHeart}
              style={{ color: isInWishlist ? "red" : "#ffad63" }}
            />
          </a>
        </div>
        <div className="product-image">
          <img
            src={
              product?.images?.[0] ||
              product?.variants?.[0]?.images?.[0] ||
              product?.variants?.[1]?.images?.[0] ||
              "/images/default.jpg"
            }
            alt={product.name}
          />
        </div>
      </div>
      <div className="product-info">
        <div className="product-meta mb-1">
          <div className="product-stock">In Stock</div>

        </div>
        <div className="product-category">
          {(() => {
            const words = product.category?.split(" ") || [];
            if (words.length > 2) {
              return `${words.slice(0, 2).join(" ")}...`;
            }
            return product.category;
          })()}
        </div>
        <h2 className="product-title">
          {(() => {
            const maxLength = 40;
            return product.name.length > maxLength
              ? `${product.name.slice(0, maxLength)}...`
              : product.name;
          })()}

        </h2>

        <div className="product-features">
          <span className="feature">By {product.brand}</span>
        </div>
        <div className="product-bottom">
          <div className="price-row">
            <span className="price-now">
              ₹
              {product?.offPrice ||
                product?.variants?.[0]?.offPrice ||
                product?.variants?.[1]?.offPrice ||
                0}
              .00/-
            </span>
            <span className="price-was">
              ₹
              {product?.price ||
                product?.variants?.[0]?.price ||
                product?.variants?.[1]?.price ||
                0}
              .00/-
            </span>

          </div>
        </div>

        <button className="product-button">
          <svg
            className="button-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="button-text">View More</span>
        </button>
      </div>
    </div>
  );
}
