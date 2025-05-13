const catchAsyncError = require('../middlewares/catchAsyncError');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');
const { createTracking, getTracking } = require('../utils/trackPackage');
const User = require("../models/userModel");
const sendEmail = require('../utils/email');
const pincodes = require("../config/pincodes")
//Create New Order - api/v1/order/new


exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        billingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        discount,
        paymentInfo,
    } = req.body;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const order = await Order.create({
        orderItems,
        shippingInfo,
        billingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        discount,
        paymentInfo,
        estimatedDelivery,
        paidAt: Date.now(),
        user: req.user.id,
    });

    const userEmail = req.user.email;
    const userName = req.user.name;
    const adminEmail = process.env.ADMIN_EMAIL;

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
      <div style="text-align: center;">
        <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Logo" style="max-width: 180px; margin-bottom: 20px;" />
      </div>
  
      <h2 style="color: #2f4d2a;">Order Summary</h2>
  
      <p style="color: #8c8c8c;"><strong>Customer:</strong> ${userName}</p>
      <p style="color: #8c8c8c;"><strong>Email:</strong> ${userEmail}</p>
      <p style="color: #8c8c8c;"><strong>Total Amount:</strong> ₹${totalPrice}</p>
      <p style="color: #8c8c8c;"><strong>Estimated Delivery:</strong> ${estimatedDelivery.toDateString()}</p>
  
      <h3 style="color: #2f4d2a;">Items Ordered</h3>
      <ul style="color: #8c8c8c; padding-left: 20px;">
        ${orderItems.map(item => `<li>${item.name} (x${item.quantity})</li>`).join('')}
      </ul>
  
      <p style="color: #8c8c8c;">Thank you for shopping with <strong>GLOCRE</strong>!</p>
  
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #8c8c8c;">
        <em>This is an auto-generated email. Please do not reply. For help, contact <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
      </p>
    </div>
  `;
  

    try {
        // 1. Send to user
        await sendEmail({
            fromEmail: "donotreply@glocre.com",
            email: userEmail,
            subject: "Your Order Confirmation - Glocre",
            html: `<p>Thank you for your order, ${userName}!</p>` + emailContent,
        });

        // 2. Send to admin
        await sendEmail({
            fromEmail: "donotreply@glocre.com",
            email: adminEmail,
            subject: "New Order Received - Glocre",
            html: `<p>A new order has been placed:</p>` + emailContent,
        });

        // 3. Find all unique seller emails
        const sellerIds = new Set();

        for (const item of orderItems) {
            const product = await Product.findById(item.product); // assuming item.product is product ID
            if (product && product.createdBy) {
                sellerIds.add(product.createdBy.toString());
            }
        }

        const sellerUsers = await User.find({ _id: { $in: [...sellerIds] } });

        for (const seller of sellerUsers) {
            await sendEmail({
                fromEmail: "donotreply@glocre.com",
                email: seller.email,
                subject: "New Order for Your Product - Glocre",
                html: `<p>You have a new order for your product(s):</p>` + emailContent,
            });
        }

    } catch (error) {
        return next(new ErrorHandler("Order placed but failed to send all emails.", 500));
    }

    res.status(200).json({ success: true, order });
});


//Admin: Update Order / Order Status - api/v1/order/:id


// exports.updateOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//         return next(new ErrorHandler(`Order not found`, 404));
//     }

//     if (order.orderStatus === 'Delivered') {
//         return next(new ErrorHandler('Order has already been delivered!', 400));
//     }

//     // Updating the stock for ordered items
//     await Promise.all(order.orderItems.map(async orderItem => {
//         await updateStock(orderItem.product, orderItem.quantity);
//     }));

//     order.orderStatus = req.body.orderStatus;
//     if (req.body.orderStatus === 'Shipped') {
//         order.trackingInfo = {
//             carrier: req.body.carrier,
//             trackingNumber: req.body.trackingNumber,
//             afterShipTrackingId: req.body.afterShipTrackingId
//         };
//     }
//     if (req.body.orderStatus === 'Delivered') {
//         order.deliveredAt = Date.now();
//     }

//     await order.save();

//     res.status(200).json({ success: true, order });
// });
//Get Loggedin User Orders - /api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Process Refund - api/v1/order/:id/refund
// exports.processRefund = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//         return next(new ErrorHandler(`Order not found`, 404));
//     }

//     if (order.refundStatus !== 'No Refund') {
//         return next(new ErrorHandler('Refund has already been processed!', 400));
//     }

//     // Assuming refund processing is successful
//     order.refundStatus = req.body.refundStatus || 'Refunded';
//     await order.save();

//     res.status(200).json({ success: true, message: 'Refund processed successfully', order });
// });

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
//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .lean();

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    // Fetch AfterShip tracking details if available
    if (order.trackingInfo?.afterShipTrackingId) {
        const trackingDetails = await getAfterShipTracking(order.trackingInfo.afterShipTrackingId);
        order.trackingDetails = trackingDetails; // Attach tracking info
    }

    res.status(200).json({ success: true, order });
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

    await order.deleteOne();
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


// exports.updateOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//         return next(new ErrorHandler("Order not found", 404));
//     }

//     if (order.orderStatus === "Delivered") {
//         return next(new ErrorHandler("Order has already been delivered!", 400));
//     }

//     // Update stock
//     for (const orderItem of order.orderItems) {
//         await updateStock(orderItem.product, orderItem.quantity);
//     }

//     // order.trackingInfo.orderStatus = req.body.orderStatus;
//     // order.trackingInfo.trackingNumber = req.body.trackingNumber;
//     // order.trackingInfo.courierSlug = req.body.courierSlug;
//     // console.log(order.trackingInfo.orderStatus, order.trackingInfo.trackingNumber, order.trackingInfo.courierSlug);
//     // if (req.body.orderStatus === "Shipped") {
//     //     try {
//     //         await createTracking(order.trackingInfo.trackingNumber, order.trackingInfo.courierSlug, order.clocreOrderId);
//     //     } catch (error) {
//     //         return next(new ErrorHandler("Failed to create tracking", 400));
//     //     }
//     // }

//     order.deliveredAt = Date.now();
//     await order.save();

//     res.status(200).json({ success: true, order });
// });


exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user'); // get user's email

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order has already been delivered!', 400));
    }

    let emailSubject = '';
    let emailBody = '';

    // If status is "Delivered", update stock and set delivery time
    if (req.body.orderStatus === 'Delivered') {
        order.orderItems.forEach(async (orderItem) => {
            await updateStock(orderItem.product, orderItem.quantity);
        });
        order.deliveredAt = Date.now();

        emailSubject = `Your order #${order._id} has been delivered`;
        emailBody = `
      <p>Hi ${order.user.name},</p>
      <p>Your order has been <strong>delivered</strong> successfully!</p>
      <p>Thank you for shopping with us.</p>
    `;
    }

    // If status is "Shipped", update tracking info
    if (req.body.orderStatus === 'Shipped') {
        order.trackingInfo = {
            trackingNumber: req.body.trackingNumber || '',
            courierSlug: req.body.courierSlug || ''
        };

        emailSubject = `Your order #${order.clocreOrderId} has been shipped`;
        emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
          <div style="text-align: center;">
            <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Logo" style="max-width: 180px; margin-bottom: 20px;" />
          </div>
          <h2 style="color: #2f4d2a;">Your Order Has Been Shipped!</h2>
          <p style="color: #8c8c8c;">Hi ${order.user.name},</p>
          <p style="color: #8c8c8c;">
            We're excited to let you know that your order has been <strong>shipped</strong>.
          </p>
          <p style="color: #8c8c8c;">
            <strong>Tracking Number:</strong> ${req.body.trackingNumber}<br/>
            <strong>Courier:</strong> ${req.body.courierSlug}
          </p>
          <p style="color: #8c8c8c;">
            You can track your shipment using the tracking number on the courier's website.
          </p>
          <p style="color: #8c8c8c;">Thank you for choosing <strong>GLOCRE</strong>!</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #8c8c8c;">
            <em>This is an auto-generated email. Please do not reply. For assistance, contact us at <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
          </p>
        </div>
      `;
      
    }

    order.orderStatus = req.body.orderStatus;
    await order.save();

    // Send email if body is set
    if (emailSubject && emailBody) {
        await sendEmail({
            fromEmail: "donotreply@glocre.com",
            email: order.user.email,
            subject: emailSubject,
            html: emailBody
        });
    }

    res.status(200).json({
        success: true,
        message: "Order updated successfully"
    });
});


exports.trackOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order || !order.trackingInfo.trackingNumber || !order.trackingInfo.courierSlug) {
            return res.status(404).json({ success: false, message: "Tracking info not available" });
        }

        const trackingDetails = await getTracking(order.trackingInfo.trackingNumber, order.trackingInfo.courierSlug);

        if (!trackingDetails) {
            return res.status(404).json({ success: false, message: "Tracking info not available yet. Try again later." });
        }

        res.status(200).json({
            success: true,
            tracking: trackingDetails,
        });

    } catch (error) {
        console.error("Error tracking order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});



exports.calculateShippingCost = catchAsyncError(async (req, res, next) => {
    const { shippingInfo = [], cartItem } = req.body;
    
    if (!Array.isArray(cartItem) || !shippingInfo) {
        return next(new ErrorHandler("Missing or invalid cart items or shipping info", 400));
    }

    const getRegionFromState = (state) => {
        if (!state) return null;

        const northStates = [
            "Delhi",
            "Haryana",
            "Uttar Pradesh",
            "Punjab",
            "Chandigarh",
            "Himachal Pradesh",
            "Jammu and Kashmir",
            "Jammu & Kashmir",
            "Ladakh",
            "Uttarakhand"
        ];
        const southStates = [
            "Andhra Pradesh",
            "Telangana",
            "Karnataka",
            "Kerala",
            "Tamil Nadu",
            "Puducherry",
            "Pondicherry",
            "Lakshadweep",
            "Andaman and Nicobar Islands",
            "Andaman & Nicobar",
        ];
        const eastStates = [
            "Bihar",
            "Odisha",
            "Jharkhand",
            "West Bengal"
           
        ];
        const westStates = [
            "Rajasthan",
            "Gujarat",
            "Maharashtra",
            "Goa",
            "Dadra and Nagar Haveli and Daman and Diu",
            "Dadra & Nagar Haveli",
            "Daman & Diu",
            
        ];
        const centralStates = [
            "Madhya Pradesh",
            "Chhattisgarh"
        ];
        const northeastStates = [
            "Assam",
            "Meghalaya",
            "Manipur",
            "Mizoram",
            "Nagaland",
            "Tripura",
            "Arunachal Pradesh",
            "Sikkim"
        ];
        
        state = state.trim(); // Normalize spacing

        if (northStates.includes(state)) return "North";
        if (southStates.includes(state)) return "South";
        if (eastStates.includes(state)) return "East";
        if (westStates.includes(state)) return "West";
        if (centralStates.includes(state)) return "Central";
        if (northeastStates.includes(state)) return "North-East";

        return null;
    };


    const isLocalDelivery = (shippingPin, businessPin) => {
        return shippingPin?.substring(0, 3) === businessPin?.substring(0, 3);
    };

    const shippingPin = shippingInfo?.postalCode;
    const state = shippingInfo?.state;
    // console.log("state:", state);
    // console.log("shippingPin:", shippingPin);
    const region = getRegionFromState(state);
    const results = [];

    for (const item of cartItem) {
        const seller = await User.findById(item.createdBy);
        const businessPin = seller?.businessAddress?.[0]?.postalCode || "641001";
        let shippingCost = 0;
        let localDelivery = isLocalDelivery(shippingPin, businessPin);

        if (localDelivery) {
            shippingCost = item.shippingCostlol;
        } else {
            switch (region) {
                case "North": shippingCost = item.shippingCostNorth; break;
                case "South": shippingCost = item.shippingCostSouth; break;
                case "East": shippingCost = item.shippingCostEast; break;
                case "West": shippingCost = item.shippingCostWest; break;
                case "Central": shippingCost = item.shippingCostCentral; break;
                case "North-East": shippingCost = item.shippingCostNe; break;
                default: shippingCost = 0;
            }
        }
        // console.log("Region:", region);
        results.push({
            productId: item.product,
            shippingCost,
            sellerId: item.createdBy,
            region: region || "Unknown",
            isLocal: localDelivery,
        });
    }

    const totalShippingCost = results.reduce((sum, r) => sum + (r.shippingCost || 0), 0);

    res.status(200).json({
        success: true,
        totalShippingCost,
        breakdown: results,
    });
    // console.log("Result", results);
    // console.log("Total Shipping cost", totalShippingCost);
});

