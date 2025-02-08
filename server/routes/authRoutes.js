import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// Backend route handler example
router.get('/me', isAuthenticated, async (req, res) => {
    try {
        // req.user is usually set by the authenticate middleware
        // after verifying the token/session
        const user = await User.findById(req.user.id).select('-password');
        
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user details'
        });
    }
});
export default router;
