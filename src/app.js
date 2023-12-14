import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/*
middleware is used to validate an API if the condition is met or not.
It is achieved using the "use" keyword and three parameters req, res, next.
*/


app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentails: true
    }
));

app.use(express.json(
    {
        limit: "16kb"        
    }
));

app.use(express.urlencoded(
    {
    extended: true,
    limit: "16kb"
}
));

app.use(express.static("public"));
app.use(cookieParser());
export { app }