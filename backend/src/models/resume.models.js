import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    cloudinaryPublicId : {
        type: String,
        required: true
    },
    fileUrl : {
        type : String,
        required : true
    },
    fileName : {
        type : String,
        required : true
    },
    fileSize : {
        type : Number,
        required : true
    },
    mimeType : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["active","inactive"],
        default : "active"
    }
},{timestamps:true})

export const Resume = mongoose.model("Resume",resumeSchema)