import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    const { username, email, fullname, password } = req.body;
    // console.log("dtata", req.body);
    //validation- notempty
    // if(fullname === "") {
    //     throw new ApiError(400, "Name is required")
    // }
    if (
        [fullname, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }
    //check if user exists: username and email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    //check for images and avatar
    const avatarLocalFilePath = req.files?.avatar[0].path
    console.log("avatar local file path ===> ", avatarLocalFilePath);
    // const coverLocalFilePath = req?.files?.coverImage[0]?.path || ""
    const coverLocalFilePath = req.files.coverImage[0]?.path;
    if (!avatarLocalFilePath) {
        throw new ApiError(400, "Avatar is required")
    }
    //upload them to cloudinary, avatar
    console.log("abcd", avatarLocalFilePath);
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    console.log("avatar image ===>", avatar);
    let coverImage;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImage = await uploadOnCloudinary(coverLocalFilePath);
    }
    if (!avatar) {
        throw new ApiError(400, "Avatars is required")
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
    //remove password and refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong")
    }
    //return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //req body ==> data
    const { email, username, password } = req.body;
    if (!(username || email)) {
        res.json(new ApiError(400, "username or email is required"))
    }
    //username or email
    //find the user
    const loggedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!loggedUser) {
        res.json(new ApiError(404,"User does not exist"))
    }
    //password check
    const isPasswordValid = await loggedUser.isPasswordCorrect(password)
    if (!isPasswordValid) {
        res.json(new ApiError("404", "passowrd does not match"))
    }
    //access and refresh token
   const {accessToken, refreshToken} = await generateAccessRefreshToken(loggedUser._id)
    //send cookie
    const loggedInUser = await User.findById(loggedUser._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(req.user._id, 
        {
            $set: {
                refreshToken: undefined
            },
            new: true
        })
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logout successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser
}