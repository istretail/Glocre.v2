const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')
const User = require('../models/userModel')
const sendEmail = require('../utils/email')
//get all Product -- /api/v1/Products
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 12;

    // Function to build the query with an additional filter for approved products
    let buildQuery = () => {
        return new APIFeatures(Product.find({ status: 'approved' }), req.query)
            .search()
            .filter();
    };

    // Count the total and filtered approved products
    const filteredProductsCount = await buildQuery().query.countDocuments({});
    const totalProductsCount = await Product.countDocuments({ status: 'approved' });
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    // Get the approved products with pagination and sorting
    const products = await buildQuery().paginate(resPerPage).query.sort('-createdAt');

    // Calculate subcategory counts for approved products
    const subcategoryCounts = {};
    const allApprovedProducts = await Product.find({ status: 'approved' });
    allApprovedProducts.forEach(product => {
        if (subcategoryCounts[product.subcategory]) {
            subcategoryCounts[product.subcategory]++;
        } else {
            subcategoryCounts[product.subcategory] = 1;
        }
    });

    res.status(200).json({
        success: true,
        count: productsCount,
        subcategoryCounts,
        resPerPage,
        products,
    });
});

//Create Product - /api/v1/products/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    let images = [];
    let BASE_URL = process.env.BACKEND_URL;
    
    // Set base URL based on environment
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    // Process images if files are uploaded
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            let mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
            images.push({ url, mediaType });
        });
    }

    // Add images to request body and set the user (createdBy) dynamically
    req.body.images = images;
    req.body.createdBy = req.user.id;

    // Create product
    const product = await Product.create(req.body);

    // Prepare email content for the user
    try {
        const emailContent = `
            <h2>Product Created Successfully</h2>
            <p>Dear ${req.user.name},</p>
            <p>Your product "${product.name}" has been successfully created and is under review for approval.</p>
            <p>Thank you for using our platform!</p>
        `;

        // Send the email to the user who created the product
        await sendEmail({
            email: req.user.email,
            subject: 'Product Created Successfully',
            html: emailContent
        });

    } catch (emailError) {
        console.error("Failed to send email:", emailError);
    }

    // Respond with the created product
    res.status(201).json({
        success: true,
        product
    });
});

//getting single product -- api/v1/product/id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id, status: 'approved' })
        .populate('reviews.user', 'name email');

    if (!product) {
        return next(new ErrorHandler('Product not found or not approved', 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

//Update Product - api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    // Fetch the product and populate 'createdBy' field
    let product = await Product.findById(req.params.id).populate('createdBy');
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Store the creator's information before any updates to product
    const creatorInfo = {
        email: product.createdBy.email,
        name: product.createdBy.name
    };
    // Proceed with the rest of the update logic
    let images = [];
    if (req.body.imagesCleared === 'false') {
        images = product.images;
    }

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            let mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
            images.push({ url, mediaType });
        });
    }
    req.body.images = images;

    // Check if the product status is changing
    const isStatusChanged = req.body.status && req.body.status !== product.status;

    // Update product details in the database
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Send response immediately
    res.status(200).json({
        success: true,
        product
    });

    // Send email if status has changed (after response)
    if (isStatusChanged) {
        try {
            const statusMessage = req.body.status === 'approved' ? 'approved' : 'rejected';
            const emailContent = `
                <h2>Your Product Update</h2>
                <p>Dear ${creatorInfo.name},</p>
                <p>Your product "${product.name}" has been ${statusMessage}.</p>
                <p>Thank you for using our platform!</p>
            `;

            await sendEmail({
                email: creatorInfo.email,
                subject: `Product ${statusMessage}`,
                html: emailContent
            });

        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }
    }
});

//Delete product - api/v1/product/:id
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "product not found"
        });
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "product Deleted!"
    })

}

//Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating: Number(rating), // Ensure rating is a number
        comment
    };

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Finding if user has already reviewed the product
    const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id.toString());

    if (isReviewed) {
        // Updating the existing review
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = Number(rating); // Ensure rating is a number
            }
        });
    } else {
        // Adding the new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating
    const totalRatings = product.reviews.reduce((acc, review) => acc + Number(review.rating), 0); // Ensure ratings are numbers
    const averageRating = totalRatings / product.reviews.length;

    product.ratings = isNaN(averageRating) ? 0 : averageRating;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

//Get Reviews - api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    });
    //number of reviews 
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings) ? 0 : ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })


});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});


// seller Controller
exports.getSellerProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find({ createdBy: req.user.id });
    res.status(200).json({
        success: true,
        products,
    });
});

// Add a new product
exports.addSellerProduct = catchAsyncError(async (req, res, next) => {
    req.body.createdBy = req.user.id; // Set the creator as the seller
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

// Update a product (only if it belongs to the seller)
exports.updateSellerProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!product) {
        return next(new ErrorHandler("Product not found or you're not authorized to update it", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        product,
    });
});
