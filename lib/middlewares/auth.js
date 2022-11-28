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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../models"));
require("dotenv/config");
// const jwt= require ("jsonwebtoken");
// const { User } = require("../models");
function verifyToken(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(JSON.stringify(req.session.user, null, 2));
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else {
            token = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.token;
        }
        // res.send(JSON.stringify({ store: req.sessionStore, session: req.session, id: req.sessionID, token:}, null, 2))
        // return ;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // console.log("decoded", decoded);
            const user = yield models_1.default.User.findOne({ where: { id: decoded.id } });
            res.locals.user = user;
            next();
        }
        catch (error) {
            // res.status(400).send("Invalid token");
            // console.error(error);
            res.status(400).render('login', { message: "You Are Not Logged In" });
        }
    });
}
exports.verifyToken = verifyToken;
// Logout
