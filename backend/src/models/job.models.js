import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    requiredSkills: {
        type: [String],
        validate: {
            validator: v => v.length > 0,
            message: "At least one skill is required"
        }
    },
    location : {
        type : String,
        required : true,
        trim : true
    },
    jobType : {
        type : String,
        enum : ["full-time","part-time","contract","internship","temporary"],
        required : true
    },
    isRemote : {
        type : Boolean,
        default : false
    },
    status : {
        type : String,
        enum : ["open","closed","draft"],
        default : "draft"
    },
    companyName : {
        type : String,
        required : true,
        trim : true
    },
    experienceLevel : {
        type : String
    },
    salaryRange : {
        type : String
    },
    recruiter : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    applicationCount : {
        type : Number,
        default : 0
    },
    expiresAt: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
            if (this.isNew) {
                return value > new Date();
            }
            return true;
            },
            message: "Expiration date must be in the future"
        }
    }
},{timestamps:true});


jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ location: 1, jobType: 1, status: 1 });

export const Job = mongoose.model("Job",jobSchema);