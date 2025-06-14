import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: {},
    users: [],
    isUserUpdated: false,
    isUserDeleted: false,
    savedAddresses: [],
    savedAddress: {},
    isFormSubmitted: false,

  },
  reducers: {
    usersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    usersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        userConut: action.payload.count,
        resPerPage: action.payload.resPerPage,
        users: action.payload.users,
        ResultCount: action.payload.resultUser,
      };
    },
    usersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    userRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    userSuccess(state, action) {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
      };
    },
    userFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },

    deleteUserRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteUserSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isUserDeleted: true,
      };
    },
    deleteUserFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateUserRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateUserSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isUserUpdated: true,
      };
    },
    updateUserFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearUserDeleted(state, action) {
      return {
        ...state,
        isUserDeleted: false,
      };
    },
    clearUserUpdated(state, action) {
      return {
        ...state,
        isUserUpdated: false,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    createSavedAddressRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createSavedAddressSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAddressCreated: true,
        data: action.payload.data, // This should contain addressId and otpCode directly
        addressId: action.payload.data.addressId,
      };
    },
    createSavedAddressFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateSavedAddressRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateSavedAddressSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isUserUpdated: true,
      };
    },
    updateSavedAddressFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    deleteSavedAddressRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteSavedAddressSuccess(state, action) {
      // Filter out the deleted address from the savedAddresses array
      const updatedAddresses = state.savedAddresses.filter(
        (address) => address._id !== action.payload,
      );

      return {
        ...state,
        loading: false,
        isUserDeleted: true,
        savedAddresses: updatedAddresses, // Update the savedAddresses array with the filtered list
      };
    },
    deleteSavedAddressFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getAllSavedAddressesRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getAllSavedAddressesSuccess(state, action) {
      return {
        ...state,
        loading: false,
        savedAddresses: action.payload.data,
      };
    },
    getAllSavedAddressesFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    verifyAddressOtpRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    verifyAddressOtpSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    verifyAddressOtpFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    contactFormRequest(state, action) {
      return {
        ...state,
        loading: true,
        isFormSubmitted: false,
      };
    },
    contactFormSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        isFormSubmitted: true,
      };
    },
    contactFormFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isFormSubmitted: false,
      };
    },
    resendVerificationRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    resendVerificationSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    resendVerificationFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    subscribeRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    subscribeSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    subscribeFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    unsubscribeRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    unsubscribeSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    unsubscribeFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getAddressByIdRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getAddressByIdSuccess(state, action) {
      return {
        ...state,
        loading: false,
        savedAddress: action.payload.data,
      };
    },
    getAddressByIdFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = userSlice;

export const {
  usersRequest,
  usersSuccess,
  usersFail,
  userRequest,
  userSuccess,
  userFail,
  deleteUserRequest,
  deleteUserFail,
  deleteUserSuccess,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
  clearUserDeleted,
  clearUserUpdated,
  clearError,
  createSavedAddressRequest,
  createSavedAddressSuccess,
  createSavedAddressFail,
  updateSavedAddressRequest,
  updateSavedAddressSuccess,
  updateSavedAddressFail,
  deleteSavedAddressRequest,
  deleteSavedAddressSuccess,
  deleteSavedAddressFail,
  getAllSavedAddressesRequest,
  getAllSavedAddressesSuccess,
  getAllSavedAddressesFail,
  verifyAddressOtpRequest,
  verifyAddressOtpSuccess,
  verifyAddressOtpFail,
  contactFormRequest,
  contactFormSuccess,
  contactFormFail,
  resendVerificationRequest,
  resendVerificationSuccess,
  resendVerificationFail,
  subscribeRequest,
  subscribeSuccess,
  subscribeFail,
  unsubscribeRequest,
  unsubscribeSuccess,
  unsubscribeFail,
  getAddressByIdRequest,
  getAddressByIdSuccess,
  getAddressByIdFail,
} = actions;

export default reducer;
