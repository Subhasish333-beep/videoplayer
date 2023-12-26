import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async(req, res, next) => {
try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log("token", req.cookies);
if(!token) {
    res.json(new ApiError(404, "Unauthorized request"))
}
const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

const userInfo = await User.findById(decodedToken?._id).select("-password -refreshToken")
if(!userInfo) {
    res.json(new ApiError(401, "Invalid access token"))
}

req.user = userInfo;
next();
}

catch(error) {
    console.log("token error", error);
    res.json(new ApiError(404, "Invalid access token"))
}
})