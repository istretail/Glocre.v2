import { createSlice } from "@reduxjs/toolkit";

const relatedProductsSlice = createSlice({
  name: "relatedProducts",
  initialState: {
    loading: false,
    relatedProducts: [],
    productsCount: 0,
    subcategoryCount: 0,
    resPerPage: 0,
    error: null,
  },
  reducers: {
    relatedProductsRequest(state) {
      state.loading = true;
    },
    relatedProductsSuccess(state, action) {
      state.loading = false;
      state.relatedProducts = action.payload.products; // Aligning with initialState
      state.productsCount = action.payload.count || 0;
      state.subcategoryCount = action.payload.subcategoryCounts || 0;
      state.resPerPage = action.payload.resPerPage || 0;
    },
    relatedProductsFail(state, action) {
      state.loading = false;
      state.error = action.payload; // Keep other state fields intact
    },
    clearError(state) {
      state.error = null;
    },
  },
});

const { actions, reducer } = relatedProductsSlice;

export const {
  relatedProductsRequest,
  relatedProductsSuccess,
  relatedProductsFail,
  clearError,
} = actions;

export default reducer;
