import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.models.js";
import { Job } from "./src/models/job.models.js";
import { DB_NAME } from "./src/constants.js";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedJobs = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log("Connected successfully.");

        // 1. Create a dummy recruiter if one doesn't exist
        console.log("Checking for dummy recruiter...");
        let recruiter = await User.findOne({ email: "seedrecruiter@internhub.com" });
        
        if (!recruiter) {
            console.log("Creating dummy recruiter...");
            recruiter = await User.create({
                fullName: "Jane Smith (Recruiter)",
                email: "seedrecruiter@internhub.com",
                password: "password123", // Will be hashed by pre-save hook
                role: "recruiter",
                accountStatus: "active"
            });
            console.log("Dummy recruiter created with ID:", recruiter._id);
        } else {
            console.log("Dummy recruiter found with ID:", recruiter._id);
        }

        // 2. Define fake jobs
        const fakeJobs = [
            {
                title: "Frontend Engineering Intern",
                companyName: "TechNova Solutions",
                location: "San Francisco, CA",
                jobType: "internship",
                isRemote: true,
                status: "open",
                experienceLevel: "Entry Level",
                salaryRange: "$30 - $45 / hr",
                description: "We are looking for an enthusiastic Frontend Engineering Intern to join our core product team. You will work closely with designers and senior engineers to build accessible, performant, and beautiful user interfaces using React and modern CSS. This is an excellent opportunity to learn enterprise-level architecture.",
                requiredSkills: ["React", "HTML/CSS", "JavaScript", "Git"],
                recruiter: recruiter._id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            },
            {
                title: "Data Science Intern",
                companyName: "Quant Analytics",
                location: "New York, NY",
                jobType: "internship",
                isRemote: false,
                status: "open",
                experienceLevel: "Entry Level",
                salaryRange: "$40 - $55 / hr",
                description: "Join our data science team for the summer! You will assist in cleaning massive datasets, training predictive models, and visualizing data trends using Python. You'll get hands-on experience with real-world financial data.",
                requiredSkills: ["Python", "Pandas", "SQL", "Machine Learning"],
                recruiter: recruiter._id,
                expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) 
            },
            {
                title: "Product Marketing Intern",
                companyName: "GrowthStack",
                location: "Austin, TX",
                jobType: "part-time",
                isRemote: true,
                status: "open",
                experienceLevel: "Beginner",
                salaryRange: "$25 - $35 / hr",
                description: "Help us take our new SaaS product to market. As a Product Marketing Intern, you will help draft email campaigns, analyze competitor positioning, and assist with our upcoming Product Hunt launch. Strong writing skills are a must.",
                requiredSkills: ["Copywriting", "SEO", "Market Research", "Figma"],
                recruiter: recruiter._id,
                expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) 
            },
            {
                title: "UI/UX Design Intern",
                companyName: "Creative Pixel Agency",
                location: "Seattle, WA",
                jobType: "internship",
                isRemote: true,
                status: "open",
                experienceLevel: "Entry Level",
                salaryRange: "$28 - $40 / hr",
                description: "Are you passionate about user experience? We are looking for a design intern to help wireframe new client websites, conduct basic user testing, and create high-fidelity mockups in Figma.",
                requiredSkills: ["Figma", "UI/UX", "Prototyping", "Adobe Creative Suite"],
                recruiter: recruiter._id,
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) 
            },
            {
                title: "Backend Backend Software Intern",
                companyName: "CloudScale Inc.",
                location: "Chicago, IL",
                jobType: "full-time",
                isRemote: false,
                status: "open",
                experienceLevel: "Entry Level",
                salaryRange: "$35 - $50 / hr",
                description: "Join our backend infrastructure team. You will be writing APIs in Node.js, optimizing MongoDB queries, and learning about containerization with Docker and Kubernetes.",
                requiredSkills: ["Node.js", "MongoDB", "Express", "REST APIs"],
                recruiter: recruiter._id,
                expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) 
            },
             {
                title: "Cybersecurity Analyst Intern",
                companyName: "SecureNet Shield",
                location: "Washington, D.C.",
                jobType: "internship",
                isRemote: true,
                status: "open",
                experienceLevel: "Entry Level",
                salaryRange: "$32 - $48 / hr",
                description: "A fantastic opportunity to learn the ropes of enterprise security. You will shadow our SOC team, assist with vulnerability scanning, and help draft incident response protocols.",
                requiredSkills: ["Networking", "Linux", "Security+", "Python"],
                recruiter: recruiter._id,
                expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) 
            }
        ];

        // 3. Clear existing jobs generated by this recruiter (optional, prevents duplicates if run multiple times)
        console.log("Clearing old dummy jobs...");
        await Job.deleteMany({ recruiter: recruiter._id });

        // 4. Insert new jobs
        console.log(`Inserting ${fakeJobs.length} new jobs...`);
        const insertedJobs = await Job.insertMany(fakeJobs);
        console.log(`Successfully seeded ${insertedJobs.length} jobs!`);

    } catch (error) {
        console.error("Error seeding jobs:", error);
    } finally {
        console.log("Disconnecting from database...");
        mongoose.disconnect();
        process.exit(0);
    }
};

seedJobs();
