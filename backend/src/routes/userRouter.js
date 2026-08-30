import express from "express";
import { loginUser, 
    registerUser ,
    uploadAvatar
}
     from "../controllers/usercontroller.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/avatar',verifyToken,upload.single('avatar'),uploadAvatar)

export default router