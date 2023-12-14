// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
// require('dotenv').config()
import connectDB from "./db/index.js";
// ADVANCE WAY

dotenv.config()

console.log("check", process.env);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000), () => {
        console.log("Server is running at", process.env.PORT);
    }
})
.catch(err => {
    console.log("MONGODB CONNECTION FAILED", err);
})






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