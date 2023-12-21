import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    const { username, email, fullname} = req.body;
    // console.log("dtata", req.body);
    //validation- notempty
    // if(fullname === "") {
    //     throw new ApiError(400, "Name is required")
    // }
    if(
        [fullname, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All field are required")
    }
    //check if user exists: username and email
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User already exists")
    }
    //check for images and avatar
    const avatarLocalFilePath = req.files?.avatar[0].path
    const coverLocalFilePath = req.files?.coverImage[0].path
    if(!avatarLocalFilePath) {
        throw new ApiError(400, "Avatar is required")
    }
     //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    const coverImage = await uploadOnCloudinary(coverLocalFilePath);
    if(!avatar) {
        throw new ApiError(400, "Avatar is required")
    }
   
    //create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    //remove password and refresh token from response
    //check for user creation
    //return res

    
})


export { registerUser }