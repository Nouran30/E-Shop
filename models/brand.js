import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Brand name is required'],
        unique:[true, 'name must be unique'],
        minlength: [3, 'Too short brand name'],
        maxlength: [32, 'Too long brand name'],
    }, 
    slug: {
        type: String,
        lowercase: true,
    },
    image:{
        type:String,
    }
},{timestamps:true}
)

const Brand = mongoose.model('brand', brandSchema);
export default Brand;