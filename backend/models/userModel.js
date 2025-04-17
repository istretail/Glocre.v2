const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { default: isEmail } = require('validator/lib/isEmail');
const variantSchema = new mongoose.Schema({
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'Variant'
  },
  variantType: {
    type: String,
    required: true
  },
  variantName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offPrice: {
    type: Number
  },
  stock: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    required: true
  }
});
const cartItemSchema = new mongoose.Schema({

  name: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'Product'
  },
  tax: {
    type: Number,
    required: true
  },
  variant: variantSchema
});

const savedAddressSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  phoneNo: {
    type: String,
    required: [true, 'Please Enter Mobile Number'],
    validate: {
      validator: function (v) {
        return /^(\+?\d{1,3})?(\d{10,13})$/.test(v);
      },
      message: 'Please Enter Valid Mobile Number'
    }
  },
  otpCode: String,
  otpExpire: Date,
  isPhoneVerified: { type: Boolean, default: false },
  phoneVerifiedExpire: Date,
  postalCode: {
    type: Number,
    required: [true, 'Please Enter Postal Code'],
    validate: {
      validator: function (v) { return v.toString().length === 6; },
      message: 'Please Enter Valid Postal Code'
    }
  },
  country: { type: String, required: true },
  state: { type: String, required: true }
});
  const businessAddressSchema = new mongoose.Schema({
    address: { type: String },
    addressLine: { type: String },
    city: { type: String },

    isPhoneVerified: { type: Boolean, default: false },
    postalCode: {
      type: String,
    },
    country: { type: String },
    state: { type: String }
  });


const userSchema = new mongoose.Schema({
  clocreUserId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please First name"],
  },
  lastName: {
    type: String,
    required: [true, "Please Last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: {
      validator: isEmail,
      message: 'Please enter a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [16, "Password cannot exceed 16 characters"],
    match: [
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/,
      "Password must contain at least one uppercase letter and one special character"
    ],
    select: false,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyEmailToken: String,
  verifyEmailTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gstNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid GST number'
    }
  },
  otpCode: String,
  otpExpire: Date,
  businessName: {
    type: String,
  },
  businessOwnerName: {
    type: String,
  },
  designation: {
    type: String,
  },
  businessEmail: {
    type: String,
  },
  businessContactNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(\+?\d{1,3})?(\d{10,13})$/.test(v);
      },
      message: 'Please Enter Valid Mobile Number'
    }
  },
  LaneLine: {
    type: Number,
  },
  website: {
    type: String,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please provide a valid URL']
  },
  businessAddress: 
    [businessAddressSchema],
  isSeller: {
    type: Boolean,
    default: undefined,
    required: false,
  },
  savedAddress: [savedAddressSchema],
  cart: [cartItemSchema],
  wishlist: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product",
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

userSchema.methods.isValidPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetToken = function () {
  // Generate Token
  const token = crypto.randomBytes(20).toString('hex');
  //Generate Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  //Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
  return token
}

// Method to generate email verification token
userSchema.methods.generateVerifyEmailToken = function () {
  const emailToken = crypto.randomBytes(20).toString('hex');
  this.verifyEmailToken = crypto.createHash('sha256').update(emailToken).digest('hex');
  this.verifyEmailTokenExpire = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes
  return emailToken;
};
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastUser = await mongoose.model('User').findOne().sort({ createdAt: -1 });
    const lastId = lastUser && lastUser.clocreUserId ? parseInt(lastUser.clocreUserId.replace('GLC', ''), 10) : 0;
    this.clocreUserId = `GLC${String(lastId + 1).padStart(6, '0')}`;
  }
  next();
});

let model = mongoose.model('User', userSchema)
module.exports = model;
