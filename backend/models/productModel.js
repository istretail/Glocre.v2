const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    offPrice: {
        type: Number,
        required: true,
        maxLength: [75, 'Offer price cannot exceed 75']
    },
    tax: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    keyPoints: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length >= 3 && v.length <= 5; // Ensures key points are between 3 and 5
            },
            message: 'You must provide between 3 and 5 key points.'
        },
        required: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: {
        type: [{
            image: {
                type: String,
                required: true
            }
        }],
        minlength: 1,
        maxlength: 3,
        required: true
    },
    maincategory: {
        type: String,
        required: [true, "Please enter product main category"],
        enum: {
            values: [
                'NVR',
                'SMART HOME',
                'SENSORS',
                'CAMERAS',
                'OTHERS',
            ],
            message: "Please select correct main category"
        }
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                'test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7',
                'test8','test9', 'test10', 'test11', 'test12','test13', 'test14', 'test15'
                 
            ],
            message: "Please select correct category"
        }
    },
    subcategory: {
        type: String,
        required: [true, "Please enter product Sub category"],
        enum: {
            values: [
                'test1', 'test2', 'test3',
                'test13', 'test14', 'test15',
                'test22', 'test23', 'test24',
                'test25', 'test26', 'test27',
                'test28', 'test29', 'test30'

            ],
            message: "Please select correct Sub category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [100, 'Product stock cannot exceed 100']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            // name: {
            //     type: String,
            //     required: true
            // },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },  
    status:{
        type: String,
        required: true,
        enum: ['pending', 'approved'],
        default: 'pending'
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: String,
    },
    itemModelNum: {
        type: String,
    },
    serialNum: {
        type: String,
    },
    connectionType: {
        type: String,
    },
    hardwarePlatform: {
        type: String,
    },
    os: {
        type: String,
    },
    powerConception: {
        type: String,
    },
    batteries: {
        type: String,
    },
    packageDimension: {
        type: String,
    },
    portDescription: {
        type: String,
    },
    connectivityType: {
        type: String,
    },
    compatibleDevices: {
        type: String,
    },
    powerSource: {
        type: String,
    },
    specialFeatures: {
        type: String,
    },
    includedInThePackage: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    itemSize: {
        type: String,
    },
    itemWidth: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

let schema = mongoose.model('Product', productSchema)

module.exports = schema