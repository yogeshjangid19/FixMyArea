

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/Auth.js';
import issueRoutes from './routes/Issues.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fixmyarea-portal.netlify.app"
  ]
}));app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/issues', issueRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));