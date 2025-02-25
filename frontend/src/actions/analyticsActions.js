import axios from "axios";
import {
  getAnalyticsFail,
  getAnalyticsRequest,
  getAnalyticsSuccess,
} from "../slices/analyticsSlice";
// export const getAnalytics = () => async (dispatch) => {
//     try {
//         dispatch(getAnalyticsRequest())
//         const { data } = await axios.get('/api/v1/analytics');
//         dispatch(getAnalyticsSuccess(data))
//     } catch (error) {
//        dispatch(getAnalyticsFail())
//     }
// };

export const updateAnalytics = (data) => async (dispatch) => {
  try {
    dispatch(getAnalyticsRequest());
    const { data: response } = await axios.post("/api/v1/analytics", data, {
      withCredentials: true,
    });
    dispatch({ type: getAnalyticsSuccess(), payload: response });
  } catch (error) {
    dispatch({
      type: getAnalyticsFail(),
      payload: error.response.data.message,
    });
  }
};

export const getAnalytics = () => async (dispatch) => {
  try {
    dispatch(getAnalyticsRequest());
    const { data } = await axios.get("/api/v1/analytics", {
      withCredentials: true,
    });
    dispatch(getAnalyticsSuccess(data));
  } catch (error) {
    dispatch(getAnalyticsFail());
  }
};

export const logEvent = async (eventData) => {
  try {
    await axios.post("/api/v1/analytics/log", eventData, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to log analytics event:", error.message);
  }
};
