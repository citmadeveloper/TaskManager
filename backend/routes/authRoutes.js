import expess from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../Controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = expess.Router();

// Auth Routes 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);


router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "Image upload failed" });
    }
    const imageUrl = req.file.path;

    res.status(200).json({ imageUrl });
});


export default router;

