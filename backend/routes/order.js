const express = require('express');
const { newOrder, 
    getSingleOrder, 
    myOrders, 
    orders, 
    updateOrder, 
    deleteOrder,
    getSellerOrdersAndSales,
    getSellerSingleOrder
 } = require('../controllers/orderController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles,} = require('../middlewares/authenticate');

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

    
//Admin Routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), orders)
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
                        .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)

//Seller Routes
router.route('/seller/orders').get(isAuthenticatedUser,authorizeRoles('seller'),getSellerOrdersAndSales)    
router.route('/seller/order/:id').get(isAuthenticatedUser,authorizeRoles('seller'),getSellerSingleOrder)    
module.exports = router;