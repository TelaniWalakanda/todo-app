import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import connectDB from "./config/db.js";

dotenv.config();  

const app = express();

app.use(express.json());

app.use("/api/todos", todoRoutes);

app.listen(5000, () => {
  connectDB();
  console.log("Server is running on port 5000 : http://localhost:5000");
});