"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validateUser = (user) => {
    const schema = joi_1.default.object({
        fullname: joi_1.default.string().required().min(3).max(50),
        email: joi_1.default.string().email().required(),
        gender: joi_1.default.string().required(),
        phone: joi_1.default.string().required().min(11).max(13),
        address: joi_1.default.string().required(),
        password: joi_1.default.string().min(8).max(12).required(),
    });
    return schema.validate(user);
};
exports.validateUser = validateUser;
const validateLogin = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    return schema.validate(user);
};
exports.validateLogin = validateLogin;
