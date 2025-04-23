import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import productsReducer from "./slices/productSlice";
import productReducer from "./slices/singleProductSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";
import wishlistReducer from "./slices/wishlistSlice";
import relatedProductsReducer from "./slices/relatedProductSlice";
import analyticsReducer from "./slices/analyticsSlice.js";
import categoryReducer from "./slices/categorySlice.js";
// Configuration for persisting authentication state
const authPersistConfig = {
  key: "auth",
  storage,
};

// Wrap authReducer with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: persistedAuthReducer, // Use persisted reducer for authentication
  cartState: cartReducer,
  orderState: orderReducer,
  userState: userReducer,
  wishlistState: wishlistReducer,
  relatedProductsState: relatedProductsReducer,
  analyticsState: analyticsReducer,
  categoryState:categoryReducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed to avoid errors with redux-persist
    }),
});

const persistor = persistStore(store);

export { store, persistor };
