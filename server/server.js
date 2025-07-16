import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import {app,server} from './config/socket.js';
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

const PORT = process.env.PORT;
const CLIENT_URI = process.env.CLIENT_URI;
const allowedOrigins = [
    CLIENT_URI,
    'http://localhost:3000',
    'https://basic-chat-app-client.onrender.com'
];

/* middleware */
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get('/' , async(req,res) => {
    res.json('Test is working');
});

app.use('/api/auth' , authRoutes);
app.use('/api/message' , messageRoutes);

connectDB().then(() => {
    server.listen(PORT,() => {
        console.log(`Server is running on PORT ${PORT}`);
    })
}).catch((err) => {
    console.log('Server connection error',error);
})


