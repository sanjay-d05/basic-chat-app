import mongoose from 'mongoose';

export const connectDB = async() => {{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connection successful' , mongoose.connection.host);
    } catch (error) {
        console.log('Database connection failed' , error);
    }
}}