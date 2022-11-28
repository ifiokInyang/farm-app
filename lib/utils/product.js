"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateProduct = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().min(3).max(255),
        quantity: joi_1.default.number().required(),
        category: joi_1.default.string().required().min(3).max(255),
        description: joi_1.default.string().min(3).max(255).required(),
        price: joi_1.default.number().min(0).max(1000000).required(),
        //     countInStock: Joi.number().min(0).max(1000000).required(),
        // rating: Joi.number().min(0).max(5).required(),
        // numReviews: Joi.number().min(0).max(1000000).required(),
    });
    return schema.validate(data);
};
exports.default = validateProduct;
