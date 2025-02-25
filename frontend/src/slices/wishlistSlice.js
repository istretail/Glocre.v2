import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    addWishlistRequest: (state) => {
      state.loading = true;
    },
    addWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    },
    addWishlistFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeWishlistRequest: (state) => {
      state.loading = true;
    },
    removeWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlist = action.payload; // Expecting full product details here
    },
    removeWishlistFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getWishlistRequest: (state) => {
      state.loading = true;
    },
    getWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    },
    getWishlistFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const { actions, reducer } = wishlistSlice;
export const {
  addWishlistRequest,
  addWishlistSuccess,
  addWishlistFail,
  removeWishlistRequest,
  removeWishlistSuccess,
  removeWishlistFail,
  getWishlistRequest,
  getWishlistSuccess,
  getWishlistFail,
} = actions;

export default reducer;
