import express from "express";
const app = express();
import "dotenv/config.js";
import mongoose from "mongoose";
import { UserRouter } from "./server/user/routes/userRouter.js";
import { TicketRoutes } from "./server/ticket/routes/ticketRouter.js";
import { DepartmentRouter } from "./server/department/routes/departmentRouter.js";
import { BranchRouter } from "./server/branch/routes/branchRouter.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.use('/api/users', UserRouter);
app.use('/api/ticket', TicketRoutes)
app.use('/api/department',DepartmentRouter)
app.use('/api/branch',BranchRouter)
app.use(express.static(path.join(__dirname, "/client/dist")))


app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
})

mongoose
  // .connect(process.env.DB_URI, { dbName: "ticketing_system" })
  .connect("mongodb://127.0.0.1:27017/bernales_ticketing_db")
  .then(()=> {
    console.log("Connection on mongodb is on.")
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(process.env.PORT,()=> {
  console.log(`Your application is running on port http://localhost:${process.env.PORT}`)
})
