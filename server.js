import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from "cors";
import userRouters from "./routers/userRoutes.js"

dotenv.config(); // initialize dotenv

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(cookieParser()); // for parsing cookies


app.use("/api",userRouters)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
