"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users_1 = __importDefault(require("./users"));
const product_1 = __importDefault(require("./product"));
const pages_1 = __importDefault(require("./pages"));
/* GET home page. */
router.use("/", users_1.default);
router.use("/", pages_1.default);
router.use("/product", product_1.default);
exports.default = router;
