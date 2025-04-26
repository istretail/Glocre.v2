const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variantType: { type: String, required: true },
  variantName: { type: String, required: true },
  price: { type: Number, required: true },
  offPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String, required: true }],
});

const productSchema = new mongoose.Schema({
  clocreProductId: {
    type: String,
    unique: true,
  },// Store as Number for auto-increment
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: { type: String, required: [true, 'Please enter product description'] },
  maincategory: { type: String, required: [true, 'Please enter product main category'] },
  category: { type: String, required: [true, 'Please enter product category'] },
  subcategory: { type: String, required: [true, 'Please enter product subcategory'] },
  brand: { type: String, required: false }, // Make required if mandatory
  condition: { type: String, enum: ['New', 'Unboxed', 'Refurbished'], default: 'New' },
  keyPoints: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length === 0 || (v.length >= 3 && v.length <= 5);
      },
      message: 'You must provide between 3 and 5 key points.',
    },
  },
  variants: [variantSchema],
  tax: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isRefundable: { type: Boolean, default: false },
  itemModelNum: { type: String },
  sku: { type: String, required: true },
  upc: { type: String, required: true },
  hsn: { type: String, required: true },
  countryofOrgin: { type: String, required: true },
  manufactureDetails: { type: String },
  productCertifications: { type: String },
  packageDimension: { type: String },
  manufacturer: { type: String },
  fssai: { type: String },
  itemLength:{ type: String, required: true },
  itemHeight: { type: String, required: true },
  itemWeight: { type: String, required: true },
  itemWidth: { type: String, required: true },
  moq: { type: Number, required: true },
  shippingCostlol: { type: Number, required: true },
  shippingCostNorth: { type: Number, required: true },
  shippingCostSouth: { type: Number, required: true },
  shippingCostEast: { type: Number, required: true },
  shippingCostWest: { type: Number, required: true },

  shippingCostCentral: { type: Number, required: true },
  shippingCostNe: { type: Number, required: true },
  unit: { type: String, required: true },
  images: [{ type: String, required: false }],
  price: { type: Number, required: false, default: 0 },
  offPrice: { type: Number, required: false, default: 0 },
  stock: { type: Number, required: false, default: 0 },
  rejectionReason: { type: String},
}, { timestamps: true });

productSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastProduct = await mongoose.model('Product').findOne().sort({ createdAt: -1 });
    const lastId = lastProduct && lastProduct.clocreProductId ? parseInt(lastProduct.clocreProductId.replace('GLP', ''), 10) : 0;
    this.clocreProductId = `GLP${String(lastId + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);