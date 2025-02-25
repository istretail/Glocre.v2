import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";
import productReducer from "./slices/singleProductSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";
import wishlistReducer from "./slices/wishlistSlice";
import relatedProductsReducer from "./slices/relatedProductSlice";
import analyticsReducer from "./slices/analyticsSlice.js";

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState: cartReducer,
  orderState: orderReducer,
  userState: userReducer,
  wishlistState: wishlistReducer,
  relatedProductsState: relatedProductsReducer,
  analyticsState: analyticsReducer,
});

const store = configureStore({
  reducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
