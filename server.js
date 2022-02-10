import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import multer from "multer";
import { upload } from "./middleware/multer.js";
import multipart from "connect-multiparty";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

import packageRoutes from "./routes/packageRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import newsLetterRoutes from "./routes/newLetterRoutes.js"
import pageRoutes from './routes/pageRoutes.js'

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(multipart());

app.use(express.json());
app.use(cors());
// Passport middleware
app.use(passport.initialize());

app.use("/api/package", packageRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/newsletter", newsLetterRoutes)
app.use("/api/page", pageRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.json({ success: true, clientID: process.env.PAYPAL_CLIENT_ID })
);
app.get("/auth/facebook", passport.authenticate("facebook"));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/api", (req, res) => {
  res.send("API is running....");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
