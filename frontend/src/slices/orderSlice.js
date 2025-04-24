import { createSlice } from "@reduxjs/toolkit";
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderDetail: {},
    userOrders: [],
    adminOrders: [],
    cost: [],
    loading: false,
    isOrderDeleted: false,
    isOrderUpdated: false,
  },
  reducers: {
    createOrderRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createOrderSuccess(state, action) {
      return {
        ...state,
        loading: false,
        orderDetail: action.payload.order,
      };
    },
    createOrderFail(state, action) {
      return {
        ...state,
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
    userOrdersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    userOrdersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        userOrders: action.payload.orders,
      };
    },
    userOrdersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    orderDetailRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    orderDetailSuccess(state, action) {
      return {
        ...state,
        loading: false,
        orderDetail: action.payload.order,
      };
    },
    orderDetailFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    adminOrdersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    adminOrdersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        resPerPage: action.payload.resPerPage,
        orderCount: action.payload.ordersCount,
        totalPrice: action.payload.totalAmount,
        adminOrders: action.payload.orders,
      };
    },
    adminOrdersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },

    deleteOrderRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteOrderSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isOrderDeleted: true,
      };
    },
    deleteOrderFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateOrderRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateOrderSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isOrderUpdated: true,
      };
    },
    updateOrderFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },

    clearOrderDeleted(state, action) {
      return {
        ...state,
        isOrderDeleted: false,
      };
    },
    clearOrderUpdated(state, action) {
      return {
        ...state,
        isOrderUpdated: false,
      };
    },
    getSellerOrderRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getSellerOrderSuccess(state, action) {
      return {
        ...state,
        loading: false,
        // resPerPage: action.payload.resPerPage,
        orderCount: action.payload.ordersCount,
        totalPrice: action.payload.totalSales,
        sellerOrders: action.payload.orders,
      };
    },
    getSellerOrderFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getSellerSingleOrderRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getSellerSingleOrderSuccess(state, action) {
      return {
        ...state,
        loading: false,
        orderDatail: action.payload.order,
      };
    },
    getSellerSingleOrderFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getShippingCostRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getShippingCostSuccess(state, action) {
      return {
        ...state,
        loading: false,
        cost: action.payload,
      };
    },
    getShippingCostFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = orderSlice;

export const {
  createOrderFail,
  createOrderSuccess,
  createOrderRequest,
  clearError,
  userOrdersFail,
  userOrdersSuccess,
  userOrdersRequest,
  orderDetailFail,
  orderDetailSuccess,
  orderDetailRequest,
  adminOrdersFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  deleteOrderFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  updateOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  clearOrderDeleted,
  clearOrderUpdated,
  getSellerOrderRequest,
  getSellerOrderSuccess,
  getSellerOrderFail,
  getSellerSingleOrderRequest,
  getSellerSingleOrderSuccess,
  getSellerSingleOrderFail,
  getShippingCostRequest,
  getShippingCostSuccess,
  getShippingCostFail
} = actions;

export default reducer;
