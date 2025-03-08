import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./config/db.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/"
  })
);

app.use("/api/v1/user", userRoutes);
app.listen(PORT, () => {
  console.log(`Connected to server at http://localhost:${PORT}`);
});
