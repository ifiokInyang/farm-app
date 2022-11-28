import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"
import db from "../models";
import "dotenv/config"
// const jwt= require ("jsonwebtoken");
// const { User } = require("../models");

export async function verifyToken(req: Request, res: Response, next: NextFunction) {

    // console.log(JSON.stringify(req.session.user, null, 2));
    let token: string;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }  else {
        token = <string>req.session?.user?.token;
    }
    // res.send(JSON.stringify({ store: req.sessionStore, session: req.session, id: req.sessionID, token:}, null, 2))
    // return ;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        // console.log("decoded", decoded);
        const user = await db.User.findOne({ where: { id: decoded.id}})
        res.locals.user = user;
        next();
    } catch (error) {
        // res.status(400).send("Invalid token");
        // console.error(error);
        res.status(400).render('login', { message: "You Are Not Logged In" });
    }
}

// Logout

