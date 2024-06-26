import mongoose from "mongoose";


const categorySchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [32, 'Too long category name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image:{
        type:String,
    }
},
    { timestamps: true }
)


//mongoose middleware
const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
        doc.image = imageUrl;
    }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
    setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
    setImageURL(doc);
});

const Category =  mongoose.model("category",categorySchema);

export default Category;