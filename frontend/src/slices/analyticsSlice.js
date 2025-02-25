import { createSlice } from "@reduxjs/toolkit";

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    categories: [],
    searchKeywords: [],
    productTimes: {},
  },
  reducers: {
    getAnalyticsRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getAnalyticsSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    getAnalyticsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = analyticsSlice;

export const { getAnalyticsRequest, getAnalyticsSuccess, getAnalyticsFail } =
  actions;

export default reducer;
