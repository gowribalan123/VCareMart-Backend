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
      //origin: ["https://v-care-mart.vercel.app/", "https://v-care-mart-backend.vercel.app/"],
    //front end Local development      http://localhost:5173
    //front end production domain      https://v-care-mart.vercel.app/
    //backend production domain        https://v-care-mart-backend.vercel.app/ 

<<<<<<< HEAD
      origin: ["http://localhost:5173", "https://v-care-mart.vercel.app","https://v-care-mart-backend.vercel.app"],
=======
      origin: ["https://v-care-mart.vercel.app/"],
>>>>>>> e3af3538197cfed4cf21a7f0604bec1fce6a560c
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
 // console.log(`Example app listening on port ${port}`)
});
app.all("*", (req, res) => {
  return res.status(404).json({ message: "end-point does not exist" });
});

app.listen(process.env.PORT, (err) => {
  if (err) {
   //   console.log(err);
  } else {
     // console.log(`server starts on port ${port}`)
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
