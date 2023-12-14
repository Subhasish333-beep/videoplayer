import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("connected", process.env.MONGODB_URI);
        // lVNIhu5k2nY0ZacM
    }
    catch (error) {
        console.log("ERROR", error);
        console.log("connected", process.env.MONGODB_URI);
        process.exit(1);
    }
}

export default connectDB;