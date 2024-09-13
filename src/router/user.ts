import express from "express";
import {
  getUsers,
  getUser,
  postUserToken,
  getUserName,
} from "../controller/user";
import { checkAdminToken, checkToken } from "../helper/auth";

const router = express.Router();

router.post("/log-in", postUserToken);
router.get("/name", checkToken, getUserName);
router.get("/", checkAdminToken, getUsers);
router.get("/:id", checkAdminToken, getUser);

export default router;
