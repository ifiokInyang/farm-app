import express from "express";
const router = express.Router();

import ProductController from "../controller/product";
const { upload, fileSizeLimitErrorHandler } = require("../middlewares/multer");
import { verifyToken } from "../middlewares/auth";
// const verifyToken = require("../middlewares/auth");

router.post(
	"/",
	verifyToken,
	upload?.single("image"),
	fileSizeLimitErrorHandler,
	ProductController.createProduct
); 

router.get("/", ProductController.getProducts);

router.get("/:id", ProductController.getProductById);

router.put(
	"/:id",
	verifyToken,
	upload?.single("image"),
	fileSizeLimitErrorHandler,
	ProductController.updateProduct
);

router.delete("/:id", verifyToken, ProductController.deleteProduct);



router.get("/:user/products", verifyToken, ProductController.getProductsByUser);
//Customer dashboard
router.get("/:user/dashboard", verifyToken, ProductController.getProductsUser);


export default router;