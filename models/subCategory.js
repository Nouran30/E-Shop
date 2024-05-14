import mongoose from "mongoose";


const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category  name required'],
        unique: [true, 'Category must be unique'],
        minlength: [2, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
    }
},
    { timestamps: true }
)





const SubCategory = mongoose.model('subcategory', subCategorySchema);
export default SubCategory;