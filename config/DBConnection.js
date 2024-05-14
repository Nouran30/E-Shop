import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

async function DbConnection() {

    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'shop-user'
        })
        return console.log('Database Connection is ready...')
    } catch (error) {
        return console.log(error);
    }
}

export default DbConnection;