import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"

export const requireAdmin = asyncHandler(async(req,res,next)=>{
    if(!req.user || req.user.role !== "admin"){
        throw new ApiError(403,"Admin access required")
    }
    next()
})