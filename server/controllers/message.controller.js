import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../config/cloudinary.js';
import {getReceiverSocketId , io} from '../config/socket.js';


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({success:true,message:'Message sent successfully',data:newMessage});
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    return res.status(500).json({success:false, message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return res.status(200).json({success:true,message:'Messages fetched successfully',data:messages});
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    return res.status(500).json({success:false, message: "Internal server error" });
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    return res.status(200).json({success:true,message:'Users fetched for sidebar',data:filteredUsers});
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    return res.status(500).json({success:false, message: "Internal server error" });
  }
};



