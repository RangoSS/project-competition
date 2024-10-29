import express from "express";
import connectToDB from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // initialize dotenv

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// initialize db connection
connectToDB();

app.get("/", (req, res) => {
    res.send("the brave codershg");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
