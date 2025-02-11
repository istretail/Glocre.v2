const catchAsyncError = require('../middlewares/catchAsyncError');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures')

//Create New Order - api/v1/order/new
exports.newOrder =  catchAsyncError( async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        billingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        billingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})

//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    res.status(200).
    json({
        success: true,
        order
    })
})

//Get Loggedin User Orders - /api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Get All Orders - api/v1/admin/orders
exports.orders = catchAsyncError(async (req, res, next) => {
    const resPerPage = 10;

    // APIFeatures for paginated and filtered orders
    const apiFeatures = new APIFeatures(Order.find(), req.query)
        .search() 
        .filter()
        .paginate(resPerPage);

    const orders = await apiFeatures.query;

    // Calculate the total amount for all orders (without pagination)
    const totalAmountResult = await Order.aggregate([
        { $match: apiFeatures.filterQuery }, // Apply any filters from APIFeatures
        { $group: { _id: null, totalAmount: { $sum: "$totalPrice" } } },
    ]);

    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;

    const ordersCount = await Order.countDocuments(apiFeatures.filterQuery); // Apply filters for accurate count

    res.status(200).json({
        success: true,
        totalAmount,
        ordersCount,
        resPerPage,
        orders
    });
});

//Admin: Update Order / Order Status - api/v1/order/:id
exports.updateOrder =  catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered!', 400))
    }
    //Updating the product stock of each order item
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    })
    
});

async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false})
}

//Admin: Delete Order - api/v1/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    await order.remove();
    res.status(200).json({
        success: true
    })
})

//Seller get Orders
exports.getSellerOrdersAndSales = catchAsyncError(async (req, res, next) => {
    const sellerId = req.user.id; 
    const resPerPage = 10;

    // Fetch product IDs created by this seller/admin
    const products = await Product.find({ createdBy: sellerId }).select('_id');
    if (!products.length) {
        return res.status(200).json({ success: true, orders: [], totalSales: 0 });
    }

    const productIds = products.map(product => product._id.toString()); // Ensure product IDs are strings

    // Apply APIFeatures for filtering, searching, and pagination
    const apiFeatures = new APIFeatures(
        Order.find({
            'orderItems.product': { $in: productIds }, // Only orders with seller's products
        }),
        req.query
    )
        .search() 
        .filter() 
        .paginate(resPerPage); 

    const orders = await apiFeatures.query;

    // Filter order items to include only the seller's products
    const filteredOrders = orders.map(order => {
        const sellerOrderItems = order.orderItems.filter(item =>
            productIds.includes(item.product.toString())
        );
        return {
            ...order.toObject(),
            orderItems: sellerOrderItems,
        };
    });

    // Calculate total sales for all matching orders (ignoring pagination)
    const totalSalesResult = await Order.aggregate([
        {
            $match: {
                'orderItems.product': { $in: productIds }, // Match orders with seller's products
            },
        },
        {
            $unwind: '$orderItems', // Deconstruct orderItems array
        },
        {
            $match: {
                'orderItems.product': { $in: productIds }, // Match only seller's products
            },
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
            },
        },
    ]);

    let totalSales = 0;
        filteredOrders.forEach(order => {
            order.orderItems.forEach(item => {
                totalSales += item.price * item.quantity;
            });
        });

    // Get total order count (ignoring pagination)
    const ordersCount = await Order.countDocuments({
        'orderItems.product': { $in: productIds },
    });

    res.status(200).json({
        success: true,
        totalSales,
        ordersCount,
        resPerPage,
        orders: filteredOrders,
    });
});

// get seller single Order
exports.getSellerSingleOrder = catchAsyncError(async (req, res, next) => {
    const sellerId = req.user.id; // Logged-in seller/admin ID
    const orderId = req.params.id; // Order ID from the request parameters

    // Fetch product IDs created by this seller/admin
    const products = await Product.find({ createdBy: sellerId }).select('_id');
    if (!products.length) {
        return res.status(404).json({ success: false, message: "No products found for this seller." });
    }

    const productIds = products.map(product => product._id.toString()); // Ensure product IDs are strings

    // Fetch the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Filter order items to include only the seller's products
    const sellerOrderItems = order.orderItems.filter(item =>
        productIds.includes(item.product.toString())
    );

    if (!sellerOrderItems.length) {
        return res.status(403).json({ 
            success: false, 
            message: "You do not have permission to view this order." 
        });
    }

    // Prepare the filtered order response
    const filteredOrder = {
        ...order.toObject(),
        orderItems: sellerOrderItems, // Include only seller's products
    };

    res.status(200).json({
        success: true,
        order: filteredOrder,
    });
});

