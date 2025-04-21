import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"]
};

mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1); // Stop server if MongoDB fails
    }
};

// ✅ Middleware
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

// ✅ Test API Endpoint
app.get("/", (req, res) => {
    res.send("✅ API is Working!");
});

// ✅ Routes
app.use("/api/v1/auth", authRoute); // API route for authentication

// ✅ Start Server
app.listen(port, async () => {
    await connectDB(); // Ensure DB is connected before accepting requests
    console.log(`🚀 Server running on port ${port}`);
});
