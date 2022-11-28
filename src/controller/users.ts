import { Request, Response } from "express";
import * as UserServices from "../services/users";
import { validateUser, validateLogin } from "../utils/usersValidation";
import MSG_TYPES from "../utils/validation/msgTypes";
import ProductService from "../services/product";
import { Session } from "inspector";
import db from "../models";
import HttpError from "../utils/httpError";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from "uuid";
import { GenerateSignature } from "../utils/jwt";
import { boolean } from "joi";

declare module 'express-session' {
    interface SessionData {
        user: any
    }
}

export const signup = async (req: Request, res: Response) => {
	try {
		const { error } = validateUser(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const user = await UserServices.signup(req.body);
		res.status(301).redirect('/login');
		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
//Admin sign up controller
export const adminSignup = async (req: Request, res: Response) => {
	try {
		const { fullname, gender, email, password, address, phone } = req.body;
		console.log(req.body)
		const existingUser = await db.User.findOne({ where: { email:email } });
		if(existingUser){
			throw new HttpError("User already exist", 400);
		}
		const salt = await bcrypt.genSalt(10);
	    const encryptedPassword = await bcrypt.hash(password, salt);
	 	const user = await db.User.create({
		fullname,
		gender,
		email,
		password: encryptedPassword,
		address,
		phone,
		verified:true,
		role:"admin"
	});
	// check if the admin exist
	  const Admin = await db.User.findOne({ where: { email } });
	  //Generate signature for admin
	  let signature = await GenerateSignature({
		id: Admin.id,
		email: Admin.email,
		verified: Admin.verified,
	  });
	  console.log("headers is ", req.headers.authorization)
	  return res.status(301).redirect('/adminlogin');
	  
	//   json({
	// 	message: 'Admin created successfully',
	// 	signature,
	// 	verified: Admin.verified
	// })
	
		// res.status(201).redirect('/dashboard');
		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
export const customerSignup = async (req: Request, res: Response) => {
	try {
		const { fullname, gender, email, password, address, phone } = req.body;
		console.log(req.body)
		//Check if user with this email already exist.
		const existingUser = await db.User.findOne({ where: { email:email } });
		if(existingUser){
			throw new HttpError("User already exist", 400);
		}
		const salt = await bcrypt.genSalt();
	    const encryptedPassword = await bcrypt.hash(password, salt);
	 	const user = await db.User.create({
		fullname,
		gender,
		email,
		password: encryptedPassword,
		address,
		phone,
		verified:false,
		role:"user"
	});
	// check if the user exist
	  const User = await db.User.findOne({ where: { email } });
	  //Generate signature for admin
	  let signature = await GenerateSignature({
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
		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { error } = validateLogin(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const user = await UserServices.login(req.body);
		const products = await ProductService.getProductsByUser(
			user.id
		);
		req.session.regenerate(function (err) {
			if (err) throw new Error(err)
			
			req.session.user = user;
			req.session.save(function (err) {
			  if (err) throw new Error(err)
			
			res.status(301).redirect('dashboard');
			})
		})
		return;

		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
export const customerLogin = async (req: Request, res: Response) => {
	try {
		const { error } = validateLogin(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const user = await UserServices.login(req.body);
		const userFullname = await user.fullname
		req.session.regenerate(function (err) {
			if (err) throw new Error(err)
			
			req.session.user = user;
			req.session.save(function (err) {
			  if (err) throw new Error(err)
			
			res.status(301).redirect('customerDashboard');
			})
		})
		return;

		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
export const adminLogin = async (req: Request, res: Response) => {
	try {
		const { error } = validateLogin(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const user = await UserServices.login(req.body);
		const products = await ProductService.getProductsByUser(
			user.id
		);
		req.session.regenerate(function (err) {
			if (err) throw new Error(err)
			
			req.session.user = user;
			req.session.save(function (err) {
			  if (err) throw new Error(err)
			res.status(301).redirect('admindashboard');
			})
		})
		return;
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};


