import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import http from "http";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
 
const cert = process.env.CERT;
const key = process.env.PRIVATE_KEY;
console.log(cert + "Cert and key" + key)

const options = {
  key: fs.readFileSync(key),                  //Change Private Key Path here
  cert: fs.readFileSync(cert),            //Change Main Certificate Path here

  }


import users from "./routes/user.mjs";
import records from "./routes/record.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());


app.use ((reg,res,next)=>
{
  res.setHeader('Access-Control-Allow-Origins','*');
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Methods','*');
  next();
})

app.use("/user", users);
app.use("/record", records);

let server = http.createServer(app)

app.get('/',(req,res)=>{
  res.send('HTTPS in ExpressJS')
})

//start the Express server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});