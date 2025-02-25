import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import "./responsive.css";
import Home from "./components/home/Home";
import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ProductSearch from "./components/product/ProductSearch";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess";
import UserOrders from "./components/order/UserOrders";
import OrderDetail from "./components/order/OrderDetail";
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import NewProduct from "./components/admin/NewProduct";
import UpdateOrder from "./components/admin/UpdateOrder";
import UserList from "./components/admin/UserList";
import UpdateUser from "./components/admin/UpdateUser";
import ReviewList from "./components/admin/ReviewList";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import VerifyEmail from "./components/user/VerifyEmail";
import Sucess from "./components/user/Sucess";
import SavedAddress from "./components/user/SavedAddress";
import UpdateSavedAddress from "./components/user/UpdateSavedAddress";
import ProductCategory from "./components/product/ProductCategory";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import ScrollToTop from "./components/layouts/ScrollToTop";
import ProductDetail from "./components/product/productDetail";
import Ourbusiness from "./components/layouts/OURBUSINESS/ourbusiness";
import ProcuregSeller from "./components/layouts/SELLERPAGE/sellerpage";
import Wishlist from "./components/layouts/whishlist";
import TermsConditions from "./components/layouts/policy/t&c";
import Policy from "./components/layouts/policy/policy";
import RefundPolicy from "./components/layouts/policy/refundpol";
import Support from "./components/layouts/support";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAnalytics } from "./actions/analyticsActions";
import store from "./store";
import { loadUser } from "./actions/userActions";
import { ToastContainer } from "react-toastify";
import SellerRegistration from "./components/seller/SellerRegistration";
import SellerDashboard from "./components/seller/SellerDashboard";
import SellerProducts from "./components/seller/SellerProducts";
import SellerOrders from "./components/seller/SellerOrders";
import SellerOrderDetail from "./components/seller/SellerOrderDetail";
import SellerCreateProduct from "./components/seller/SellerCreateProduct";
import SellerUpdateProduct from "./components/seller/SellerEditProduct";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isRestrictedRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/seller");

  return (
    <HelmetProvider>
      {!isRestrictedRoute && <Header />}
      {children}
      {!isRestrictedRoute && <Footer />}
    </HelmetProvider>
  );
};



const App = () => {
  const { isAuthenticated } = useSelector((state) => state.authState);
  const [isModalVisible, setModalVisible] = useState(
    !document.cookie.includes("analytics=true"),
  );
  const dispatch = useDispatch();
  useEffect(() => {
    store.dispatch(loadUser);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !document.cookie.includes("analytics=true")) {
      document.cookie = "analytics=true; path=/";
      dispatch(updateAnalytics());
      setModalVisible(false);
    }
  }, [isAuthenticated, dispatch]);


  return (
    <Router>
      <ScrollToTop />
      <ToastContainer theme="colored" position="bottom-center" />
      <AppLayout>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search/:keyword" element={<ProductSearch />} />
          <Route path="/category/:category" element={<ProductCategory />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/support" element={<Support />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/ourbus" element={<Ourbusiness />} />
          <Route path="/sell" element={<ProcuregSeller />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/return" element={<RefundPolicy />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/success" element={<Sucess />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/myprofile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/myprofile/update"  element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          <Route path="/myprofile/update/password"  element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="/myprofile/saved-address"  element={<ProtectedRoute><SavedAddress /></ProtectedRoute>} />
          <Route path="/myprofile/update-saved-address/:id"  element={<ProtectedRoute><UpdateSavedAddress /></ProtectedRoute>} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping"  element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
          <Route path="/order/confirm"  element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
          <Route path="/order/success"  element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/orders"  element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
          <Route path="/order/:id"  element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          {/* Admin Routes (No Header & Footer) */}
          <Route path="/admin/dashboard"  element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products"  element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
          <Route path="/admin/products/create"  element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
          <Route path="/admin/products/:id"  element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
          <Route path="/admin/orders"  element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
          <Route path="/admin/order/:id"  element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>} />
          <Route path="/admin/users"  element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
          <Route path="/admin/user/:id"  element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
          <Route path="/admin/reviews"  element={<ProtectedRoute isAdmin={true}><ReviewList /></ProtectedRoute>} />

          {/* Seller Routes */}
          <Route path="/seller/register"  element={<ProtectedRoute><SellerRegistration /></ProtectedRoute>} />
          <Route path="/seller/dashboard"  element={<ProtectedRoute isSeller={true}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/products"  element={<ProtectedRoute isSeller={true}><SellerProducts /></ProtectedRoute>} />
          <Route path="/seller/orders"  element={<ProtectedRoute isSeller={true}><SellerOrders /></ProtectedRoute>} />
          <Route path="/seller/order/:id"  element={<ProtectedRoute isSeller={true}><SellerOrderDetail/></ProtectedRoute>} />
          <Route path="/seller/products/create"  element={<ProtectedRoute isSeller={true}><SellerCreateProduct /></ProtectedRoute>} />
          <Route path="/seller/product/:id"  element={<ProtectedRoute isSeller={true}><SellerUpdateProduct /></ProtectedRoute>} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
