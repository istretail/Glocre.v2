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
const axios = require('axios');

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
        <div style="max-width: 600px; margin: 40px auto; border: 1px solid #ddd; border-radius: 10px; font-family: Arial, sans-serif; overflow: hidden;">
        <div style="background-color: #ffffff;">
        <img 
        src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png"
        alt="Logo" 
        style="width: 100%; height: auto; display: block;" 
        />
        </div>
<div style="padding: 30px 20px; background-color: #f9f9f9; text-align: center;">
<h2 style="font-size: 24px; color: #333; margin: 0 0 10px;">Verify Your Email Address</h2>
<p style="font-size: 16px; color: #555; margin: 0 0 20px;">
        Thanks for signing up! Please confirm your email by clicking the button below:
</p>
<a href="${verificationLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color:rgb(223, 113, 10);
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
      ">
        Verify Email
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
      fromEmail: "donotreply@glocre.com",
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
    // Check if it's a Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0], // return only the first message
      });
    }

    // Handle duplicate email
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  
});

exports.resendVerificationEmail = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  // console.log("Request body",req.body)
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email address.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "This is a new email. Please register first.",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Your account is already verified. Please login.",
    });
  }

  // Generate a new token or reuse the existing one
  const emailToken = crypto.randomBytes(20).toString("hex");
  const BASE_URL = process.env.NODE_ENV === "production"
    ? `${req.protocol}://${req.get("host")}`
    : process.env.FRONTEND_URL;

  const verificationLink = `${BASE_URL}/verify-email/${emailToken}`;

  const htmlMessage = `
    <div style="max-width: 600px; margin: 40px auto; border: 1px solid #ddd; border-radius: 10px; font-family: Arial, sans-serif; overflow: hidden;">
    <div style="background-color: #ffffff;">
      <img 
        src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png"
        alt="Logo" 
        style="width: 100%; height: auto; display: block;" 
      />
    </div>
    <div style="padding: 30px 20px; background-color: #f9f9f9; text-align: center;">
      <h2 style="font-size: 24px; color: #333;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #555;">
        Please confirm your email by clicking the button below:
      </p>
      <a href="${verificationLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: rgb(223, 113, 10);
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
      ">
        Verify Email
      </a>
    </div>
    </div>
  `;

  // Update user with new token
  user.verifyEmailToken = emailToken;
  user.verifyEmailTokenExpire = Date.now() + 30 * 60 * 1000; // 30 mins
  await user.save();

  // Send email
  await sendEmail({
    fromEmail: "donotreply@glocre.com",
    email,
    subject: "Resend Email Verification",
    html: htmlMessage,
  });

  res.status(200).json({
    success: true,
    message: "Verification email has been resent. Please check your inbox.",
  });
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
    message: "Thankyou. Email verified successfully.",
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

  const message = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff;">
    <h2 style="color: #2f4d2a;">Password Reset Request</h2>
    <p style="color: #8c8c8c;">
      Your password reset link is below:
    </p>
    <p>
      <a href="${resetUrl}" style="color: #ffaf63; word-break: break-all;">${resetUrl}</a>
    </p>
    <p style="color: #8c8c8c;">
      If you did not request this change, you can safely ignore this email.
    </p>
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated email. Please do not reply. For help, contact <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
    </p>
  </div>
`;


  try {
    sendEmail({
      fromEmail: "donotreply@glocre.com",
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
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check old password
    if (!(await user.isValidPassword(req.body.oldPassword))) {
      return next(new ErrorHandler("Old password is incorrect", 401));
    }

    // Assign new password
    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0], // return only the first message
      });
    }

    // For all other errors, pass to global error handler
    return next(error);
  }
});

//Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
  };
  console.log("Request body",req.body)
  let avatar;
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    newUserData.avatar = avatar;
  }

  // Twilio Setup
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  // Check if seller-related fields exist
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
      
      isSeller: req.body.isSeller === true ? true : false,
    };

    // Ensure businessAddress is correctly formatted
    let addressObj = req.body.businessAddress;

    // Handle stringified input
    if (typeof addressObj === "string") {
      try {
        addressObj = JSON.parse(addressObj);

        // Guard against parsing "null"
        if (!addressObj || typeof addressObj !== "object") {
          return next(new ErrorHandler("Invalid business address data", 400));
        }

      } catch (error) {
        return next(new ErrorHandler("Invalid JSON format for business address", 400));
      }
    }

    // If it's an array, take the first object
    if (Array.isArray(addressObj)) {
      addressObj = addressObj[0];
    }

    // Final check to ensure it's an object
    if (!addressObj || typeof addressObj !== "object") {
      return next(new ErrorHandler("Business address must be a valid object", 400));
    }

    newUserData.businessAddress = [addressObj];





    // Prepare email content
    const adminEmail = process.env.ADMIN_EMAIL || "atpldesign04@outlook.com";
    const userEmail = req.body.email;
    const businessAddressString = newUserData.businessAddress
      ? JSON.stringify(newUserData.businessAddress)
      : "Not Provided";

    const adminBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff;">
    <h2 style="color: #2f4d2a;">New Seller Application</h2>
    <p style="color: #8c8c8c;">A user has submitted a request to become a seller. Below are the submitted details:</p>
    <ul style="color: #8c8c8c; padding-left: 20px;">
      <li><strong>Name:</strong> ${req.body.name}</li>
      <li><strong>Last Name:</strong> ${req.body.lastName}</li>
      <li><strong>Email:</strong> ${req.body.email}</li>
      <li><strong>GST Number:</strong> ${req.body.gstNumber}</li>
      <li><strong>Business Name:</strong> ${req.body.businessName}</li>
      <li><strong>Business Email:</strong> ${req.body.businessEmail}</li>
      <li><strong>Contact Number:</strong> ${req.body.businessContactNumber}</li>
      <li><strong>Business Address:</strong> ${businessAddressString}</li>
    </ul>
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated notification for internal use only.</em>
    </p>
  </div>
`;



    const userBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
    <h2 style="color: #2f4d2a;">Seller Application Received</h2>
    <p style="color: #8c8c8c;">Dear ${req.body.name} ${req.body.lastName},</p>
    <p style="color: #8c8c8c;">
      Thank you for applying to become a supplier on <strong>GLOCRE</strong>. We have received your application and will review it shortly. Below are the details you submitted:
    </p>
    <ul style="color: #8c8c8c; padding-left: 20px;">
      <li><strong>GST Number:</strong> ${req.body.gstNumber}</li>
      <li><strong>Business Name:</strong> ${req.body.businessName}</li>
      <li><strong>Business Email:</strong> ${req.body.businessEmail}</li>
      <li><strong>Contact Number:</strong> ${req.body.businessContactNumber}</li>
    </ul>
    <p style="color: #8c8c8c;">We will notify you once your application has been reviewed.</p>
    <p style="color: #8c8c8c;">Best regards,</p>
    <p style="font-weight: bold; color: #2f4d2a;">The GLOCRE Team</p>
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated email. Please do not reply. For assistance, contact us at <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
    </p>
  </div>
`;


    try {
      await sendEmail({
        fromEmail: "donotreply@glocre.com",
        email: adminEmail,
        subject: "New Seller Application",
        html: adminBody
      });
      await sendEmail({ fromEmail: "donotreply@glocre.com", email: userEmail, subject: "Application Received", html: userBody });
    } catch (error) {
      return next(new ErrorHandler("Failed to send application emails.", 500));
    }
  }

  // Update user in DB
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
    message: "otp sent to you number"
  });
});
// User: Update Profile - PUT /api/v1/me/update
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { name, lastName } = req.body;
console.log("request body:", req.body)
  const newUserData = { name, lastName };

  // If avatar is being uploaded, handle file processing


  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});



exports.verifySellerOtp = catchAsyncError(async (req, res, next) => {
  const { otpCode } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || user.otpCode !== otpCode || Date.now() > user.otpExpire) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  user.isPhoneVerified = true;
  user.otpCode = null;
  user.otpExpire = null;
  await user.save();

  res.status(200).json({ success: true, message: "Phone number verified!" });
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

  let sendSellerEmail = false;  

  // If the role is changed to 'seller', set isSeller to true and flag email notification
  if (req.body.role === "seller") {
    newUserData.isSeller = true;
    sendSellerEmail = true;
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  // Send congratulatory email if promoted to seller
  if (sendSellerEmail) {
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; background-color: #fff7f0;">
        <div style="text-align: center;">
          <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Seller" style="width: 100%; max-width: 600px; margin-bottom: 20px;" />
        </div>

        <h2 style="color: #2f4d2a;">Welcome to GLOCRE Seller Community</h2>

        <p style="color: #8c8c8c;">Hi ${newUserData.name},</p>

        <p style="color: #8c8c8c;">
          Congratulations! Your profile has been verified and you are now officially a <strong>GLOCRE Seller</strong>.
        </p>
        <p style="color: #8c8c8c;">
          You now have access to the <strong>Seller Dashboard</strong> where you can add your products, manage listings, and start earning with us.
        </p>
        <p style="color: #8c8c8c;">We’re excited to have you on board. Let’s grow together!</p>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #8c8c8c;">
          <em>This is an auto-generated email. Please do not reply. For queries, contact us at 
          <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
        </p>
      </div>
    `;

    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: user.email,
      subject: "Welcome to GLOCRE Seller Platform",
      html: message,
    });
  }

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
  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});

//    POST /api/users/savedAddresses
exports.createSavedAddress = catchAsyncError(async (req, res, next) => {
  // Getting the logged-in user's ID and fetching user details
  const userId = req.user.id;
  const user = await User.findById(userId);

  // If user doesn't exist, return error
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // console.log("Request Body:", req.body);
  // Check if the address already exists in the user's saved addresses
  const existingAddress = user.savedAddress.find((address) =>
    address?.name?.toLowerCase() === req.body.name?.toLowerCase() &&
    address?.address?.toLowerCase() === req.body.address?.toLowerCase() &&
    address?.addressLine?.toLowerCase() === req.body.addressLine?.toLowerCase() &&
    address?.city?.toLowerCase() === req.body.city?.toLowerCase() &&
    parseInt(address?.phoneNo) === parseInt(req.body.phoneNo) &&
    parseInt(address?.postalCode) === parseInt(req.body.postalCode) &&
    address?.country?.toLowerCase() === req.body.country?.toLowerCase() &&
    address?.state?.toLowerCase() === req.body.state?.toLowerCase()
  );


  // If the address already exists, return success response
  if (existingAddress) {
    return res.status(200).json({
      success: true,
      message: "Address is already saved.",
      data: existingAddress,
    });
  }

  // Generate a unique address ID for the new address
  const addressId = new mongoose.Types.ObjectId();

  // Prepare the new address object
  const newAddress = user.savedAddress.create({
    ...req.body,
    _id: addressId,
  });

  // Add the new address to the user's saved addresses array and save the user
  user.savedAddress.push(newAddress);
  await user.save();

  // Respond with a success message
  res.status(201).json({
    success: true,
    message: "Address saved successfully.",
    data: newAddress,
  });

  // console.log("New Address:", newAddress);
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
  // console.log(req.body)
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
    name:req.body.name,
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

// POST /api/v1/cart/add
exports.addToCart = catchAsyncError(async (req, res, next) => {
  const { product, name, price, image, stock, quantity, variant, tax, shippingCostlol, shippingCostNorth, shippingCostSouth, shippingCostEast, shippingCostWest, shippingCostCentral, shippingCostNe, createdBy } = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Validate the product information
  if (!product || !name || !price || !image || !stock) {
    return next(new ErrorHandler("Incomplete product information", 400));
  }

  // Convert quantity to a number
  const quantityNumber = Number(quantity);
  if (isNaN(quantityNumber) || quantityNumber <= 0) {
    return next(new ErrorHandler("Invalid quantity", 400));
  }

  // Check if the item already exists in the cart
  const existingItem = user.cart.find(item => {
    if (variant) {
      return item.product.toString() === product && item.variant && item.variant._id.toString() === variant._id;
    }
    return item.product.toString() === product;
  });

  if (existingItem) {
    // If the existing item quantity matches the stock, do not increase quantity
    if (existingItem.quantity >= stock) {
      return next(new ErrorHandler("Cannot add more items, stock limit reached", 400));
    }

    // Calculate the new quantity ensuring it does not exceed the stock
    const newQuantity = existingItem.quantity + quantityNumber;
    existingItem.quantity = newQuantity > stock ? stock : newQuantity;
  } else {
    // If the item does not exist, add it to the cart with the provided quantity
    if (quantityNumber > stock) {
      return next(new ErrorHandler("Cannot add more items than available in stock", 400));
    }

    const cartItem = {
      product: product,
      name,
      quantity: quantityNumber,
      image,
      price,
      stock,
      tax,
      shippingCostlol,
      shippingCostNorth,
      shippingCostSouth,
      shippingCostEast,
      shippingCostWest,
      shippingCostCentral,
      shippingCostNe,
      createdBy,
    };

    if (variant) {
      cartItem.variant = {
        _id: variant._id,
        variantType: variant.variantType,
        variantName: variant.variantName,
        price: variant.price,
        offPrice: variant.offPrice,
        stock: variant.stock,
        images: variant.images,
      };
    }

    user.cart.push(cartItem);
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

// Update cart item quantity
exports.updateCartItemQuantity = catchAsyncError(async (req, res, next) => {
  try {
    const { productId, quantity, variantId } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Find the item in the cart
    const cartItemIndex = user.cart.findIndex(item => {
      if (variantId) {
        return item.product.toString() === productId && item.variant && item.variant._id.toString() === variantId;
      }
      return item.product.toString() === productId;
    });

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

// Remove item from cart
exports.removeFromCart = catchAsyncError(async (req, res, next) => {
  const { productId, variantId } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Find the item in the cart
  const cartItemIndex = user.cart.findIndex(item => {
    if (variantId) {
      return item.product.toString() === productId && item.variant && item.variant._id.toString() === variantId;
    }
    return item.product.toString() === productId;
  });

  if (cartItemIndex === -1) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  // Remove the item from the cart array
  user.cart.splice(cartItemIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    cart: user.cart,
  });
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


exports.sendOTP = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    const response = await axios.post('https://control.msg91.com/api/v5/otp', {
      authkey: '447087AKKlbZgmzDW6800e2fdP1',
      template_id: '6800e5f8d6fc055e721c8712',
      mobile: `91${mobile}`,
    });

    res.status(200).json({
      message: 'OTP sent successfully',
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send OTP',
      error: error.response?.data || error.message,
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required' });
  }

  try {
    const response = await axios.get(
      `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${MSG91_AUTH_KEY}&mobile=91${mobile}`
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: 'OTP verification failed',
      error: error.response?.data || error.message,
    });
  }
};

exports.sendContactEmail = catchAsyncError( async (req, res) => {
  try {
    const {
      name,
      organization,
      function: userFunction,
      mobile,
      email,
      pincode,
      requirements,
    } = req.body;
    // console.log(req.body)
  
    const adminHtmlMessage = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; background-color: #ffffff;">
    <div style="text-align: center;">
      <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Logo" style="max-width: 180px; margin-bottom: 20px;" />
    </div>
    <h2 style="color: #2f4d2a;">New Contact Form Submission</h2>
    <p style="color: #8c8c8c;"><strong>Name:</strong> ${name}</p>
    <p style="color: #8c8c8c;"><strong>Organization:</strong> ${organization}</p>
    <p style="color: #8c8c8c;"><strong>Function:</strong> ${userFunction}</p>
    <p style="color: #8c8c8c;"><strong>Mobile:</strong> ${mobile}</p>
    <p style="color: #8c8c8c;"><strong>Email:</strong> ${email}</p>
    <p style="color: #8c8c8c;"><strong>Pincode:</strong> ${pincode}</p>
    <p style="color: #8c8c8c;"><strong>Message/Requirements:</strong> ${requirements}</p>
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated notification for internal use.</em>
    </p>
  </div>
`;


    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: adminHtmlMessage,
    });

    // 2️⃣ Confirmation Email to User
    const userHtmlMessage = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; background-color: #fff7f0;">
    <div style="text-align: center;">
      <img src="https://glocreawsimagebucket.s3.eu-north-1.amazonaws.com/Glocre+Logo+Green+text+without+BG+1.png" alt="GLOCRE Logo" style="max-width: 180px; margin-bottom: 20px;" />
    </div>
    <h2 style="color: #2f4d2a;">Thank You for Contacting GLOCRE</h2>
    <p style="color: #8c8c8c;">Dear ${name},</p>
    <p style="color: #8c8c8c;">
      We appreciate you reaching out to <strong>GLOCRE</strong>. Your message has been received, and a member of our team will get in touch with you shortly.
    </p>
    <p style="color: #8c8c8c;">
      In the meantime, feel free to browse our website or contact us directly with any additional questions.
    </p>
    <br/>
    <p style="color: #8c8c8c;">Best regards,</p>
    <p style="font-weight: bold; color: #2f4d2a;">The GLOCRE Support Team</p>
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #8c8c8c;">
      <em>This is an auto-generated email. Please do not reply. For queries, contact us at <a href="mailto:support@glocre.com" style="color: #2f4d2a;">support@glocre.com</a>.</em>
    </p>
  </div>
`;


    await sendEmail({
      fromEmail: "donotreply@glocre.com",
      email: email,
      subject: "We’ve received your message – GLOCRE",
      html: userHtmlMessage,
    });

    res.status(200).json({ message: "Your message has been sent successfully." });

  } catch (error) {
    console.error("Error in contact form:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
});