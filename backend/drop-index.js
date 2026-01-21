import mongoose from 'mongoose';

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/userDetails';

async function dropIndex() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the unique index on candidate field
        await mongoose.connection.collection('resumes').dropIndex('candidate_1');
        console.log('Successfully dropped candidate_1 index');

        // Show remaining indexes
        const indexes = await mongoose.connection.collection('resumes').indexes();
        console.log('Remaining indexes:', indexes);

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

dropIndex();
