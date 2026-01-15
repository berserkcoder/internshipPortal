import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    }
},{timestamps:true})

export const Resume = mongoose.model("Resume",resumeSchema)