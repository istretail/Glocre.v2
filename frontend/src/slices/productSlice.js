import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    isProductUpdated: false,
    categories: [],
  },
  reducers: {
    productsRequest(state, action) {
      return {
        loading: true,
      };
    },
    productsSuccess(state, action) {
      return {
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.totalProductsCount,
        resPerPage: action.payload.resPerPage,
      };
    },
    productsFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    relatedProductsRequest(state, action) {
      return {
        loading: true,
      };
    },
    relatedProductsSuccess(state, action) {
      return {
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.count,
        subcategoryCount: action.payload.subcategoryCounts,
        resPerPage: action.payload.resPerPage,
      };
    },
    relatedProductsFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    adminProductsRequest(state, action) {
      return {
        loading: true,
      };
    },
    adminProductsSuccess(state, action) {
      return {
        loading: false,
        products: action.payload.products,
        resPerPage: action.payload.resPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
        totalProductsCount: action.payload.totalProductsCount,
        
      };
    },
    adminProductsFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    getCategoriesRequest(state, action) {
      return {
        loading: true,
      };
    },
    getCategoriesSuccess(state, action) {
      return {
        loading: false,
        ...state,
        categories: action.payload
      };
    },
    getCategoriesFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    getArchiveProductsRequest(state, action) {
      return {
        ...state,
        loading: true,

      }
    },
    getArchiveProductsScuccess(state, action) {
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.totalProductsCount,
        resperPage: action.payload.resperPage
      }
    },
    getArchiveProductsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
  },
});

const { actions, reducer } = productsSlice;

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  adminProductsFail,
  adminProductsRequest,
  adminProductsSuccess,
  getCategoriesSuccess,
  getCategoriesRequest,
  getCategoriesFail,
  getArchiveProductsRequest,
  getArchiveProductsScuccess,
  getArchiveProductsFail,
} = actions;

export default reducer;
