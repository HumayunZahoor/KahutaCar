import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import fbRoutes from "./routes/fbRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  console.log("Connected to MongoDB")
  try {
    
      console.log('Connected to MongoDB Now...!');

  } catch (err) {
    console.error('Error checking Admin:', err);
  }
}

).catch((err) => console.error('Error connecting to MongoDB:', err))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL , 'https://kahuta-frontend.vercel.app/'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter);
app.use("/admin", adminRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/driver", driverRoutes);
app.use("/ride", rideRoutes);
app.use("/feedback", fbRoutes);


const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
