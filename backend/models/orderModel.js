const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    clocreOrderId: {
        type: String,
        unique: true,
    }, // Store as String for formatted ID
    shippingInfo: {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        address1: {
            type: String,
        },
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    billingInfo: {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        address1: {
            type: String,
        },
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'Product',
            },
        },
    ],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    paidAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing',
    },
    discount: { type: Number, default: 0.0 },
    trackingInfo: {
        trackingNumber: {
            type: String,
        },
        courierSlug: {
            type: String,
        },
        trackingStatus: {
            type: String,
            enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'],
            default: 'Pending',
        },
        trackingURL: {
            type: String,
        },
        lastUpdated: {
            type: Date,
        },
    },
    estimatedDelivery: { type: Date }, // New field: Estimated delivery date
    orderStatus: { type: String, required: true, default: 'Processing' },
    refundStatus: { type: String, default: 'No Refund' }, // New field: Refund status
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to generate clocreOrderId
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastOrder = await mongoose.model('Order').findOne().sort({ createdAt: -1 });
        const lastId = lastOrder && lastOrder.clocreOrderId ? parseInt(lastOrder.clocreOrderId.replace('GLS', ''), 10) : 0;
        this.clocreOrderId = `GLS${String(lastId + 1).padStart(6, '0')}`;
    }
    next();
});

let orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;