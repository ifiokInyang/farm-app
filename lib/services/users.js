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
exports.loginAdmin = exports.login = exports.signup = void 0;
const models_1 = __importDefault(require("../models"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const signup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, gender, email, password, address, phone } = data;
    const existingUser = yield models_1.default.User.findOne({ where: { email } });
    const existingPhone = yield models_1.default.User.findOne({ where: { email } });
    if (existingUser) {
        throw new httpError_1.default("User already exist", 400);
    }
    if (existingPhone) {
        throw new httpError_1.default("Phone number already exist", 400);
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const encryptedPassword = yield bcryptjs_1.default.hash(password, salt);
    const user = yield models_1.default.User.create({
        fullname,
        gender,
        email,
        password: encryptedPassword,
        address,
        phone
    });
    delete user.dataValues.password;
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    return Object.assign({ token }, user.dataValues);
});
exports.signup = signup;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const user = yield models_1.default.User.findOne({ where: { email } });
    if (!user) {
        throw new httpError_1.default("Invalid email or password", 400);
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new httpError_1.default("Invalid email or password", 400);
    }
    delete user.dataValues.password;
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    return Object.assign({ token }, user.dataValues);
});
exports.login = login;
const loginAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const user = yield models_1.default.User.findOne({ where: { email } });
    if (!user) {
        throw new httpError_1.default("Invalid email or password", 400);
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new httpError_1.default("Invalid email or password", 400);
    }
    if (user.role !== "admin") {
        throw new httpError_1.default("Unauthorized", 400);
    }
    delete user.dataValues.password;
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    return Object.assign({ token }, user.dataValues);
});
exports.loginAdmin = loginAdmin;
