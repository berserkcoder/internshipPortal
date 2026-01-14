import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    /*
    -> get user details from frontend
    -> validation *
    -> check if user already exist *
    -> create user in db 
    -> remove password and refreshToken from response
    -> check for user creation
    -> return res
    */ 
   const {fullName,email,password,role,accountStatus} = req.body

    if(!fullName || fullName.trim() === ""){
        throw new ApiError(400,"fullName is required")
    }
    if(!email || email.trim() === ""){
        throw new ApiError(400,"email is required")
    }   
    if(!password){
        throw new ApiError(400,"password is required")
    }
    if(password.length < 6){
        throw new ApiError(400,"password must be atleast of 6 characters")
    }
    if(!role || role.trim() === ""){
        throw new ApiError(400,"role is required")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    let AccountStatus = "pending"

    if(role === "candidate"){
        AccountStatus = "active"
    }

    const user = await User.create({
        fullName,
        email,
        password,
        role,
        accountStatus:AccountStatus
    })

    const createdUser = await User.findById(user._id).select(
                "-password -refreshToken"
            )

    if(!createdUser){
        throw new ApiError(500,"Unable to create user. Please try again later")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(createdUser._id)

    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        201,
        {user: createdUser, accessToken, refreshToken},
        "User registered successfully"
    ))
})

const loginUser = asyncHandler(async(req,res) => {
    /*
    -> take email and password from req.body or frontend
    -> validate email and password
    -> check if user exists with given email
    -> compare password
    -> generate accessToken and refreshToken
    -> set cookies and return response
    */
    
    const {email,password} = req.body

    if(!email || email.trim() === ""){
        throw new ApiError(400,"email is required")
    }
    if(!password){
        throw new ApiError(400,"password is required")
    }

    const user = await User.findOne({email}).select("+password +refreshToken")

    if(!user){
        throw new ApiError(404,"User not found with given email")
    }

    if (!password) {
            throw new ApiError(400, "Password is required");
        }

    const isPasswordMatched = await user.isPasswordCorrect(password)

    if(!isPasswordMatched){
        throw new ApiError(401,"Invalid password")
    }

    const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while logging in")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(createdUser._id)
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {user: createdUser, accessToken},
        "User logged in successfully"
    ))
})

export {registerUser,loginUser};