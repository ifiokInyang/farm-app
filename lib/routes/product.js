"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const product_1 = __importDefault(require("../controller/product"));
const { upload, fileSizeLimitErrorHandler } = require("../middlewares/multer");
const auth_1 = require("../middlewares/auth");
// const verifyToken = require("../middlewares/auth");
router.post("/", auth_1.verifyToken, upload === null || upload === void 0 ? void 0 : upload.single("image"), fileSizeLimitErrorHandler, product_1.default.createProduct);
router.get("/", product_1.default.getProducts);
router.get("/:id", product_1.default.getProductById);
router.put("/:id", auth_1.verifyToken, upload === null || upload === void 0 ? void 0 : upload.single("image"), fileSizeLimitErrorHandler, product_1.default.updateProduct);
router.delete("/:id", auth_1.verifyToken, product_1.default.deleteProduct);
router.get("/:user/products", auth_1.verifyToken, product_1.default.getProductsByUser);
//Customer dashboard
router.get("/:user/dashboard", auth_1.verifyToken, product_1.default.getProductsUser);
exports.default = router;
