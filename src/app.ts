import express from "express";
import cors from "cors";
import logger from "morgan";
import "reflect-metadata";
import { swaggerUi, specs } from "./swagger/";
import { databaseConfig } from "./database";
import {
  adminRouter,
  productRouter,
  userRouter,
  categoryRouter,
  locationRouter,
  uploadRouter,
  statisticsRouter,
  cartRouter,
  logRouter,
  uploadFbxRouter,
} from "./router";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload());

app.get("/", (req: any, res: any) => {
  res.send("hello world!");
});

databaseConfig();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/locations", locationRouter);
app.use("/upload", uploadRouter);
app.use("/statistics", statisticsRouter);
app.use("/cart", cartRouter);
app.use("/logs", logRouter);
app.use("/upload", uploadFbxRouter);

export default app;
