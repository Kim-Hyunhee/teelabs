import express from "express";
import { postFbx } from "../controller/upload";
import { checkAdminToken } from "../helper/auth";

const uploadFbxRouter = express.Router();

uploadFbxRouter.post("/fbx", checkAdminToken, postFbx);

export default uploadFbxRouter;
