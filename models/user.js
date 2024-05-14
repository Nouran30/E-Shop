import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: [true, "name required",]
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'email required'],
            unique: true,
            lowercase: true,
        },
        phone: String,
        profileImg: String,

        password: {
            type: String,
            required: [true, 'password required'],
            minlength: [6, 'Too short password'],
        },
        passwordChangedAt: Date,
        isConfirmedEmail: { type: Boolean, default: false },
        forgetPasswordCode: { type: String, default: null },
        forgetPasswordCodeVerified: { type: Boolean, default: false },
        role: {
            type: String,
            enum: ['user', 'manager', 'admin'],
            default: 'user',
        },
        // child reference (one to many)
        wishlist: [{
            type: mongoose.Schema.ObjectId,
            ref: 'product',
        }],
        active: {
            type: Boolean,
            default: true,
        },
    }, { timestamps: true }
)

const User = mongoose.model('user', userSchema);
export default User;