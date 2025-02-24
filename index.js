import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
   origin: ["http://localhost:5173","http://localhost:3000"], // Allowed origins
 //   origin: ["http://localhost:5173", "https://v-care-mart-frontend.vercel.app","https://vcaremart-backend.onrender.com"], // Allowed origins
    
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials
  })
);

// Connect to the database
connectDB();

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// CORS test endpoint
app.get('/test-cors', (req, res) => {
  res.json({ message: "CORS is working!" });
});

// Preflight requests
//app.options('*', cors());

// API routes
app.use("/api", apiRouter);

// Handle 404 for undefined routes
app.all("*", (req, res) => {
  return res.status(404).json({ message: "Endpoint does not exist" });
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server starts on port ${port}`);
  }
});
