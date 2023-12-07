// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db";
// ADVANCE WAY

dotenv.config({
    path:'./env'
})

connectDB()






// BASIC WAY
// import express from "express"

// const app = express()
// ;( async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error) => {
//         console.log("ERROR", error);
//         throw error
//        })
//        app.listen(process.env.PORT, () => {
//         console.log("APP IS RUNNING");
//        })
//     }
//     catch(error) {
//         console.log("error", error);
//     }
// })()