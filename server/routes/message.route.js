import express from "express";
import {isAuthenticated} from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

/* post */
router.post("/send/:id", isAuthenticated , sendMessage);

/* get */
router.get("/users", isAuthenticated , getUsersForSidebar);
router.get("/:id", isAuthenticated , getMessages);

/* put or update */

/* delete */

export default router;