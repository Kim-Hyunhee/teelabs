import express from "express";
import { postLogsProduct, postClickProductLog } from "../controller/logs";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.post("/product", checkToken, postLogsProduct);
router.post("/click/product", checkToken, postClickProductLog);

export default router;
