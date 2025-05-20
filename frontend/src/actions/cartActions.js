import axios from "axios";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  getCartItemsRequest,
  getCartItemsSuccess,
  getCartItemsFail,
} from "../slices/cartSlice";
import { toast } from "react-toastify";

export const addCartItemToCart = (cartItem) => async (dispatch) => {
  try {
    await axios.post("/api/v1/cart/add", cartItem);
    dispatch(addCartItem(cartItem));
    toast.success("Item added to cart successfully");
  } catch (error) {
    toast.error(error.response.data.message );
  }
};

export const removeCartItemFromCart =
  (productId, variantId) => async (dispatch) => {
    try {
      await axios.delete(`/api/v1/cart/remove`, {
        data: { productId, variantId },
      });
      dispatch(removeCartItem({ productId, variantId }));
    } catch (error) {
      // Handle error
      console.error("Error removing item from cart:", error);
    }
  };

export const updateCartItemQuantityInCart = (productId, quantity, stock, variantId) => async (dispatch) => {
  try {
    await axios.put(`/api/v1/cart/update`, {
      productId,
      quantity,
      variantId, // send only if present
    });

    dispatch(
      updateCartItemQuantity({
        productId,
        quantity,
        stock,
        variantId,
      })
    );
  } catch (error) {
    console.error("Error updating cart quantity:", error.response?.data || error.message);
    // Optionally show toast or dispatch failure action
  }
};
  

export const getCartItemsFromCart = () => async (dispatch) => {
  try {
    dispatch(getCartItemsRequest());
    const { data } = await axios.get("/api/v1/cart");
    dispatch(getCartItemsSuccess(data.cart));
  } catch (error) {
    dispatch(getCartItemsFail());
  }
};

export const clearCart = () => async (dispatch) => {
  try {
    await axios.delete(`/api/v1/cart/clear`);
  } catch (error) {
    // Handle error
  }
};
