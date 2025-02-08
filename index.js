import express from "express";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import cors from "cors";
import {apiRouter} from "./routes/index.js";

 

import dotenv from 'dotenv';

dotenv.config()

const app = express();
 
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
      origin: ["http://localhost:5173", "https://localhost:3000"],
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      credentials: true,
  })
);

const port = 3000

connectDB();


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


//http://localhost:3000/api/courses/create-course

//http://localhost:3000/api/user/signup
//http://localhost:3000/api/user/login
//http://localhost:3000/api/user/profile
//http://localhost:3000/api/user/edit-profile

//http://localhost:3000/api/mentor/signup
//http://localhost:3000/api/mentor/login
//http://localhost:3000/api/mentor/profile
//http://localhost:3000/api/mentor/edit-profile