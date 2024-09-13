import express from "express";
import {
  getCategories,
  getCategory,
  getCategoryProducts,
} from "../controller/category";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id/products", getCategoryProducts);
router.get("/:id", getCategory);

export default router;
