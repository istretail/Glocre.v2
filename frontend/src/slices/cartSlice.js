import { createSlice } from "@reduxjs/toolkit";

// Safe JSON parse function
const safeParseJSON = (key, fallbackValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch (error) {
    console.warn(`Error parsing ${key}:`, error);
    return fallbackValue;
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: safeParseJSON('cartItems', []),
    loading: false,
    shippingInfo: safeParseJSON('shippingInfo', {}),
    billingInfo: safeParseJSON('billingInfo', {})
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
    getCartItemsRequest(state) {
      state.loading = true;
    },
    getCartItemsSuccess(state, action) {
      state.items = action.payload;
      state.loading = false;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    getCartItemsFail(state) {
      state.loading = false;
    },
    addCartItem(state, action) {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item =>
        item.product === newItem.product &&
        (!newItem.variant || (item.variant && item.variant._id === newItem.variant._id))
      );
      if (existingItemIndex !== -1) {
        const updatedQuantity = state.items[existingItemIndex].quantity + newItem.quantity;
        if (updatedQuantity > newItem.stock) {
          state.items[existingItemIndex].quantity = newItem.stock;
        } else {
          state.items[existingItemIndex].quantity = updatedQuantity;
        }
      } else {
        state.items.push(newItem);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    removeCartItem(state, action) {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(item => {
        const isSameProduct = item.product === productId;
        const isSameVariant =
          (!variantId && !item.variant) || // No variant case
          (variantId && item.variant && item.variant._id === variantId); // Variant match

        // Only remove if both match
        return !(isSameProduct && isSameVariant);
      });

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    updateCartItemQuantity(state, action) {
      const { productId, quantity, stock, variantId } = action.payload;
      const cartItemIndex = state.items.findIndex(item =>
        item.product === productId &&
        (!variantId || (item.variant && item.variant._id === variantId))
      );
      if (cartItemIndex !== -1) {
        const updatedCartItem = { ...state.items[cartItemIndex], quantity };
        if (typeof stock !== 'undefined') {
          updatedCartItem.stock = stock;
        }
        state.items[cartItemIndex] = updatedCartItem;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    saveShippingInfo(state, action) {
      localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
      state.shippingInfo = action.payload;
    },
    saveBillingInfo(state, action) {
      localStorage.setItem('billingInfo', JSON.stringify(action.payload));
      state.billingInfo = action.payload;
    },
    orderCompleted(state) {
      localStorage.removeItem('shippingInfo');
      localStorage.removeItem('billingInfo');
      localStorage.removeItem('cartItems');
      sessionStorage.removeItem('orderInfo');
      state.items = [];
      state.shippingInfo = {};
      state.billingInfo = {};
    }
  }
});
const { actions, reducer } = cartSlice;
export const {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  getCartItemsRequest,
  getCartItemsSuccess,
  getCartItemsFail,
  saveShippingInfo,
  saveBillingInfo,
  orderCompleted
} = actions;

export default reducer;