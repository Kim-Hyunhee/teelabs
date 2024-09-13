import express from "express";
import { postCart, deleteCart, getCart } from "../controller/cart";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.post("/", checkToken, postCart);
router.get("/", checkToken, getCart);
router.delete("/", checkToken, deleteCart);

export default router;
