import express from "express";
import { getLocations, getLocation } from "../controller/location";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.get("/", getLocations);
router.get("/:id", getLocation);

export default router;
