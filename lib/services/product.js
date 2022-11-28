"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// const {Product} = require ("../models");
const httpError_1 = __importDefault(require("../utils/httpError"));
const env_1 = __importDefault(require("../config/env"));
const models_1 = __importDefault(require("../models"));
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, category, quantity, description, price, authorId, } = data;
    const product = yield models_1.default.FarmProduct.create({
        name,
        image,
        category,
        quantity,
        description,
        price,
        authorId,
    });
    return product;
});
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield models_1.default.FarmProduct.findAll();
    // console.log("finding products", products);
    return products;
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield models_1.default.FarmProduct.findByPk(id);
    if (!product) {
        throw new httpError_1.default("Product not found", 404);
    }
    return product;
});
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield models_1.default.FarmProduct.findByPk(id);
    if (!product) {
        throw new httpError_1.default("Product not found", 404);
    }
    if (product.authorId !== data.userId) {
        throw new httpError_1.default("You are not authorized to update this product", 404);
    }
    const { name, image, category, quantity, description, price } = data;
    product.name = name,
        product.image = image,
        product.category = category,
        product.quantity = quantity,
        product.description = description,
        product.price = price,
        yield product.save();
    return product;
});
const deleteProduct = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield models_1.default.FarmProduct.findByPk(id);
    if (!product) {
        throw new httpError_1.default("Product not found", 404);
    }
    if (product.authorId !== userId) {
        throw new httpError_1.default("You are not authorized to delete this product", 404);
    }
    // console.log('Image Path: ', envsecret);
    const imagePath = path_1.default.join(__dirname, "../../public/", 
    // Nullish Coalescence Operator
    product.image.split(`${env_1.default.FILE_HOST}`)[1]);
    fs_1.default.unlinkSync(imagePath);
    yield product.destroy();
    return product;
});
const getProductsByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield models_1.default.FarmProduct.findAll({
        where: {
            authorId: id,
        },
    });
    return products;
});
exports.default = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByUser
};
