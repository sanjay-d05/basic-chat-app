import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticated = async(req,res,next) => {
    try {
        const token = req.cookies.chatAccessToken;

        if(!token) return res.status(401).json({success:false,message:'Unauthorized No Token Provided'});

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded) return res.status(401).json({success:false,message:'Unauthorized Invalid Provided'});

        const user = await User.findById(decoded.userId).select("-password");

        if(!user)  if(!token) return res.status(404).json({success:false,message:'No User Found'});

        req.user = user;

        next();
   
        
    } catch (error) {
        console.log('Error from middleware' , error);
        return res.status(500).json({success:false,message:'Internal Server Error'});
    }
};