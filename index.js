import express from "express";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import cors from "cors";
import {apiRouter} from "./routes/index.js";

 

import dotenv from 'dotenv';

dotenv.config()

const app = express();
//const express = require('express')
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
      origin: "http://localhost:5173",
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      credentials: true,
  })
);

const port = 3000

connectDB();
app.use(
  cors({
      origin: ["http://localhost:3000", "https://VCareMart-frontend.vercel.app"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get("test",(req,res)=>{
    res.send("test");
});

app.use("/api",apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
app.all("*", (req, res) => {
  return res.status(404).json({ message: "end-point does not exist" });
});

app.listen(process.env.PORT, (err) => {
  if (err) {
      console.log(err);
  } else {
      console.log(`server starts on port ${port}`)
  }
});


//http://localhost:3000/api/user/login