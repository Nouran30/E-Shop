import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        ratings: {
            type: Number,
            min: [1, 'Min ratings value is 1.0'],
            max: [5, 'Max ratings value is 5.0'],
            required: [true, 'review ratings required'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, 'Review must belong to user'],
        },
        // parent reference (one to many)
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: [true, 'Review must belong to product'],
        },
    },
    { timestamps: true }
);

// Mongoose query middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name',
    });
    next();
});

const Review = mongoose.model('review', reviewSchema);
export default Review;