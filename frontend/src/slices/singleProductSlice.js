import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: {},
    isReviewSubmitted: false,
    isProductCreated: false,
    isProductDeleted: false,
    isProductUpdated: false,
    isReviewDeleted: false,
    reviews: [],
  },
  reducers: {
    productRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    productSuccess(state, action) {
      return {
        loading: false,
        product: action.payload.product,
      };
    },
    productFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    createReviewRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createReviewSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isReviewSubmitted: true,
      };
    },
    createReviewFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearReviewSubmitted(state, action) {
      return {
        ...state,
        isReviewSubmitted: false,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    clearProduct(state, action) {
      return {
        ...state,
        product: {},
      };
    },
    newProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    newproductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductCreated: true,
      };
    },
    newProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isProductCreated: false,
      };
    },
    clearProductCreated(state, action) {
      return {
        ...state,
        isProductCreated: false,
      };
    },
    deleteProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteproductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isProductDeleted: true,
      };
    },
    deleteProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearProductDeleted(state, action) {
      return {
        ...state,
        isProductDeleted: false,
      };
    },
    updateProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductUpdated: true,
      };
    },
    updateProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearProductUpdated(state, action) {
      return {
        ...state,
        isProductUpdated: false,
      };
    },
    reviewsRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    reviewsSuccess(state, action) {
      return {
        loading: false,
        reviews: action.payload.reviews,
      };
    },
    reviewsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    deleteReviewRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteReviewSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isReviewDeleted: true,
      };
    },
    deleteReviewFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearReviewDeleted(state, action) {
      return {
        ...state,
        isReviewDeleted: false,
      };
    },
    sellerProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    sellerProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        sellerProductCount: action.payload.count,
        products: action.payload.products,
      };
    },
    sellerProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    createSellerProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createSellerProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.productData,
        isProductCreated: true,
      };
    },
    createSellerProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isProductCreated: false,
      };
    },
    updateSellerProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateSellerProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductUpdated: true,
      };
    },
    updateSellerProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getSellerSingleProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getSellerSingleProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
      };
    },
    getSellerSingleProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    cloneProductRequest(state, action) {
      return {
        ...state,
        loading: true,
      }
    },
    cloneProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isProductCreated: true
      }
    },
    cloneProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    clearProductCloned(state, action) {
      return {
        ...state,
        isProductCreated: false
      }
    },
    addArchiveProductRequest(state, action) {
      return {
        ...state,
        loading: true
      }
    },
    addArchiveProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isProductUpdated: true,
        message: action.payload,

      }
    },
    addArchiveProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    removeArchiveProductRequest(state, action) {
      return {
        ...state,
        loading: true
      }
    },
    removeArciveProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isProductUpdated: true,
        message: action.payload
      }
    },
    removeArchiveProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    clearProductArchive(state, action) {
      return {
        ...state,
        isProductUpdated: false
      }
    },
  },
});

const { actions, reducer } = productSlice;

export const {
  productRequest,
  productSuccess,
  productFail,
  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  clearError,
  clearReviewSubmitted,
  clearProduct,
  adminProductsFail,
  adminProductsRequest,
  adminProductsSuccess,
  newProductRequest,
  newproductSuccess,
  newProductFail,
  clearProductCreated,
  deleteProductFail,
  deleteProductRequest,
  deleteproductSuccess,
  clearProductDeleted,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  clearProductUpdated,
  reviewsRequest,
  reviewsSuccess,
  reviewsFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFail,
  clearReviewDeleted,
  sellerProductRequest,
  sellerProductSuccess,
  sellerProductFail,
  createSellerProductRequest,
  createSellerProductSuccess,
  createSellerProductFail,
  updateSellerProductRequest,
  updateSellerProductSuccess,
  updateSellerProductFail,
  getSellerSingleProductRequest,
  getSellerSingleProductSuccess,
  getSellerSingleProductFail,
  cloneProductRequest,
  cloneProductSuccess,
  cloneProductFail,
  clearProductCloned,
  addArchiveProductRequest,
  addArchiveProductSuccess,
  addArchiveProductFail,
  removeArchiveProductRequest,
  removeArciveProductSuccess,
  removeArchiveProductFail,
  clearProductArchive,
} = actions;

export default reducer;
