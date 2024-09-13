import express from "express";
import { postUpload } from "../controller/upload";
import { checkAdminToken } from "../helper/auth";

const uploadRouter = express.Router();

uploadRouter.post("/", checkAdminToken, postUpload);

export default uploadRouter;
