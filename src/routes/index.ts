import express, { Request, Response, NextFunction} from "express";
const router = express.Router();
import ProductService from "../services/product";
import validateProduct from "../utils/product";
import MSG_TYPES from "../utils/validation/msgTypes";
import UserRoutes from "./users";
import ProductRoutes from "./product";
import pages from "./pages";

/* GET home page. */

router.use("/", UserRoutes);
router.use("/", pages)
router.use("/product", ProductRoutes);

export default router;
