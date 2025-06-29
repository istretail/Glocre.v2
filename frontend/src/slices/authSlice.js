import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    isAuthenticated: false,
    resetSuccess: false,
    message: null,
    banners: [],
  },
  reducers: {
    loginRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    loginSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loginFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearError(state) {
      state.error = null;
      state.message= null;
    },
    registerRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    registerSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: false,
        user: action.payload.user,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    loadUserRequest(state, action) {
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
      };
    },
    loadUserSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loadUserFail(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    logoutSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };
    },
    logoutFail(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
    updateProfileRequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updateProfileSuccess(state, action) {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isUpdated: true,
      };
    },
    updateProfileFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateUserProfileRequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updateUserProfileSuccess(state, action) {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isUpdated: true,
      };
    },
    updateUserProfileFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearUpdateProfile(state, action) {
      return {
        ...state,
        isUpdated: false,
      };
    },

    updatePasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updatePasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isUpdated: true,
      };
    },
    updatePasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    forgotPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        message: null,
      };
    },
    forgotPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    forgotPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    resetPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        resetSuccess: false, // new flag
      };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        resetSuccess: true, // success flag
      };
    },
    resetPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        resetSuccess: false, // new flag
      };
    },
    sendVerificationEmailRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    sendVerificationEmailSuccess(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    sendVerificationEmailFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    verifyEmailRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    verifyEmailSuccess(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    verifyEmailFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    uploadBannerRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    uploadBannerSuccess(state, action) {
      return {
        ...state,
        loading: false,
        banners: [action.payload, ...state.banners],
      };
    },
    uploadBannerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },

    getBannersRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getBannersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        banners: action.payload.banners,
      };
    },
    getBannersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },

    deleteBannerRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteBannerSuccess(state, action) {
      return {
        ...state,
        loading: false,
        banners: state.banners.filter((banner) => banner._id !== action.payload),
      };
    },
    deleteBannerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getallEmailsRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    getallEmailsSuccess(state, action) {
      return {
        ...state,
        loading: false,
        emails: action.payload.emails,
      };
    },
    getallEmailsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});
const { actions, reducer } = authSlice;

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutFail,
  logoutSuccess,
  updateProfileFail,
  updateProfileRequest,
  updateProfileSuccess,
  clearUpdateProfile,
  updatePasswordFail,
  updateUserProfileRequest,
  updateUserProfileSuccess,
  updateUserProfileFail,
  updateUserPasswordFail,
  updatePasswordSuccess,
  updatePasswordRequest,
  forgotPasswordFail,
  forgotPasswordSuccess,
  forgotPasswordRequest,
  resetPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  sendVerificationEmailRequest,
  sendVerificationEmailSuccess,
  sendVerificationEmailFail,
  verifyEmailRequest,
  verifyEmailSuccess,
  verifyEmailFail,
  uploadBannerRequest,
  uploadBannerSuccess,
  uploadBannerFail,
  getBannersRequest,
  getBannersSuccess,
  getBannersFail,
  deleteBannerRequest,
  deleteBannerSuccess,
  deleteBannerFail,
  getallEmailsRequest,
  getallEmailsSuccess,
  getallEmailsFail,
} = actions;

export default reducer;
