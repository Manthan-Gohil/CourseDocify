import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"; // Authentication routes
import fileRoutes from "./routes/fileRoutes.js"; // File upload and processing routes

const app = express()

dotenv.config()

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser()); // Enable reading/writing cookies

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/files", fileRoutes); // File upload and processing routes

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Server has started successfully !!!');
});

app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`);
})