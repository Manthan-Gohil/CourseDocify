import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found" });
          }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
