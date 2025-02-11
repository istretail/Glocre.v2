const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const { generateToken } = require("../utils/token");
const twilio = require("twilio");
const Product = require("../models/productModel");
const OTP_VALIDITY_DURATION = 10 * 60 * 1000; // 10 minutes
const APIFeatures = require("../utils/apiFeatures"); // Adjust the path as necessary
const mongoose = require("mongoose");
//register user --/api/v1/Register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, lastName, email, password } = req.body;
  let avatar;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  let BASE_URL1 = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL1 = `${req.protocol}://${req.get("host")}`;
  }
  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  // Generate email verification token
  const emailToken = crypto.randomBytes(20).toString("hex");
  const verificationLink = `${BASE_URL1}/verify-email/${emailToken}`;
  const htmlMessage = `
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
        <img src='https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg' alt="logo" style="width: 100%; height: auto;">
        <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="font-size: 24px; margin: 0;">Email Verification</h2>
            <p style="font-size: 16px; color: #555;">
                Please click the button below to verify your email:
            </p>
            <a href="${verificationLink}" style="
                display: inline-block; 
                padding: 10px 20px; 
                margin-top: 10px; 
                background-color: #1b6763; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;">
                Verify Your Email
            </a>
        </div>
    </div>
`;

  try {
    // Create the user document with email verification token
    const user = await User.create({
      name,
      lastName,
      email,
      password,
      avatar,
      verifyEmailToken: emailToken, // Set the email verification token
      verifyEmailTokenExpire: Date.now() + 30 * 60 * 1000, // Token expires in 30 minutes
      isVerified: false,
    });

    // Send email verification link to the user
    await sendEmail({
      email,
      subject: "Email Verification",
      html: htmlMessage,
    });

    res.status(201).json({
      success: true,
      message:
        "Verification email sent. Please verify your email to complete registration.",
    });
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    } else {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
});

// Endpoint to handle email verification
exports.verifyEmail = catchAsyncError(async (req, res, next) => {
  // Hash the token from the request parameters (if needed)
  // const verifyEmailToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // Find user by email verification token
  const user = await User.findOne({ verifyEmailToken: req.params.token });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  // Check if the token has expired
  if (user.verifyEmailTokenExpire < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Email verification token has expired.",
    });
  }

  // Mark user as verified and clear email verification token
  user.isVerified = true;
  user.verifyEmailToken = undefined;
  user.verifyEmailTokenExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
});

//Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Find the user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Check if the user is verified
  if (!user.isVerified) {
    return next(
      new ErrorHandler("Please verify your email before logging in", 400)
    );
  }

  // Check if the entered password is correct
  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // If all checks pass, send the authentication token
  sendToken(user, 201, res);
});

//logout User - /api/v1/logout
exports.logoutUser = (req, res, next) => {
  // Clearing the token cookie
  res.clearCookie("token", {
    httpOnly: true,
  });

  // Sending a success response
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  let BASE_URL = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  //Create reset url
  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

  const message = `<p>Your password reset url is as follows:
    </p> <a href="${resetUrl}">${resetUrl} </a><p>If you have not requested this email, then ignore it.</p>`;

  try {
    sendEmail({
      email: user.email,
      subject: "Password Recovery",
      html: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message), 500);
  }
});
//Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or expired"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
});

//Get User Profile - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Change Password  - api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  //check old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }
  //assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

//Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  // Handle avatar upload
  let avatar;
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    newUserData.avatar = avatar;
  }

  // Check if seller-related fields are provided
  const isSellerApplication =
    req.body.gstNumber ||
    req.body.businessName ||
    req.body.businessEmail ||
    req.body.businessContactNumber ||
    req.body.businessAddress;

  if (isSellerApplication) {
    newUserData = {
      ...newUserData,
      gstNumber: req.body.gstNumber,
      businessName: req.body.businessName,
      businessEmail: req.body.businessEmail,
      businessContactNumber: req.body.businessContactNumber,
      businessAddress: req.body.businessAddress,
      isSeller: req.body.isSeller === true ? true : false, // Set isSeller to false by default, unless it's already true
    };

    const adminEmail = process.env.ADMIN_EMAIL || "atpldesign04@outlook.com"; // Admin email
    const userEmail = req.body.email; // User's email address

    // Admin email content
    const adminSubject = "New Seller Application";
    const adminBody = `
            <p>A user has applied to become a seller. Here are the details:</p>
            <ul>
                <li><strong>Name:</strong> ${req.body.name}</li>
                <li><strong>Last Name:</strong> ${req.body.lastName}</li>
                <li><strong>Email:</strong> ${req.body.email}</li>
                <li><strong>GST Number:</strong> ${req.body.gstNumber}</li>
                <li><strong>Business Name:</strong> ${req.body.businessName}</li>
                <li><strong>Business Email:</strong> ${req.body.businessEmail}</li>
                <li><strong>Contact Number:</strong> ${req.body.businessContactNumber}</li>
                <li><strong>Business Address:</strong> ${req.body.businessAddress}</li>
            </ul>
        `;

    // User email content
    const userSubject = "Application Received";
    const userBody = `
            <p>Dear ${req.body.name} ${req.body.lastName},</p>
            <p>Thank you for applying to become a supplier. We have received your application and will review it shortly. Here are the details you provided:</p>
            <ul>
                <li><strong>GST Number:</strong> ${req.body.gstNumber}</li>
                <li><strong>Business Name:</strong> ${req.body.businessName}</li>
                <li><strong>Business Email:</strong> ${req.body.businessEmail}</li>
                <li><strong>Contact Number:</strong> ${req.body.businessContactNumber}</li>
                <li><strong>Business Address:</strong> ${req.body.businessAddress}</li>
            </ul>
            <p>We will notify you once your application has been reviewed.</p>
            <p>Best regards,<br>Team Glocre</p>
        `;

    try {
      // Send email to admin
      await sendEmail({
        email: adminEmail, // Use 'email' field
        subject: adminSubject,
        html: adminBody, // HTML content
      });

      // Send email to user
      await sendEmail({
        email: userEmail, // User's email address
        subject: userSubject,
        html: userBody, // HTML content
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to send application emails.", 500));
    }
  }

  // Update the user in the database
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const resPerPage = 10; // Number of results per page, adjust as needed
  const apiFeatures = new APIFeatures(User.find(), req.query)
    .search() // Handles search by name
    .filter() // Handles filtering based on role or other fields
    .paginate(resPerPage); // Paginates the results

  const users = await apiFeatures.query;
  const count = await User.countDocuments();
  res.status(200).json({
    success: true,
    count,
    resPerPage,
    users,
  });
});

//Admin: Get Specific User - api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Update User - api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
  };

  // If the role is changed to 'seller', set isSeller to true
  if (req.body.role === "seller") {
    newUserData.isSeller = true;
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  await user.remove();
  res.status(200).json({
    success: true,
  });
});

//    POST /api/users/savedAddresses
exports.createSavedAddress = catchAsyncError(async (req, res, next) => {
  // Fetching Twilio credentials from environment variables
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
    process.env;
  const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  // Getting the logged-in user's ID and fetching user details
  const userId = req.user.id;
  const user = await User.findById(userId);

  // If user doesn't exist, return error
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the address already exists in the user's saved addresses
  const existingAddress = user.savedAddress.find(
    (address) =>
      address.address.toLowerCase() === req.body.address.toLowerCase() &&
      address.addressLine.toLowerCase() ===
        req.body.addressLine.toLowerCase() &&
      address.city.toLowerCase() === req.body.city.toLowerCase() &&
      parseInt(address.phoneNo) === parseInt(req.body.phoneNo) &&
      parseInt(address.postalCode) === parseInt(req.body.postalCode) &&
      address.country.toLowerCase() === req.body.country.toLowerCase() &&
      address.state.toLowerCase() === req.body.state.toLowerCase()
  );

  // If the address already exists
  if (existingAddress) {
    // Check if the phone verification has expired
    if (
      existingAddress.isPhoneVerified &&
      Date.now() > existingAddress.phoneVerifiedExpire
    ) {
      existingAddress.isPhoneVerified = false;
      await user.save();
    }

    // If the phone verification is required
    if (
      !existingAddress.isPhoneVerified ||
      Date.now() > existingAddress.otpExpire
    ) {
      // OTP verification needed - send OTP if phone is not verified or if 24 hours expired
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpire = Date.now() + OTP_VALIDITY_DURATION;

      // Send OTP to the user's phone number
      await client.messages.create({
        body: `Your OTP code is ${otpCode}`,
        to: req.body.phoneNo,
        from: TWILIO_PHONE_NUMBER,
      });

      // Update the existing address with a new OTP and expiration time
      existingAddress.otpCode = otpCode;
      existingAddress.otpExpire = otpExpire;
      existingAddress.isPhoneVerified = false; // Reset phone verification to false
      existingAddress.phoneVerifiedExpire =
        Date.now() +
        parseInt(process.env.PHONE_VERIFIED_DURATION) * 24 * 60 * 60 * 1000; // 24 * 60 * 60 * 1000 Set 24 hours expiration for phone verification

      await user.save();

      return res.status(200).json({
        success: true,
        message: "OTP sent to your phone. Please verify within 10 minutes.",
        data: { addressId: existingAddress._id, otpCode },
      });
    }

    // If phone is already verified and still within the 24-hour validity
    return res.status(200).json({
      success: true,
      message: "Address is already verified and saved.",
      data: existingAddress,
    });
  }

  // If the address doesn't exist, create a new address
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = Date.now() + OTP_VALIDITY_DURATION; // OTP validity duration (e.g., 10 minutes)

  // Send OTP to the user's phone number
  await client.messages.create({
    body: `Your OTP code is ${otpCode}`,
    to: req.body.phoneNo,
    from: TWILIO_PHONE_NUMBER,
  });

  // Generate a unique address ID for the new address
  const addressId = mongoose.Types.ObjectId();

  // Prepare the new address object with OTP and expiration time
  const newAddress = {
    ...req.body,
    _id: addressId, // Assigning the generated unique address ID
    otpCode,
    otpExpire,
    isPhoneVerified: false, // Initially set phone verification as false
    phoneVerifiedExpire:
      Date.now() +
      parseInt(process.env.PHONE_VERIFIED_DURATION) * 24 * 60 * 60 * 1000,
  };

  // Add the new address to the user's saved addresses array and save the user
  user.savedAddress.push(newAddress);
  await user.save();

  // Respond with a success message and the OTP data
  res.status(201).json({
    success: true,
    message: "OTP sent to your phone. Please verify within 10 minutes.",
    data: { addressId, otpCode },
  });
});

exports.verifyAddressOtp = catchAsyncError(async (req, res, next) => {
  const { addressId, otpCode } = req.body; // Destructure addressId and otpCode
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Find the address by _id (Make sure you're accessing addressId as a string, and not as an object)
  const address = user.savedAddress.find(
    (addr) => addr._id.toString() === addressId
  ); // Use .toString() to compare ObjectId with string

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  // Check if OTP matches and is within the validity period
  const currentTime = Date.now();
  if (address.otpCode === otpCode && currentTime < address.otpExpire) {
    address.isPhoneVerified = true;
    address.otpCode = undefined;
    address.otpExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
      data: address,
    });
  } else {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }
});

//    PUT /api/v1/users/savedAddresses/:id
exports.updateSavedAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const savedAddressIndex = user.savedAddress.findIndex(
    (addr) => addr._id.toString() === req.params.id
  );
  if (savedAddressIndex === -1) {
    return next(new ErrorHandler("Saved address not found", 404));
  }

  // Validate and sanitize the data from the request body before updating the saved address
  const updatedAddressData = {
    address: req.body.address,
    addressLine: req.body.addressLine,
    city: req.body.city,
    phoneNo: req.body.phoneNo,
    postalCode: req.body.postalCode,
    country: req.body.country,
    state: req.body.state,
  };

  // Update the saved address with the sanitized data
  user.savedAddress[savedAddressIndex] = {
    ...user.savedAddress[savedAddressIndex],
    ...updatedAddressData,
  };

  // Save the user with the updated saved address
  try {
    await user.save();
    res.status(200).json({
      success: true,
      data: user.savedAddress[savedAddressIndex],
    });
  } catch (error) {
    // Handle any errors that occur during the save operation
    return next(new ErrorHandler("cannot update address", 500));
  }
});

//   DELETE /api/users/savedAddresses/:id
exports.deleteSavedAddress = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const savedAddressIndex = user.savedAddress.findIndex(
    (addr) => addr._id.toString() === req.params.id
  );
  if (savedAddressIndex === -1) {
    return next(new ErrorHandler("Saved address not found", 404));
  }

  user.savedAddress.splice(savedAddressIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Saved address deleted successfully",
  });
});

//   GET /api/v1/users/savedAddresses
exports.getAllSavedAddresses = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user.savedAddress,
  });
});

//   GET /api/v1/cart/add
exports.addToCart = catchAsyncError(async (req, res, next) => {
  const { name, quantity, image, price, stock, product } = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Convert quantity to a number
  const quantityNumber = Number(quantity);
  if (isNaN(quantityNumber) || quantityNumber <= 0) {
    return next(new ErrorHandler("Invalid quantity", 400));
  }

  // Check if the item already exists in the cart
  const existingItem = user.cart.find(
    (item) => String(item.product) === String(product)
  );

  if (existingItem) {
    // If the existing item quantity matches the stock, do not increase quantity
    if (existingItem.quantity >= stock) {
      return next(
        new ErrorHandler("Cannot add more items, stock limit reached", 400)
      );
    }

    // Calculate the new quantity ensuring it does not exceed the stock
    const newQuantity = existingItem.quantity + quantityNumber;
    existingItem.quantity = newQuantity > stock ? stock : newQuantity;
  } else {
    // If the item does not exist, add it to the cart with the provided quantity
    if (quantityNumber > stock) {
      return next(
        new ErrorHandler("Cannot add more items than available in stock", 400)
      );
    }
    user.cart.push({
      name,
      quantity: quantityNumber,
      image,
      price,
      stock,
      product,
    });
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    cart: user.cart,
  });
});

// Get cart items
exports.getCartItems = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id; //  middleware to extract user ID from request

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});

// Remove item from cart
exports.removeFromCart = catchAsyncError(async (req, res, next) => {
  const { index } = req.params;
  const userId = req.user.id; // Assuming you have middleware to extract user ID from request

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the index is valid
  if (index < 0 || index >= user.cart.length) {
    return next(new ErrorHandler("Invalid index", 400));
  }

  // Remove the item from the cart array
  user.cart.splice(index, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    cart: user.cart,
  });
});

exports.updateCartItemQuantity = catchAsyncError(async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Find the item in the cart
    const cartItemIndex = user.cart.findIndex(
      (item) => String(item.product) === productId
    );
    if (cartItemIndex === -1) {
      return next(new ErrorHandler("Item not found in cart", 404));
    }

    // Update the quantity
    user.cart[cartItemIndex].quantity = quantity;

    // Save changes
    await user.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.clearCart = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id; // Assuming you have middleware to extract user ID from request

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Clear the cart array
  user.cart = [];
  await user.save();

  res.status(200).json({
    success: true,
    message: "All items removed from cart successfully",
    cart: user.cart,
  });
});

exports.addToWishlist = catchAsyncError(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Add to wishlist if not already added
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Product added to wishlist",
          wishlist: user.wishlist,
        });
    }

    res
      .status(400)
      .json({ success: false, message: "Product already in wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

exports.removeFromWishlist = catchAsyncError(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "wishlist",
      "name price images"
    ); // Populate wishlist details
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Remove from wishlist if present
    const index = user.wishlist.findIndex(
      (item) => item._id.toString() === productId
    );
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Product not found in wishlist" });
    }

    const updatedUser = await User.findById(req.user.id).populate(
      "wishlist",
      "name price images"
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

exports.getWishlist = catchAsyncError(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
