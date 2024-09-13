import express from "express";
import {
  getProduct,
  getProducts,
  patchProductIsShow,
  postProduct,
  putProduct,
} from "../controller/product";
import { checkAdminToken } from "../helper/auth";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", checkAdminToken, postProduct);
router.put("/:id", checkAdminToken, putProduct);
router.patch("/:id/is_show", checkAdminToken, patchProductIsShow);

export default router;
