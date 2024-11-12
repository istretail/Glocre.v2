const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
const sendEmail = require('../utils/email')
const crypto = require('crypto')
const { generateToken } = require('../utils/token');
const twilio = require('twilio');

const OTP_VALIDITY_DURATION = 10 * 60 * 1000; // 10 minutes

//register user --/api/v1/Register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    let BASE_URL1 = process.env.FRONTEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL1 = `${req.protocol}://${req.get('host')}`
    }
    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }

    // Generate email verification token
    const emailToken = crypto.randomBytes(20).toString('hex');
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
            email,
            password,
            avatar,
            verifyEmailToken: emailToken, // Set the email verification token
            verifyEmailTokenExpire: Date.now() + 30 * 60 * 1000, // Token expires in 30 minutes
            isVerified: false
        });

        // Send email verification link to the user
        await sendEmail({
            email,
            subject: 'Email Verification',
            html: htmlMessage
        });

        res.status(201).json({
            success: true,
            message: 'Verification email sent. Please verify your email to complete registration.'
        });
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            res.status(400).json({
                success: false,
                message: 'Email already exists.'
            });
        } else {
            res.status(401).json({
                success: false,
                message: error.message
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
            message: 'Invalid or expired token.'
        });
    }

    // Check if the token has expired
    if (user.verifyEmailTokenExpire < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'Email verification token has expired.'
        });
    }

    // Mark user as verified and clear email verification token
    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully.'
    });
});

//Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    // Find the user in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400));
    }

    // Check if the user is verified
    if (!user.isVerified) {
        return next(new ErrorHandler('Please verify your email before logging in', 400));
    }

    // Check if the entered password is correct
    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password', 400));
    }

    // If all checks pass, send the authentication token
    sendToken(user, 201, res);
});

//logout User - /api/v1/logout
exports.logoutUser = (req, res, next) => {
    // Clearing the token cookie
    res.clearCookie('token', {
        httpOnly: true
    });

    // Sending a success response
    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
};

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false })

    let BASE_URL = process.env.FRONTEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    //Create reset url
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `<p>Your password reset url is as follows:
    </p> <a href="${resetUrl}">${resetUrl} </a><p>If you have not requested this email, then ignore it.</p>`;

    try {
        sendEmail({
            email: user.email,
            subject: "Password Recovery",
            html: message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message), 500)
    }

})
//Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired'));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false })
    sendToken(user, 201, res)

})

//Get User Profile - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

//Change Password  - api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }
    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true,
    })
})

//Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData = { ...newUserData, avatar }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })

})

//Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

//Admin: Get Specific User - api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Update User - api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.remove();
    res.status(200).json({
        success: true,
    })
})

//    POST /api/users/savedAddresses
exports.createSavedAddress = catchAsyncError(async (req, res, next) => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const twiloAuthToken = process.env.TWILIO_AUTH_TOKEN
    const fromNum = process.env.TWILIO_PHONE_NUMBER;
    const client = new twilio(sid, twiloAuthToken);
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const existingAddress = user.savedAddress.find(address => (
        address.address.toLowerCase() === req.body.address.toLowerCase() &&
        address.addressLine.toLowerCase() === req.body.addressLine.toLowerCase() &&
        address.city.toLowerCase() === req.body.city.toLowerCase() &&
        parseInt(address.phoneNo) === parseInt(req.body.phoneNo) &&
        parseInt(address.postalCode) === parseInt(req.body.postalCode) &&
        address.country.toLowerCase() === req.body.country.toLowerCase() &&
        address.state.toLowerCase() === req.body.state.toLowerCase()
    ));

    if (existingAddress) {
        return res.status(200).json({
            success: true,
            message: 'Address already exists',
            data: existingAddress
        });
    }

    // Generate OTP and set expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpire = Date.now() + OTP_VALIDITY_DURATION;

    // Send OTP to user via Twilio
    await client.messages.create({
        body: `Your OTP code is ${otpCode}`,
        to: req.body.phoneNo,
        from: fromNum
    });

    const newAddress = {
        ...req.body,
        otpCode,
        otpExpire,
        isPhoneVerified: false
    };

    // Add the new address to the user's saved addresses
    user.savedAddress.push(newAddress);
    await user.save();

    res.status(201).json({
        success: true,
        message: 'OTP sent to your phone. Please verify within 10 minutes.',
        data: user.savedAddress
    });
});

exports.verifyAddressOtp = catchAsyncError(async (req, res, next) => {
    const { addressId, otpCode } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const address = user.savedAddress.id(addressId);
    if (!address) {
        return next(new ErrorHandler('Address not found', 404));
    }

    // Check if OTP matches and is within validity period
    if (address.otpCode === otpCode && Date.now() < address.otpExpire) {
        address.isPhoneVerified = true;
        address.otpCode = undefined;
        address.otpExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Phone number verified successfully',
            data: address
        });
    } else {
        return next(new ErrorHandler('Invalid or expired OTP', 400));
    }
});

//    PUT /api/v1/users/savedAddresses/:id
exports.updateSavedAddress = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const savedAddressIndex = user.savedAddress.findIndex(addr => addr._id.toString() === req.params.id);
    if (savedAddressIndex === -1) {
        return next(new ErrorHandler('Saved address not found', 404));
    }

    // Validate and sanitize the data from the request body before updating the saved address
    const updatedAddressData = {
        address: req.body.address,
        addressLine: req.body.addressLine,
        city: req.body.city,
        phoneNo: req.body.phoneNo,
        postalCode: req.body.postalCode,
        country: req.body.country,
        state: req.body.state
    };

    // Update the saved address with the sanitized data
    user.savedAddress[savedAddressIndex] = { ...user.savedAddress[savedAddressIndex], ...updatedAddressData };

    // Save the user with the updated saved address
    try {
        await user.save();
        res.status(200).json({
            success: true,
            data: user.savedAddress[savedAddressIndex]
        });
    } catch (error) {
        // Handle any errors that occur during the save operation
        return next(new ErrorHandler('cannot update address', 500));
    }
});

//   DELETE /api/users/savedAddresses/:id
exports.deleteSavedAddress = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const savedAddressIndex = user.savedAddress.findIndex(addr => addr._id.toString() === req.params.id);
    if (savedAddressIndex === -1) {
        return next(new ErrorHandler('Saved address not found', 404));
    }

    user.savedAddress.splice(savedAddressIndex, 1);
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Saved address deleted successfully'
    });
});

//   GET /api/v1/users/savedAddresses
exports.getAllSavedAddresses = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user.savedAddress
    });
});

//   GET /api/v1/cart/add
exports.addToCart = catchAsyncError(async (req, res, next) => {
    const { name, quantity, image, price, stock, product } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Convert quantity to a number
    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
        return next(new ErrorHandler('Invalid quantity', 400));
    }

    // Check if the item already exists in the cart
    const existingItem = user.cart.find(item => String(item.product) === String(product));

    if (existingItem) {
        // If the existing item quantity matches the stock, do not increase quantity
        if (existingItem.quantity >= stock) {
            return next(new ErrorHandler('Cannot add more items, stock limit reached', 400));
        }

        // Calculate the new quantity ensuring it does not exceed the stock
        const newQuantity = existingItem.quantity + quantityNumber;
        existingItem.quantity = newQuantity > stock ? stock : newQuantity;
    } else {
        // If the item does not exist, add it to the cart with the provided quantity
        if (quantityNumber > stock) {
            return next(new ErrorHandler('Cannot add more items than available in stock', 400));
        }
        user.cart.push({ name, quantity: quantityNumber, image, price, stock, product });
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        cart: user.cart
    });
});

// Get cart items
exports.getCartItems = catchAsyncError(async (req, res, next) => {

    const userId = req.user.id; //  middleware to extract user ID from request


    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        cart: user.cart
    });
});

// Remove item from cart
exports.removeFromCart = catchAsyncError(async (req, res, next) => {
    const { index } = req.params;
    const userId = req.user.id; // Assuming you have middleware to extract user ID from request

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Check if the index is valid
    if (index < 0 || index >= user.cart.length) {
        return next(new ErrorHandler('Invalid index', 400));
    }

    // Remove the item from the cart array
    user.cart.splice(index, 1);
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        cart: user.cart
    });
});

exports.updateCartItemQuantity = catchAsyncError(async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Find the item in the cart
        const cartItemIndex = user.cart.findIndex(item => String(item.product) === productId);
        if (cartItemIndex === -1) {
            return next(new ErrorHandler('Item not found in cart', 404));
        }

        // Update the quantity
        user.cart[cartItemIndex].quantity = quantity;

        // Save changes
        await user.save();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Cart item quantity updated successfully',
            cart: user.cart
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.clearCart = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id; // Assuming you have middleware to extract user ID from request

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Clear the cart array
    user.cart = [];
    await user.save();

    res.status(200).json({
        success: true,
        message: 'All items removed from cart successfully',
        cart: user.cart
    });
});
