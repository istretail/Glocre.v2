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
  // console.log(req.body)
  const resPerPage = 100;

  let limit = parseInt(req.query.limit);
  if (isNaN(limit) || limit <= 0) {
    limit = resPerPage;
  }

  let buildQuery = () => {
    return new APIFeatures(
      Product.find({
        $and: [
          { status: "approved" },
          {
            $or: [
              { isArchived: { $exists: false } },
              { isArchived: false }
            ]
          }
        ]
      }),
      req.query
    )
      .search()
      .filter();
  };

  const filteredProductsCount = await buildQuery().query.countDocuments({});
  const totalProductsCount = await Product.countDocuments({
    $and: [
      { status: "approved" },
      {
        $or: [
          { isArchived: { $exists: false } },
          { isArchived: false }
        ]
      }
    ]
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
  // Attach variant images from req.files
  // console.log("Request Body:", req.body)
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

  // Validate image requirement
  const variants = req.body.variants;

  if (variants && Array.isArray(variants) && variants.length > 0) {
    // If product has variants, ensure each variant has images
    const invalidVariant = variants.find(
      (variant) => !variant.images || variant.images.length === 0
    );

    if (invalidVariant) {
      return res.status(400).json({
        success: false,
        message: "Each variant must have at least one image.",
      });
    }
  } else {
    // If product has no variants, ensure main product images are present
    const mainImages = req.files.images;
    if (!mainImages || mainImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required ",
      });
    }
  }
try{
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
    additionalShippingCost: req.body.additionalShippingCost,
    unit: req.body.unit,
  });

  res.status(201).json({ success: true, product });
  } catch (error) {
  console.error("Product creation error:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists.`,
        
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
  }
  

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
  // console.log("received variant body:", req.body);

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

  // Merge existing and new images for the main product
  req.body.images = [...req.body.existingImages, ...req.body.images];

  // Prepare variant updates
  // let updatedVariants = [];

  if (
    req.body.variants &&
    typeof req.body.variants === "object" &&
    !Array.isArray(req.body.variants)
  ) {
    // Convert object with numeric keys like '0', '1' to array
    const variantArray = Object.keys(req.body.variants)
      .filter((key) => !isNaN(key)) // only process numeric keys
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => req.body.variants[key])
      .filter((v) => typeof v === "object" && v !== null); // ensure valid objects

    req.body.variants = variantArray;
  }


  if (Array.isArray(req.body.variants)) {
    req.body.variants.forEach((variant, index) => {
      const existingImages = Array.isArray(variant.existingImages)
        ? variant.existingImages
        : [variant.existingImages].filter(Boolean);
      const currentImages = Array.isArray(variant.images)
        ? variant.images
        : [variant.images].filter(Boolean);

      req.body.variants[index].images = [...new Set([...existingImages, ...currentImages])];
      delete req.body.variants[index].existingImages;
    });
  }

  // ✅ Now safe to calculate updatedVariants:
  let updatedVariants = [];

  if (Array.isArray(req.body.variants)) {
    updatedVariants = req.body.variants.map((variant, index) => {
      if (product.variants[index]) {
        return { ...product.variants[index]._doc, ...variant };
      } else {
        return variant;
      }
    });
  }
  console.log(updatedVariants)
  const hasVariants = Array.isArray(req.body.variants) && req.body.variants.length > 0;

  if (hasVariants) {
    const missingImagesVariantIndex = req.body.variants.findIndex(
      (variant) => !variant.images || !Array.isArray(variant.images) || variant.images.length === 0
    );

    if (missingImagesVariantIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: `Images are required for variant `,
      });
    }
  } else {
    if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images are required for the product.",
      });
    }
  }
  // Handle variant images (S3)
  if (req.files && Array.isArray(req.body.variants)) {
    Object.keys(req.files).forEach((key) => {
      const match = key.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const variantIndex = parseInt(match[1], 10);

        // Ensure the variant object exists
        if (!req.body.variants[variantIndex]) {
          req.body.variants[variantIndex] = {};
        }

        // Merge existing images with new images
        const existingImages =
          req.body.variants[variantIndex].existingImages ||
          product.variants?.[variantIndex]?.images ||
          [];
        const newImages = req.files[key].map((file) => file.location);

        // Combine existing and new images into the `images` array
        req.body.variants[variantIndex].images = [...existingImages, ...newImages];
      }
    });
  }

  // Ensure `images` contains both existing and new images for all variants
  req.body.variants.forEach((variant, index) => {
    // Convert to array if existingImages is a string
    let existingImages = variant.existingImages || [];
    if (typeof existingImages === "string") {
      existingImages = [existingImages];
    }

    // Ensure images is always an array
    let currentImages = variant.images || [];
    if (typeof currentImages === "string") {
      currentImages = [currentImages];
    }

    // Merge and deduplicate
    req.body.variants[index].images = [...new Set([...existingImages, ...currentImages])];
  });



  req.body.variants = updatedVariants;

  // console.log("updated variants:", req.body.variants);

  // Merge req.body with existing product data
  const updatedData = { ...product.toObject() };

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== "undefined") {
      updatedData[key] = req.body[key];
    }
  });

  // Update product
  try {
    product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists.`,
      });
    }
    
  }




  // Send email notification if the status changed
  if (req.body.status && req.body.status !== product.status) {
    try {
      const statusMessage = req.body.status === "approved" ? "approved" : "rejected";
      let emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
          <div style="text-align: center;">
            <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Logo" style="max-width: 180px; margin-bottom: 20px;" />
          </div>

          <h2 style="color: #2f4d2a;">Product Status Update</h2>

          <p style="color: #8c8c8c;">Dear ${creatorInfo.name},</p>
          <p style="color: #8c8c8c;">
            Your product <strong>"${product.name}"</strong> has been <strong>${statusMessage}</strong>.
          </p>
          <p style="color: #8c8c8c;">Thank you for using <strong>GLOCRE</strong> to showcase your product!</p>

          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #8c8c8c;">
            <em>This is an auto-generated email. Please do not reply. For queries, contact <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
          </p>
        </div>
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
  const product = await Product.findOne({ clocreProductId: req.query.id }).populate(
    "reviews.user",
    "name email"
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

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
  const resPerPage = 10;

  const totalProductsCount = await Product.countDocuments();

  const apiFeaturesForCount = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  const filteredProducts = await apiFeaturesForCount.query;
  const filteredProductsCount = filteredProducts.length;

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .paginate(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    totalProductsCount,
    filteredProductsCount,
    resPerPage,
    products,
  });
});


// seller Controller
exports.getSellerProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 10;

  // 1. Total products created by seller (excluding archived)
  const totalProductsCount = await Product.countDocuments({
    createdBy: req.user.id,
    isArchived: false,
  });

  // 2. Apply search and filters, but not pagination yet
  const apiFeaturesForCount = new APIFeatures(
    Product.find({
      createdBy: req.user.id,
      isArchived: false,
    }).lean(),
    req.query
  )
    .search()
    .filter();

  const filteredProducts = await apiFeaturesForCount.query;
  const filteredProductsCount = filteredProducts.length;

  // 3. Apply pagination
  const apiFeatures = new APIFeatures(
    Product.find({
      createdBy: req.user.id,
      isArchived: false,
    }).lean(),
    req.query
  )
    .search()
    .filter()
    .paginate(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    totalProductsCount,
    // filteredProductsCount,
    resPerPage,
    count: filteredProductsCount,
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
  // const { maincategory, category, subcategory } = req.body;
// console.log("Received body:", req.body);
  // if (
  //   !categoryHierarchy[maincategory] ||
  //   !categoryHierarchy[maincategory][category] ||
  //   (categoryHierarchy[maincategory][category].length > 0 &&
  //     !categoryHierarchy[maincategory][category].includes(subcategory))
  // ) {
  //   return res.status(400).json({ message: "Invalid category selection." });
  // }
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
  const variants = req.body.variants;

  if (variants && Array.isArray(variants) && variants.length > 0) {
    // If product has variants, ensure each variant has images
    const invalidVariant = variants.find(
      (variant) => !variant.images || variant.images.length === 0
    );

    if (invalidVariant) {
      return res.status(400).json({
        success: false,
        message: "Each variant must have at least one image.",
      });
    }
  } else {
    // If product has no variants, ensure main product images are present
    const mainImages = req.files.images;
    if (!mainImages || mainImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required ",
      });
    }
  }

  try {
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
      additionalShippingCost: req.body.additionalShippingCost,
      unit: req.body.unit,
    });

    res.status(201).json({
      success: true,
      product
    });
    const adminEmail = process.env.ADMIN_EMAIL; // Ensure you have the admin email in your environment variables
    const creatorInfo = {
      email: req.user.email,
      name: req.user.name,
    };
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
      <div style="text-align: center;">
        <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Banner" style="width: 100%; max-width: 600px; margin-bottom: 20px;" />
      </div>
  
      <h2 style="color: #2f4d2a;">New Product Added</h2>
  
      <p style="color: #8c8c8c;">Dear ${creatorInfo.name},</p>
      <p style="color: #8c8c8c;">
        Your product <strong>"${product.name}"</strong> has been successfully added and is currently <strong>pending approval</strong>.
      </p>
      <p style="color: #8c8c8c;">Thank you for contributing to the <strong>GLOCRE</strong> platform!</p>
  
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #8c8c8c;">
        <em>This is an auto-generated email. Please do not reply. For any queries, contact us at <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
      </p>
    </div>
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
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
    <div style="text-align: center;">
      <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Admin Alert" style="width: 100%; max-width: 600px; margin-bottom: 20px;" />
    </div>

    <h2 style="color: #2f4d2a;">New Product Submitted for Approval</h2>

    <p style="color: #8c8c8c;">Dear Admin,</p>
    <p style="color: #8c8c8c;">
      A new product titled <strong>"${product.name}"</strong> has been added by <strong>${creatorInfo.name}</strong> and is currently <strong>pending approval</strong>.
    </p>

    <p style="color: #8c8c8c;">Please review and approve the product in the admin dashboard.</p>

    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated email from <strong>GLOCRE</strong>. Please do not reply.</em>
    </p>
  </div>
`,

    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
});
// Update a product (only if it belongs to the seller)
exports.updateSellerProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.body)

  let product = await Product.findById(req.params.id).populate("createdBy");
  // console.log(req.params.id)
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

  // Merge existing and new images for the main product
  req.body.images = [...req.body.existingImages, ...req.body.images];

  // Prepare variant updates
  // let updatedVariants = [];

  if (
    req.body.variants &&
    typeof req.body.variants === "object" &&
    !Array.isArray(req.body.variants)
  ) {
    // Convert object with numeric keys like '0', '1' to array
    const variantArray = Object.keys(req.body.variants)
      .filter((key) => !isNaN(key)) // only process numeric keys
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => req.body.variants[key])
      .filter((v) => typeof v === "object" && v !== null); // ensure valid objects

    req.body.variants = variantArray;
  }


  if (Array.isArray(req.body.variants)) {
    req.body.variants.forEach((variant, index) => {
      const existingImages = Array.isArray(variant.existingImages)
        ? variant.existingImages
        : [variant.existingImages].filter(Boolean);
      const currentImages = Array.isArray(variant.images)
        ? variant.images
        : [variant.images].filter(Boolean);

      req.body.variants[index].images = [...new Set([...existingImages, ...currentImages])];
      delete req.body.variants[index].existingImages;
    });
  }

  // ✅ Now safe to calculate updatedVariants:
  let updatedVariants = [];

  if (Array.isArray(req.body.variants)) {
    updatedVariants = req.body.variants.map((variant, index) => {
      if (product.variants[index]) {
        return { ...product.variants[index]._doc, ...variant };
      } else {
        return variant;
      }
    });
  }
  const hasVariants = Array.isArray(req.body.variants) && req.body.variants.length > 0;

  if (hasVariants) {
    const missingImagesVariantIndex = req.body.variants.findIndex(
      (variant) => !variant.images || !Array.isArray(variant.images) || variant.images.length === 0
    );

    if (missingImagesVariantIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: `Images are required for variant `,
      });
    }
  } else {
    if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images are required for the product.",
      });
    }
  }
  // Handle variant images (S3)
  if (req.files && Array.isArray(req.body.variants)) {
    Object.keys(req.files).forEach((key) => {
      const match = key.match(/variants\[(\d+)\]\[images\]/);
      if (match) {
        const variantIndex = parseInt(match[1], 10);

        // Ensure the variant object exists
        if (!req.body.variants[variantIndex]) {
          req.body.variants[variantIndex] = {};
        }

        // Merge existing images with new images
        const existingImages =
          req.body.variants[variantIndex].existingImages ||
          product.variants?.[variantIndex]?.images ||
          [];
        const newImages = req.files[key].map((file) => file.location);

        // Combine existing and new images into the `images` array
        req.body.variants[variantIndex].images = [...existingImages, ...newImages];
      }
    });
  }

  // Ensure `images` contains both existing and new images for all variants
  req.body.variants.forEach((variant, index) => {
    // Convert to array if existingImages is a string
    let existingImages = variant.existingImages || [];
    if (typeof existingImages === "string") {
      existingImages = [existingImages];
    }

    // Ensure images is always an array
    let currentImages = variant.images || [];
    if (typeof currentImages === "string") {
      currentImages = [currentImages];
    }

    // Merge and deduplicate
    req.body.variants[index].images = [...new Set([...existingImages, ...currentImages])];
  });



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
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
    <div style="text-align: center;">
      <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Product Update" style="width: 100%; max-width: 600px; margin-bottom: 20px;" />
    </div>

    <h2 style="color: #2f4d2a;">Product Update Notification</h2>

    <p style="color: #8c8c8c;">Dear ${creatorInfo.name},</p>
    <p style="color: #8c8c8c;">
      Your product <strong>"${product.name}"</strong> has been updated and is now <strong>pending approval</strong>.
    </p>

    <p style="color: #8c8c8c;">Thank you for being a valued part of <strong>GLOCRE</strong>.</p>

    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated email. Please do not reply. For queries, contact us at <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
    </p>
  </div>
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
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
    <div style="text-align: center;">
      <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Admin Notification" style="width: 100%; max-width: 600px; margin-bottom: 20px;" />
    </div>

    <h2 style="color: #2f4d2a;">Product Update Notification</h2>

    <p style="color: #8c8c8c;">Dear Admin,</p>
    <p style="color: #8c8c8c;">
      The product <strong>"${product.name}"</strong> has been updated by <strong>${creatorInfo.name}</strong> and is currently <strong>pending approval</strong>.
    </p>

    <p style="color: #8c8c8c;">Please review the updated product in the admin dashboard.</p>

    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated email from <strong>GLOCRE</strong>. Please do not reply.</em>
    </p>
  </div>
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
    const products = await Product.find({
      status: "approved",
      isArchived: { $ne: true, $exists: true } // isArchived must exist AND not be true
    }).select("maincategory category subcategory -_id");

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

  // console.log("Image URL:", imageUrl);

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


// Validate cart items before checkout
exports.validateCartItems = catchAsyncError(async (req, res) => {
  try {
    const { cartItems } = req.body;
    // console.log("Request cart",cartItems);
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const updatedCart = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      // Check if item has a variant
      let variantData = null;
      if (item.variant && item.variant._id) {
        variantData = product.variants.find(
          (v) => v._id.toString() === item.variant._id
        );
        if (!variantData) continue;
      }

      const isVariant = Boolean(variantData);

      updatedCart.push({
        _id: item._id,
        product: product._id,
        name: product.name + (isVariant ? ` (${variantData.variantName})` : ''),
        price: isVariant ? variantData.offPrice : product.offPrice,
        stock: isVariant ? variantData.stock : product.stock,
        image: isVariant
          ? variantData.images?.[0]
          : product.images?.[0],
        quantity: item.quantity,
        tax: product.tax,
        shippingCostlol: product.shippingCostlol,
        shippingCostNorth: product.shippingCostNorth,
        shippingCostSouth: product.shippingCostSouth,
        shippingCostEast: product.shippingCostEast,
        shippingCostWest: product.shippingCostWest,
        shippingCostCentral: product.shippingCostCentral,
        shippingCostNe: product.shippingCostNe,
        additionalShippingCost: product.additionalShippingCost,
        createdBy: product.createdBy,
        isArchived: product.isArchived,
        status: product.status,
        ...(isVariant && {
          variant: {
            _id: variantData._id,
            variantType: variantData.variantType,
            variantName: variantData.variantName,
            price: variantData.price,
            offPrice: variantData.offPrice,
            stock: variantData.stock,
            images: variantData.images,
          },
        }),
      });
    }
    // console.log('Updated cart:', updatedCart);
    return res.status(200).json({
      success: true,
      cartItems: updatedCart,

    }
    );



  } catch (error) {
    console.error('Cart validation error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});


