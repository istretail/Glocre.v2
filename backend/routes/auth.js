const express = require('express');
const multer = require ('multer')
const path = require('path')

const upload = multer({storage: multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, path.join(__dirname,'..' , 'uploads/user' ))
   },
      filename: function(req, file , cb){
         cb(null, file.originalname)
      }
})})

const { 
   registerUser, 
   loginUser, 
   logoutUser, 
   forgotPassword,
   resetPassword, 
   getUserProfile, 
   changePassword,
   updateProfile,
   getAllUsers,
   getUser,
   updateUser,
   deleteUser,
   verifyEmail,
   createSavedAddress,
   updateSavedAddress,
   deleteSavedAddress,
   getAllSavedAddresses,
   addToCart,
   getCartItems,
   removeFromCart,
   updateCartItemQuantity,
   clearCart,
   verifyAddressOtp,
   addToWishlist,
   getWishlist,
   removeFromWishlist,
   verifySellerOtp,
   sendOTP,
   verifyOTP,
   sendContactEmail
} = require('../controllers/authController')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')
const router = express.Router();
router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/verify-email/:token').get(verifyEmail)
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/verify/seller/otp').post(isAuthenticatedUser, verifySellerOtp);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/update').put(isAuthenticatedUser, updateProfile);
router.route('/users/address').post(isAuthenticatedUser,createSavedAddress)
router.route('/users/address/verify-otp').post(isAuthenticatedUser,verifyAddressOtp )
router.route('/users/savedAddresses/:id').put(isAuthenticatedUser, updateSavedAddress)
                                          .delete(isAuthenticatedUser, deleteSavedAddress)
router.route('/users/allsavedAddresses').get(isAuthenticatedUser, getAllSavedAddresses)
router.route('/contact').post(sendContactEmail)
//cart Routes 
router.route('/cart/add').post(isAuthenticatedUser, addToCart)
router.route('/cart').get(isAuthenticatedUser, getCartItems)
router.route('/cart/remove').delete(isAuthenticatedUser, removeFromCart)
router.route('/cart/update').put(isAuthenticatedUser, updateCartItemQuantity)
router.route('/cart/clear').delete(isAuthenticatedUser, clearCart)
//wishlist Routes
router.route('/wishlist/add').post(isAuthenticatedUser, addToWishlist)
router.route('/wishlist').get(isAuthenticatedUser, getWishlist)
router.route('/wishlist/remove').post(isAuthenticatedUser, removeFromWishlist);
//Admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUser)
                                .put(isAuthenticatedUser,authorizeRoles('admin'), updateUser)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

 module.exports = router;