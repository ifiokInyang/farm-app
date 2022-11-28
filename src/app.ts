import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import methodOverride from "method-override";
const SequelizeStore = require("connect-session-sequelize")(session.Store);;


import indexRouter from "./routes/index";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(session({
	secret: <string>process.env.SESSION_SECRET,  //instance of nodejs running on my machine
    resave: true,
    saveUninitialized: true,
}))

//Adding static files
app.use(express.static('public'));

// view engine setup
app.set("views", path.join(__dirname, path.sep, "/views"));
app.set("view engine", "ejs");

// console.log('dir is ', __dirname)
// console.log('views path is ', path.join(__dirname, path.sep, "/views"))

app.use(express.static(path.join(__dirname, 'public')))


app.use("/", indexRouter);

/*
 * app.use("/page", pageRouter)
 * app.use("/user", userRouter)
 * app.use("/product", productRouter)
 */

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
	next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});



module.exports = app;
