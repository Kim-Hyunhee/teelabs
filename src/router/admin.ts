import express from "express";
import { postAdminLogin, patchPassword } from "../controller/admin";
import { checkAdminToken } from "../helper/auth";

const router = express.Router();

router.post("/log-in", postAdminLogin);
router.patch("/password", checkAdminToken, patchPassword);

export default router;
