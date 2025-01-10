import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import { app, server } from "./socket/socket.js";

import path from "path";
// const PORT = process.env.PORT || 8000;
dotenv.config();


const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
// const corsOptions = {
//     origin: "https://insta-clone-frontend-hif5m79fk-mandavras-projects.vercel.app",
//     credentials: true 
//   };

// app.use(cors(corsOptions));
const corsOptions = {
    origin: ["insta-clone-frontend-pi.vercel.app", "insta-clone-frontend-9cd0eaof7-mandavras-projects.vercel.app", "http://localhost:5173"," http://localhost:5175"],
    credentials: true
};

app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);



app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("/", (req, res) => {
    res.send("Hello World");
})


server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});