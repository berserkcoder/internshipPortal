import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"

export const requireCandidate = asyncHandler(async(req,res,next)=>{
    if(!req.user || req.user.role !== "candidate"){
        throw new ApiError(403,"candidate access required")
    }
    next()
})