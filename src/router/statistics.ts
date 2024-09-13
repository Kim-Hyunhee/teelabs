import express from "express";
import {
  getVisitor,
  getUserDevice,
  getProductByCategories,
  getUserVisitGragh,
  getUserCartList,
  getUserProductClickList,
} from "../controller/statistics";
import { checkAdminToken } from "../helper/auth";

const router = express.Router();

router.get("/visitor", checkAdminToken, getVisitor);
router.get("/visitor/device", checkAdminToken, getUserDevice);
router.get("/product/category", checkAdminToken, getProductByCategories);
router.get("/visitor/graph", checkAdminToken, getUserVisitGragh);
router.get("/users/cart", checkAdminToken, getUserCartList);
router.get("/users/click/product", checkAdminToken, getUserProductClickList);
export default router;
