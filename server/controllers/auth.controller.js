import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import {generateToken} from '../config/utils.js';

export const signup = async(req,res) => {
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password) return res.status(400).json({success:false,message:'All Fields are required'});

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)) return res.status(400).json({success:false,message:'Invalid Email'});

        if(password.length < 8) return res.status(400).json({success:false,message:'Password must be 8 characters long'});

        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({success:false,message:'User already found'});

        /* hash password */
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        /* create new user */
        const newUser = await User.create({
            name , email , password:hashedPassword
        });

        return res.status(201).json({success:true,message:'Account Created Successfully',data:newUser});

    } catch (error) {
        console.log('Error from signup route' , error);
        return res.status(500).json({success:false,message:'Internal server error'});
    }
};

export const login = async(req,res) => {
    try {
        const {email,password} = req.body;

        if(!email || !password) return res.status(400).json({success:false,message:'All Fields are required'});

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({success:false,message:'Invalid Credentials'});

        const isPasswordMatch = await bcrypt.compare(password , user.password);

        if(!isPasswordMatch) return res.status(400).json({success:false,message:'Inavlid Credentials'});

        generateToken(user._id , res);

        return res.status(200).json({success:true,message:'Logged in successfully',data:{
            _id:user._id,
            name:user.name,
            email:user.email,
            about:user.about,
            profilePic:user.profilePic,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }});

    } catch (error) {
        console.log('Error from login route' , error);
        return res.status(500).json({success:false,message:'Internal server error'});
    }
};

export const logout = async(req,res) => {
    try {
        res.clearCookie('chatAccessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        return res.status(200).json({success:true,message:'Logged out successfully'});
    } catch (error) {
        console.log('Error from logout route' , error);
        return res.status(500).json({success:false,message:'Internal server error'});
    }
};

export const checkAuth = async(req,res) => {
    try {
        return res.status(200).json({success:true,message:'Token Provided',data:req.user});
    } catch (error) {
        console.log('Error from check auth route' , error);
        return res.status(500).json({success:false,message:'Internal server error'});
    }
};

export const getProfile = async(req,res) => {
    try {
        const id = req.params.id;

        const profile = await User.findById(id).select("-password");

        if(!profile) return res.status(400).json({success:false,message:'No Profile found'});

        return res.status(200).json({success:true,message:'Profile Fetched Successfully',data:profile});
        
    } catch (error) {
        console.log('Error from get profile route' , error);
        return res.status(500).json({success:false,message:'Internal Server Error'});
    }
};

export const updatePassword = async(req,res) => {
    try {
        const id = req.params.id;
        const {password,newPassword,conformNewPassword} = req.body;
                
        const user = await User.findById(id);

        if(!password || !newPassword || !conformNewPassword) return res.status(400).json({success:false,message:'All Fields are required'});

        const checkPassword = await bcrypt.compare(password,user.password);

        if(!checkPassword) return res.status(400).json({success:false,message:'Your password is Incorrect'});

        if(newPassword.length < 8) return res.status(400).json({success:false,message:'New password must be 8 characters'});

        if(newPassword !== conformNewPassword) return res.status(400).json({success:false,message:'New Password does not match with conform new password'});

        const isPasswordMatch = await bcrypt.compare(newPassword,user.password);

        if(isPasswordMatch) return res.status(400).json({success:false,message:'New password is same as the old password'});

        /* hash password */
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword,salt);

        /* update password in the user */
        user.password = hashedNewPassword;

        await user.save();

        return res.status(200).json({success:true,message:'Password updated successfully !'});

    } catch (error) {
        console.log('Error from update password route' , error);
        return res.status(500).json({success:false,message:'Internal server error'});
    }
};

export const updateAbout = async(req,res) => {
    try {
        const id = req.params.id;
        const {about} = req.body;

        const updatedUser = await User.findByIdAndUpdate(id , {about} , {new:true}).select("-password");

        if(!updatedUser) return res.status(400).json({success:false,message:'No User profile found'});

        return res.status(200).json({success:true,message:'About updated successfully',data:updatedUser});
        
    } catch (error) {
        console.log('Error from update about route' , error);
        return res.status(500).json({success:false,message:'Internal Server Error'});
    }
};

export const updateProfilePic = async(req,res) => {
    try {
        const id = req.params.id;
        const {profilePic} = req.body;

        if(!profilePic) return res.status(400).json({success:false,message:'Profile picture is required'});

        let imageUrl;
        if(profilePic){
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            imageUrl = uploadResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(id , {profilePic:imageUrl},{new:true}).select("-password");

        return res.status(200).json({success:true,message:'Profile Pic Updated Successfully',data:updatedUser});
        
    } catch (error) {
        console.log('Error from update profile pic route' , error);
        return res.status(500).json({success:false,message:'Internal Server Error'});
    }
};

export const deleteUser = async(req,res) => {
    try {
        const id = req.params.id;

        const deletedUser = await User.findByIdAndDelete(id);

        return res.status(200).json({success:true,message:'Deleted User successfully',data:deletedUser});
        
    } catch (error) {
        console.log('Error from delete User route' , error);
        return res.status(500).json({success:false,message:'Internal Server Error'});
    }
};

