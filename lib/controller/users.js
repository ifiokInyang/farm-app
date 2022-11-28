"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.adminLogin = exports.customerLogin = exports.login = exports.customerSignup = exports.adminSignup = exports.signup = void 0;
const UserServices = __importStar(require("../services/users"));
const usersValidation_1 = require("../utils/usersValidation");
const product_1 = __importDefault(require("../services/product"));
const models_1 = __importDefault(require("../models"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, usersValidation_1.validateUser)(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = yield UserServices.signup(req.body);
        res.status(301).redirect('/login');
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
exports.signup = signup;
//Admin sign up controller
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, gender, email, password, address, phone } = req.body;
        console.log(req.body);
        const existingUser = yield models_1.default.User.findOne({ where: { email: email } });
        if (existingUser) {
            throw new httpError_1.default("User already exist", 400);
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield models_1.default.User.create({
            fullname,
            gender,
            email,
            password: encryptedPassword,
            address,
            phone,
            verified: true,
            role: "admin"
        });
        // check if the admin exist
        const Admin = yield models_1.default.User.findOne({ where: { email } });
        //Generate signature for admin
        let signature = yield (0, jwt_1.GenerateSignature)({
            id: Admin.id,
            email: Admin.email,
            verified: Admin.verified,
        });
        console.log("headers is ", req.headers.authorization);
        return res.status(301).redirect('/adminlogin');
        //   json({
        // 	message: 'Admin created successfully',
        // 	signature,
        // 	verified: Admin.verified
        // })
        // res.status(201).redirect('/dashboard');
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
exports.adminSignup = adminSignup;
const customerSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, gender, email, password, address, phone } = req.body;
        console.log(req.body);
        //Check if user with this email already exist.
        const existingUser = yield models_1.default.User.findOne({ where: { email: email } });
        if (existingUser) {
            throw new httpError_1.default("User already exist", 400);
        }
        const salt = yield bcrypt_1.default.genSalt();
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield models_1.default.User.create({
            fullname,
            gender,
            email,
            password: encryptedPassword,
            address,
            phone,
            verified: false,
            role: "user"
        });
        // check if the user exist
        const User = yield models_1.default.User.findOne({ where: { email } });
        //Generate signature for admin
        let signature = yield (0, jwt_1.GenerateSignature)({
            id: User.id,
            email: User.email,
            verified: User.verified,
        });
        return res.status(301).redirect('/customer-login');
        //   json({
        // 	message: 'Admin created successfully',
        // 	signature,
        // 	verified: Admin.verified
        // })
        // res.status(201).redirect('/dashboard');
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
exports.customerSignup = customerSignup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, usersValidation_1.validateLogin)(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = yield UserServices.login(req.body);
        const products = yield product_1.default.getProductsByUser(user.id);
        req.session.regenerate(function (err) {
            if (err)
                throw new Error(err);
            req.session.user = user;
            req.session.save(function (err) {
                if (err)
                    throw new Error(err);
                res.status(301).redirect('dashboard');
            });
        });
        return;
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
exports.login = login;
const customerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, usersValidation_1.validateLogin)(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = yield UserServices.login(req.body);
        const userFullname = yield user.fullname;
        req.session.regenerate(function (err) {
            if (err)
                throw new Error(err);
            req.session.user = user;
            req.session.save(function (err) {
                if (err)
                    throw new Error(err);
                res.status(301).redirect('customerDashboard');
            });
        });
        return;
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
exports.customerLogin = customerLogin;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, usersValidation_1.validateLogin)(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = yield UserServices.login(req.body);
        const products = yield product_1.default.getProductsByUser(user.id);
        req.session.regenerate(function (err) {
            if (err)
                throw new Error(err);
            req.session.user = user;
            req.session.save(function (err) {
                if (err)
                    throw new Error(err);
                res.status(301).redirect('admindashboard');
            });
        });
        return;
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});
exports.adminLogin = adminLogin;
