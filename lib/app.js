"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_session_1 = __importDefault(require("express-session"));
const method_override_1 = __importDefault(require("method-override"));
const SequelizeStore = require("connect-session-sequelize")(express_session_1.default.Store);
;
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, method_override_1.default)('_method'));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
//Adding static files
app.use(express_1.default.static('public'));
// view engine setup
app.set("views", path_1.default.join(__dirname, path_1.default.sep, "/views"));
app.set("view engine", "ejs");
// console.log('dir is ', __dirname)
// console.log('views path is ', path.join(__dirname, path.sep, "/views"))
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use("/", index_1.default);
/*
 * app.use("/page", pageRouter)
 * app.use("/user", userRouter)
 * app.use("/product", productRouter)
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
