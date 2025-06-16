import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import { connectDB } from "./lib/db.js"; 
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();
const  PORT = process.env.PORT || 8000
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);



app.listen(PORT,() =>{
    console.log(`listening at  PORT ${PORT}`);
    connectDB();
});