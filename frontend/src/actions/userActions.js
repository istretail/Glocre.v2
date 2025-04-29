import {
  loginFail,
  loginRequest,
  loginSuccess,
  registerFail,
  registerRequest,
  registerSuccess,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  sendVerificationEmailSuccess,
  sendVerificationEmailRequest,
  sendVerificationEmailFail,
  verifyEmailRequest,
  verifyEmailSuccess,
  verifyEmailFail,
  clearError,
  uploadBannerRequest,
  uploadBannerSuccess,
  uploadBannerFail,
  getBannersRequest,
  getBannersSuccess,
  getBannersFail,
  deleteBannerRequest,
  deleteBannerSuccess,
  deleteBannerFail,
} from "../slices/authSlice";

import {
  usersRequest,
  usersSuccess,
  usersFail,
  userRequest,
  userSuccess,
  userFail,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
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
} from "../slices/userSlice";
import {
  addWishlistRequest,
  addWishlistSuccess,
  addWishlistFail,
  removeWishlistRequest,
  removeWishlistSuccess,
  removeWishlistFail,
  getWishlistRequest,
  getWishlistSuccess,
  getWishlistFail,
} from "../slices/wishlistSlice";
import axios from "axios";
import { toast } from "react-toastify";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`/api/v1/login`, { email, password });
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
    toast(error.response.data.message);
  }
};
export const clearAuthError = () => {
  return (dispatch) => {
    dispatch({ type: 'clearError' });
  };
};


export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const response = await axios.post(`/api/v1/register`, userData, config);
    dispatch(registerSuccess(response.data));

    // After successful registration, send the verification email
    //dispatch(sendVerificationEmail(userData.email));

    return response; // Return the entire response object
  } catch (error) {
    dispatch(registerFail(error.response.data.message));
    throw error; // Re-throw the error to handle it in the component
  }
};

// Action creator for sending verification email
export const sendVerificationEmail = (email, token) => async (dispatch) => {
  try {
    dispatch(sendVerificationEmailRequest());
    // await axios.post(`/api/v1/verify-email/${token}`); // Replace with your actual endpoint
    dispatch(sendVerificationEmailSuccess());
  } catch (error) {
    dispatch(sendVerificationEmailFail(error.response.data.message));
  }
};

export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get(`/api/v1/myprofile`);
    dispatch(loadUserSuccess(data));
  } catch (error) {
    dispatch(loadUserFail(error.response.data.message));
  }
};

export const logout = async (dispatch) => {
  try {
    await axios.get(`/api/v1/logout`);
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail);
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    console.log(userData);
    dispatch(updateProfileRequest());
    const { data } = await axios.put(`/api/v1/update`, userData);
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    dispatch(updateProfileFail(error.response.data.message));
  }
};

export const updatePassword = (formData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(`/api/v1/password/change`, formData, config);
    dispatch(updatePasswordSuccess());
  } catch (error) {
    dispatch(updatePasswordFail(error.response.data.message));
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/forgot`,
      formData,
      config,
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response.data.message));
  }
};

export const resetPassword = (formData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/reset/${token}`,
      formData,
      config,
    );
    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    dispatch(resetPasswordFail(error.response.data.message));
  }
};

export const getUsers = (keyword, role, currentPage) => async (dispatch) => {
  try {
    dispatch(usersRequest());
    let link = `/api/v1/admin/users?page=${currentPage}`;
    if (keyword) link += `&keyword=${keyword}`;
    if (role) link += `&role=${role}`;

    const { data } = await axios.get(link);
    dispatch(usersSuccess(data));
  } catch (error) {
    dispatch(usersFail(error.response.data.message));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await axios.get(`/api/v1/admin/user/${id}`);
    dispatch(userSuccess(data));
  } catch (error) {
    dispatch(userFail(error.response.data.message));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());
    await axios.delete(`/api/v1/admin/user/${id}`);
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFail(error.response.data.message));
  }
};

export const updateUser = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(`/api/v1/admin/user/${id}`, formData, config);
    dispatch(updateUserSuccess());
  } catch (error) {
    dispatch(updateUserFail(error.response.data.message));
  }
};
export const verifyEmail = (token) => async (dispatch) => {
  try {
    dispatch(verifyEmailRequest());
    await axios.post(`/api/v1/verify-email/${token}`);
    dispatch(verifyEmailSuccess());
  } catch (error) {
    dispatch(verifyEmailFail(error.response.data.message));
  }
};
// Action creator for creating a new saved address
export const createSavedAddress = (savedAddressData) => async (dispatch) => {
  try {
    dispatch(createSavedAddressRequest());
    const { data } = await axios.post(
      "/api/v1/users/address",
      savedAddressData,
    );

    // If the response is successful and includes a verified address
    if (data.success && data.data.isPhoneVerified) {
      dispatch(createSavedAddressSuccess(data));
      // toast.success(data.message || 'Address saved successfully!');
      return data.data; // Return the address data for further use
    }

    // Otherwise, handle OTP process
    dispatch(createSavedAddressSuccess(data));
    return data; // Return the full response for further use
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create address";
    dispatch(createSavedAddressFail(errorMessage));
    throw new Error(errorMessage); // Rethrow the error for handling in `submitHandler`
  }
};

// Action to verify OTP for the saved address
export const verifyAddressOtp = (addressId, otpCode) => async (dispatch) => {
  try {
    dispatch(verifyAddressOtpRequest());
    const { data } = await axios.post("/api/v1/users/address/verify-otp", {
      addressId,
      otpCode,
    });
    dispatch(verifyAddressOtpSuccess(data));
    return data; // Ensure the response is returned
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to verify OTP";
    dispatch(verifyAddressOtpFail(errorMessage));
    throw new Error(errorMessage); // Re-throw to handle in the calling function
  }
};

// Action creator for updating an existing saved address
export const updateSavedAddress = (id, updatedData) => async (dispatch) => {
  try {
    dispatch(updateSavedAddressRequest());
    const response = await axios.put(
      `/api/v1/users/savedAddresses/${id}`,
      updatedData,
    );
    dispatch(updateSavedAddressSuccess(response.data));
    return response.data; // Return response data for success case
  } catch (error) {
    dispatch(updateSavedAddressFail(error.response.data.message));
    throw error.response.data.message; // Throw error for failure case
  }
};

// Action creator for deleting a saved address
export const deleteSavedAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteSavedAddressRequest());

    await axios.delete(`/api/v1/users/savedAddresses/${id}`);
    dispatch(deleteSavedAddressSuccess(id)); // Pass the ID of the deleted address
  } catch (error) {
    dispatch(deleteSavedAddressFail(error.response.data.message));
  }
};

// Action creator for getting all saved addresses
export const getAllSavedAddresses = () => async (dispatch) => {
  try {
    dispatch(getAllSavedAddressesRequest());

    const response = await axios.get("/api/v1/users/allsavedAddresses");
    dispatch(getAllSavedAddressesSuccess(response.data));
  } catch (error) {
    dispatch(getAllSavedAddressesFail(error.response.data.message));
  }
};

// wishsit Actions
export const addToWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(addWishlistRequest());
    const { data } = await axios.post("/api/v1/wishlist/add", { productId });
    dispatch(addWishlistSuccess(data.wishlist));
  } catch (error) {
    dispatch(addWishlistFail(error.response.data.message));
  }
};

// Remove from wishlist
export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(removeWishlistRequest());
    const { data } = await axios.post("/api/v1/wishlist/remove", { productId });
    dispatch(removeWishlistSuccess(data.wishlist));
  } catch (error) {
    dispatch(removeWishlistFail(error.response.data.message));
  }
};

// Fetch wishlist
export const fetchWishlist = () => async (dispatch) => {
  try {
    dispatch(getWishlistRequest());
    const { data } = await axios.get("/api/v1/wishlist");
    dispatch(getWishlistSuccess(data.wishlist));
  } catch (error) {
    dispatch(getWishlistFail(error.response.data.message));
    console.log(error.response.data.message);
  }
};
export const uploadBanner = (formData) => async (dispatch) => {
  try {
    dispatch(uploadBannerRequest);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(`/api/v1/banner/upload`, formData, config);

    dispatch(uploadBannerSuccess(data));
  } catch (error) {
    dispatch(uploadBannerFail(error.response.data.message));
    console.log(error.response.data.message);
  }
};
// Get all banner images
export const getBanners = () => async (dispatch) => {
  try {
    dispatch(getBannersRequest);

    const { data } = await axios.get(`/api/v1/banner`);

    dispatch(getBannersSuccess(data));
  } catch (error) {
    dispatch(getBannersFail(error.response.data.message));
  }
};
// Delete a banner image
export const deleteBanner = (id) => async (dispatch) => {
  try {
    dispatch(deleteBannerRequest());

    await axios.delete(`/api/v1/banner/${id}`);

    dispatch(deleteBannerSuccess(id));
  } catch (error) {
    dispatch(deleteBannerFail(error.response.data.message));
  }
};

export const submitContactForm = (formData) => async (dispatch) => {
  try {
    dispatch(contactFormRequest());
    const response = await axios.post("/api/v1/contact", formData);
    dispatch(contactFormSuccess(response.data));
    toast.success("Form submitted successfully! We’ll contact you soon.");
  } catch (error) {
    dispatch(contactFormFail(error.response.data.message));
  }
};
export const resendVerification = (email) => async (dispatch) => {
  try {
    dispatch(resendVerificationRequest());
    const response = await axios.post("/api/v1/resend-verification", { email });
    dispatch(resendVerificationSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    dispatch(resendVerificationFail(error.response.data.message));
  }
};