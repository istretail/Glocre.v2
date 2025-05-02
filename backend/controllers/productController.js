const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const categoryHierarchy = require("../config/categoryHierarchy");
const s3 = require('../config/s3');
//get all Product -- /api/v1/Products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 100;

  // Validate and sanitize limit
  let limit = parseInt(req.query.limit);
  if (isNaN(limit) || limit <= 0) {
    limit = resPerPage; // Fallback to default
  }

  let buildQuery = () => {
    return new APIFeatures(
      Product.find({
        $and: [{ status: "approved" },
          // { isArchived: false} 
        ]
      }),
      req.query
    )
      .search()
      .filter();
  };


  const filteredProductsCount = await buildQuery().query.countDocuments({});
  const totalProductsCount = await Product.countDocuments({
    status: "approved",
    // isArchived: false,
  });
  const productsCount =
    filteredProductsCount !== totalProductsCount
      ? filteredProductsCount
      : totalProductsCount;

  const products = await buildQuery().paginate(limit).query.sort("-createdAt");


  res.status(200).json({
    success: true,
    count: productsCount,

    resPerPage: limit,
    products,
  });
});

//Create Product - /api/v1/products/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  if (req.files) {
    Object.keys(req.files).forEach((key) => {
      const match = key.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const variantIndex = parseInt(match[1], 10);
        if (req.body.variants[variantIndex]) {
          req.body.variants[variantIndex].images = req.files[key].map((file) => file.location);
        }
      }
    });
  }

  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    maincategory: req.body.maincategory,
    category: req.body.category,
    subcategory: req.body.subcategory,
    fssai: req.body.fssai,
    brand: req.body.brand,
    condition: req.body.condition,
    tax: req.body.tax,
    keyPoints: req.body.keyPoints,
    images: req.files.images ? req.files.images.map(file => file.location) : [],
    variants: req.body.variants,
    createdBy: req.user.id,
    isRefundable: req.body.isRefundable === "true",
    price: req.body.price,
    offPrice: req.body.offPrice,
    stock: req.body.stock,
    itemModelNum: req.body.itemModelNum,
    sku: req.body.sku,
    upc: req.body.upc,
    hsn: req.body.hsn,
    countryofOrgin: req.body.countryofOrgin,
    manufactureDetails: req.body.manufactureDetails,
    productCertifications: req.body.productCertifications,
    itemLength: req.body.itemLength,
    itemHeight: req.body.itemHeight,
    itemWeight: req.body.itemWeight,
    itemWidth: req.body.itemWidth,
    moq: req.body.moq,
    shippingCostlol: req.body.shippingCostlol,
    shippingCostNorth: req.body.shippingCostNorth,
    shippingCostSouth: req.body.shippingCostSouth,
    shippingCostEast: req.body.shippingCostEast,
    shippingCostWest: req.body.shippingCostWest,
    shippingCostCentral: req.body.shippingCostCentral,
    shippingCostNe: req.body.shippingCostNe,
    unit: req.body.unit,


  });
  // console.log(req.body)
  res.status(201).json({ success: true, product });
});
//getting single product -- api/v1/product/id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    status: "approved",
    // isArchived: false,
  }).populate("reviews.user", "name email");

  if (!product) {
    return next(new ErrorHandler("Product not found or not approved", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Update Product - api/v1/product/:id 
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id).populate("createdBy");
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const creatorInfo = {
    email: product.createdBy.email,
    name: product.createdBy.name,
  };

  // Handle main product images (S3)
  if (req.body.existingImages) {
    if (!Array.isArray(req.body.existingImages)) {
      req.body.existingImages = [req.body.existingImages];
    }
  } else {
    req.body.existingImages = [];
  }

  if (req.files && req.files.images) {
    req.body.images = req.files.images.map((file) => file.location);
  } else {
    req.body.images = [];
  }

  // Merge existing and new images
  req.body.images = [...req.body.existingImages, ...req.body.images];

  // Prepare variant updates
  let updatedVariants = product.variants ? [...product.variants] : [];

  if (req.body.variants) {
    if (!Array.isArray(req.body.variants)) {
      req.body.variants = [req.body.variants];
    }

    req.body.variants.forEach((variant, index) => {
      if (product.variants[index]) {
        updatedVariants[index] = { ...product.variants[index], ...variant };
      } else {
        updatedVariants[index] = variant;
      }
    });
  }

  // Handle variant images (S3)
  if (req.files) {
    Object.keys(req.files).forEach((key) => {
      const match = key.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const variantIndex = parseInt(match[1], 10);
        if (!Array.isArray(req.body.variants)) {
          req.body.variants = product.variants || [];
        }
        if (!req.body.variants[variantIndex]) {
          req.body.variants[variantIndex] = product.variants[variantIndex] || {};
        }

        // Merge existing images with new images
        const existingImages = req.body.variants[variantIndex].images || product.variants[variantIndex]?.images || [];
        const newImages = req.files[key].map((file) => file.location);
        req.body.variants[variantIndex].images = [...existingImages, ...newImages];
      }
    });
  }

  req.body.variants = updatedVariants;

  // Merge req.body with existing product data
  const updatedData = { ...product.toObject() };

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== "undefined") {
      updatedData[key] = req.body[key];
    }
  });

  // Update product
  product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });

  // Send email notification if the status changed
  if (req.body.status && req.body.status !== product.status) {
    try {
      const statusMessage = req.body.status === "approved" ? "approved" : "rejected";
      let emailContent = `
        <h2>Your Product Update</h2>
        <p>Dear ${creatorInfo.name},</p>
        <p>Your product "${product.name}" has been ${statusMessage}.</p>
        <p>Thank you for using our platform!</p>
      `;

      if (req.body.status === "rejected" && req.body.rejectionReason) {
        emailContent += `<p>Reason for rejection: ${req.body.rejectionReason}</p>`;
      }

      await sendEmail({
        fromEmail: "glocre@glocre.com",
        email: creatorInfo.email,
        subject: `Product ${statusMessage}`,
        html: emailContent,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }
  }
});

//Delete product - api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "product Deleted!",
  });
});

//Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user.id,
    rating: Number(rating), // Ensure rating is stored as a number
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if user already reviewed the product
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    // Update existing review
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user.id.toString()) {
        r.rating = review.rating;
        r.comment = review.comment;
      }
    });
  } else {
    // Add new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isReviewed ? "Review updated" : "Review added",
  });
});

//Get Reviews - api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate(
    "reviews.user",
    "name email"
  );

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  //filtering the reviews which does match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  //number of reviews
  const numOfReviews = reviews.length;

  //finding the average with the filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 10; // Adjust results per page as needed

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search() // Handles search (e.g., by product name or ID)
    .filter() // Handles filtering (e.g., by category, price range)
    .paginate(resPerPage); // Paginates the results

  const products = await apiFeatures.query;
  const totalProductsCount = await Product.countDocuments();

  res.status(200).json({
    success: true,
    totalProductsCount,
    resPerPage,
    products,
  });
});

// seller Controller
exports.getSellerProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 10;

  const apiFeatures = new APIFeatures(
    Product.find({
      createdBy: req.user.id,
      isArchived: false,
    }).lean(), // Improves performance by returning plain objects
    req.query
  )
    .search()   // Handles search (e.g., by product name or ID)
    .filter()   // Handles filtering (e.g., by category, price range)
    .paginate(resPerPage); // Apply pagination

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    resPerPage,
    products,
  });
});

exports.getArchiveProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 10;
  const apiFeatures = new APIFeatures(
    Product.find({
      createdBy: req.user.id,
      isArchived: true
    }),
    req.query
  )
    .search() // Handles search (e.g., by product name or ID)
    .filter() // Handles filtering (e.g., by category, price range)
    .paginate(resPerPage);
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    resPerPage,
    products,
  });
});

// Add a new product
exports.addSellerProduct = catchAsyncError(async (req, res, next) => {
  const { maincategory, category, subcategory } = req.body;

  if (
    !categoryHierarchy[maincategory] ||
    !categoryHierarchy[maincategory][category] ||
    (categoryHierarchy[maincategory][category].length > 0 &&
      !categoryHierarchy[maincategory][category].includes(subcategory))
  ) {
    return res.status(400).json({ message: "Invalid category selection." });
  }
  // Process variant images
  if (req.files) {
    Object.keys(req.files).forEach((key) => {
      const match = key.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const variantIndex = parseInt(match[1], 10);
        if (req.body.variants[variantIndex]) {
          req.body.variants[variantIndex].images = req.files[key].map((file) => file.location);
        }
      }
    });
  }

  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    maincategory: req.body.maincategory,
    category: req.body.category,
    subcategory: req.body.subcategory,
    fssai: req.body.fssai,
    brand: req.body.brand,
    condition: req.body.condition,
    tax: req.body.tax,
    keyPoints: req.body.keyPoints,
    images: req.files.images ? req.files.images.map(file => file.location) : [],
    variants: req.body.variants,
    createdBy: req.user.id,
    isRefundable: req.body.isRefundable === "true",
    price: req.body.price,
    offPrice: req.body.offPrice,
    stock: req.body.stock,
    itemModelNum: req.body.itemModelNum,
    sku: req.body.sku,
    upc: req.body.upc,
    hsn: req.body.hsn,
    countryofOrgin: req.body.countryofOrgin,
    manufactureDetails: req.body.manufactureDetails,
    productCertifications: req.body.productCertifications,
    itemLength: req.body.itemLength,
    itemHeight: req.body.itemHeight,
    itemWeight: req.body.itemWeight,
    itemWidth: req.body.itemWidth,
    moq: req.body.moq,
    shippingCostlol: req.body.shippingCostlol,
    shippingCostNorth: req.body.shippingCostNorth,
    shippingCostSouth: req.body.shippingCostSouth,
    shippingCostEast: req.body.shippingCostEast,
    shippingCostWest: req.body.shippingCostWest,
    shippingCostCentral: req.body.shippingCostCentral,
    shippingCostNe: req.body.shippingCostNe,
    unit: req.body.unit,
  });

  res.status(201).json({
    success: true,
    product
  });
  try {
    const adminEmail = process.env.ADMIN_EMAIL; // Ensure you have the admin email in your environment variables
    const creatorInfo = {
      email: req.user.email,
      name: req.user.name,
    };
    const emailContent = `
      <h2>New Product Added</h2>
      <p>Dear ${creatorInfo.name},</p>
      <p>Your product "${product.name}" has been added and is now pending approval.</p>
      <p>Thank you for using our platform!</p>
    `;

    // Send email to user
    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: creatorInfo.email,
      subject: "New Product Added",
      html: emailContent,
    });

    // Send email to admin
    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: adminEmail,
      subject: "New Product Added",
      html: `
        <h2>New Product Added</h2>
        <p>Dear Admin,</p>
        <p>The product "${product.name}" has been added by ${creatorInfo.name} and is now pending approval.</p>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
});
// Update a product (only if it belongs to the seller)
exports.updateSellerProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id).populate("createdBy");

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const creatorInfo = {
    email: product.createdBy.email,
    name: product.createdBy.name,
  };

  // Handle main product images (S3)
  if (req.body.existingImages) {
    if (!Array.isArray(req.body.existingImages)) {
      req.body.existingImages = [req.body.existingImages];
    }
  } else {
    req.body.existingImages = [];
  }

  if (req.files && req.files.images) {
    req.body.images = req.files.images.map((file) => file.location);
  } else {
    req.body.images = [];
  }

  // Merge existing and new images
  req.body.images = [...req.body.existingImages, ...req.body.images];

  // Prepare variant updates
  let updatedVariants = product.variants ? [...product.variants] : [];

  if (req.body.variants) {
    if (!Array.isArray(req.body.variants)) {
      req.body.variants = [req.body.variants];
    }

    req.body.variants.forEach((variant, index) => {
      if (product.variants[index]) {
        updatedVariants[index] = { ...product.variants[index], ...variant };
      } else {
        updatedVariants[index] = variant;
      }
    });
  }

  // Handle variant images (S3)
  if (req.files) {
    Object.keys(req.files).forEach((key) => {
      const match = key.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const variantIndex = parseInt(match[1], 10);
        if (!Array.isArray(req.body.variants)) {
          req.body.variants = product.variants || [];
        }
        if (!req.body.variants[variantIndex]) {
          req.body.variants[variantIndex] = product.variants[variantIndex] || {};
        }

        // Merge existing images with new images
        const existingImages = req.body.variants[variantIndex].images || product.variants[variantIndex]?.images || [];
        const newImages = req.files[key].map((file) => file.location);
        req.body.variants[variantIndex].images = [...existingImages, ...newImages];
      }
    });
  }

  req.body.variants = updatedVariants;

  // Merge existing with updated data
  const updatedData = {
    ...product.toObject(),
    ...req.body,
    status: "pending",
  };

  // Save updated product
  product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });

  // Send notification emails
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailContent = `
      <h2>Product Update Notification</h2>
      <p>Dear ${creatorInfo.name},</p>
      <p>Your product "${product.name}" has been updated and is now pending approval.</p>
    `;

    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: creatorInfo.email,
      subject: "Product Update Notification",
      html: emailContent,
    });

    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: adminEmail,
      subject: "Product Update Notification",
      html: `
        <h2>Product Update Notification</h2>
        <p>Dear Admin,</p>
        <p>The product "${product.name}" has been updated by ${creatorInfo.name} and is now pending approval.</p>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
});

// Get a product (only if it belongs to the seller)
exports.getSellerSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
    // isArchived: false,
  })
    .populate("reviews.user", "name email")
    .populate("createdBy", "name");
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Clone a product - api/v1/product/clone/:id
exports.cloneProduct = catchAsyncError(async (req, res, next) => {
  // Find the product to be cloned
  const productToClone = await Product.findById(req.params.id);

  if (!productToClone) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Create a new product with the same details
  const clonedProduct = new Product({
    name: `${productToClone.name} (Copy)`,
    description: productToClone.description,
    maincategory: productToClone.maincategory,
    category: productToClone.category,
    subcategory: productToClone.subcategory,
    brand: productToClone.brand,
    condition: productToClone.condition,
    tax: productToClone.tax,
    keyPoints: productToClone.keyPoints,
    images: productToClone.images,
    variants: productToClone.variants,
    createdBy: req.user.id,
    isRefundable: productToClone.isRefundable,
    price: productToClone.price,
    offPrice: productToClone.offPrice,
    stock: productToClone.stock,
    itemModelNum: productToClone.itemModelNum,
    sku: productToClone.sku,
    upc: productToClone.upc,
    hsn: productToClone.hsn,
    countryofOrgin: productToClone.countryofOrgin,
    manufactureDetails: productToClone.manufactureDetails,
    productCertifications: productToClone.productCertifications,
    itemLength: productToClone.itemLength,
    itemHeight: productToClone.itemHeight,
    itemWeight: productToClone.itemWeight,
    itemWidth: productToClone.itemWidth,
    moq: productToClone.moq,
    shippingCostlol: productToClone.shippingCostlol,
    shippingCostNorth: productToClone.shippingCostNorth,
    shippingCostSouth: productToClone.shippingCostSouth,
    shippingCostEast: productToClone.shippingCostEast,
    shippingCostWest: productToClone.shippingCostWest,
    shippingCostCentral: productToClone.shippingCostCentral,
    shippingCostNe: productToClone.shippingCostNe,
    unit: productToClone.unit,
    status: "pending", // Set status to pending for the cloned product
  });

  // Save the cloned product to the database
  await clonedProduct.save();

  res.status(201).json({
    success: true,
    product: clonedProduct,
  });
});
// Archive a product
exports.archiveProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product.isArchived = true;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product archived successfully",
  });
});

// Unarchive a product
exports.unarchiveProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product.isArchived = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product unarchived successfully",
  });
});

// get category and subcategory 
exports.getCategoryHierarchy = (req, res) => {
  res.status(200).json(categoryHierarchy);
};

exports.getAvailableCategories = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" }).select("maincategory category subcategory -_id");

    const usedMain = new Set();
    const usedCat = new Set();
    const usedSub = new Set();

    for (let p of products) {
      if (p.maincategory) usedMain.add(p.maincategory.trim());
      if (p.category) usedCat.add(p.category.trim());
      if (p.subcategory) usedSub.add(p.subcategory.trim());
    }

    const result = [];

    for (const [mainName, categories] of Object.entries(categoryHierarchy)) {
      if (!usedMain.has(mainName.trim())) continue;

      const filteredSubcategories = [];

      for (const [catName, subcats] of Object.entries(categories)) {
        if (!usedCat.has(catName.trim())) continue;

        const validSubcats = subcats.filter((sub) => usedSub.has(sub.trim()));
        if (validSubcats.length) {
          filteredSubcategories.push({
            category: catName.trim(),
            subcategories: validSubcats,
          });
        }
      }

      if (filteredSubcategories.length) {
        result.push({
          maincategory: mainName.trim(),
          categories: filteredSubcategories,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.deleteProductImage = catchAsyncError(async (req, res, next) => {
  const { imageUrl, variantId } = req.body;
  const productId = req.params.id;

  console.log("Image URL:", imageUrl);

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Extract the image key from the URL (everything after .com/)
  const imageKey = imageUrl.split('.com/')[1];
  if (!imageKey) {
    return next(new ErrorHandler('Invalid image URL', 400));
  }

  // Delete image from S3
  await s3.deleteObject({
    Bucket: 'glocreawsimagebucket',
    Key: imageKey
  }).promise();

  if (variantId) {
    // Delete image from variant
    const variant = product.variants.id(variantId);
    if (!variant) {
      return next(new ErrorHandler('Variant not found', 404));
    }

    variant.images = variant.images.filter(img => img !== imageUrl);
  } else {
    // Delete image from main product images
    product.images = product.images.filter(img => img !== imageUrl);
  }

  await product.save();

  res.status(200).json({ success: true, message: 'Image deleted successfully' });
});
