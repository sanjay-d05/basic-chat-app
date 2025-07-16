import express from "express";
import { checkAuth, deleteUser, getProfile, login, logout, signup, updateAbout, updatePassword, updateProfilePic } from "../controllers/auth.controller.js";
import {isAuthenticated} from '../middleware/auth.middleware.js';

const router = express.Router();

/* post */
router.post('/signup' , signup);
router.post('/login' , login);
router.post('/logout' , logout);

/* get */
router.get('/profile/:id' , isAuthenticated , getProfile);
router.get('/check' , isAuthenticated , checkAuth);

/* put or update */
router.put('/update-password/:id' , isAuthenticated , updatePassword);
router.put('/update-about/:id' , isAuthenticated , updateAbout);
router.put('/update-profile-pic/:id' , isAuthenticated , updateProfilePic);

/* delete */
router.delete('/delete/:id' , isAuthenticated , deleteUser);

export default router;