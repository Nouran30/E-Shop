import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [100, 'Too long product title'],
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    modelName: {
        type: String,
        minlength: [2, "The Model Name of the product is must be at least 2 characters"],
        maxlength: [30, "The Model Name of the product is at most 30 characters"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'Too short product description'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [200000, 'Too long product price'],
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],

    imageCover: {
        type: String,
        required: [true, 'Product Image cover is required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: [true, 'Product must be belong to category'],
    },
    subcategories: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subcategory',
        },
    ],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'brand',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
        // to enable virtual populate
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)


productSchema.virtual('reviews', {
    ref: 'review',
    foreignField: 'product',
    localField: '_id',
});


const setImageURL = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        doc.images = imagesList;
    }
};
// findOne, findAll and update
productSchema.post('init', (doc) => {
    setImageURL(doc);
});

// create
productSchema.post('save', (doc) => {
    setImageURL(doc);
});

const Product = mongoose.model('product', productSchema);
export default Product;