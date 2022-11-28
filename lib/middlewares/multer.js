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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSizeLimitErrorHandler = exports.upload = void 0;
const path_1 = require("path");
const multer_1 = __importStar(require("multer"));
const fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err) {
        console.log(err);
        next(err);
    }
    else {
        next();
    }
};
exports.fileSizeLimitErrorHandler = fileSizeLimitErrorHandler;
//Set The Storage Engine
const storage = (0, multer_1.diskStorage)({
    destination: function (req, file, cb) {
        cb(null, (0, path_1.join)(__dirname, "../../public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname +
            "-" +
            new Date().toISOString().replace(/:/g, "-") +
            (0, path_1.extname)(file.originalname));
    },
});
//Check File Type
function checkFileType(file, cb) {
    //Allowed ext
    const filetypes = /jpeg|jpeg|jpg|png|gif/;
    //Check ext
    const extname = filetypes.test((0, path_1.extname)(file.originalname).toLowerCase());
    //Check mine
    const mimetype = filetypes.test(file.mimetype);
    console.log(file);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb({ message: "Error: Images Only!" });
    }
}
//Init Upload
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 100000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.upload = upload;
