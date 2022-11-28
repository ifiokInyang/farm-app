import ProductService from "../services/product";
import { Request, Response } from "express";
import validateProduct from "../utils/product";
import MSG_TYPES from "../utils/validation/msgTypes";
import envsecret from "../config/env";
import db from "../models";

const createProduct = async (req: any, res: any) => {
	try {
		delete req.body?.image 
		const { error } = validateProduct(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const filepath = req.file.path.split("public")[1];
		const product = await ProductService.createProduct({
			...req.body,
			image: `${envsecret.FILE_HOST}${filepath}`,
			authorId: res.locals?.user?.id,
		});
		res.status(201).redirect('dashboard');
	
	} catch (error: any) {
	
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};


const getProductsForDashboard = async (req: Request, res: Response) => {
	try {
		let products = await ProductService.getProductsByUser(res.locals?.user?.id);
		

		res.status(200).render('dashboard', { products });

	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
}
const getVendorsForAdminDashboard = async (req: Request, res: Response) => {
	try {
		let products = await ProductService.getProductsByUser(res.locals?.user?.id);
		res.status(200).render('admindashboard', { products });

	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
}

const getProducts = async (req: any, res: any) => {
	try {
		let products = await ProductService.getProducts();
		
		res.status(200).render('index.ejs', { products: products });
		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
// const getProductsWithUserId = async (req: any, res: any) => {
// 	try {
// 		let products = await ProductService.getProducts();
		
// 		res.status(200).render('customerDashboard', { products: products });
		
// 	} catch (error: any) {
// 		res.status(error.statusCode || 500).json({ message: error.message });
// 	}
// };
const getProductById = async (req: any, res: any) => {
	try {
		const product = await ProductService.getProductById(req.params.id);
		res.status(200).render('show', {section: product});
		
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

const getProductByIdForEdit = async (req: Request, res: Response) => {
	try {
		const product = await ProductService.getProductById(+req.params.id);
		res.status(200).render('editproduct', {product});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
}

const updateProduct = async (req: any, res: any) => {
	try {
		const { error } = validateProduct(req.body);
		if (error) {
			return res.status(400).json({error});
		}
		
		const product = await ProductService.updateProduct(req.params.id, {
			...req.body,
			userId: res.locals.user.id,
		});
	
		res.status(301).redirect('/dashboard');
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

const deleteProduct = async (req: any, res: any) => {
	try {
		
		const product = await ProductService.deleteProduct(
			req.params.id,
			res.locals?.user?.id
		);
		res.status(301).redirect('/dashboard');
		
	} catch (error: any) {
		
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};


const getProductsByUser = async (req: any, res: any) => {
	try {
		const products = await ProductService.getProductsByUser(
			req.user.id
		);
		res.status(200).json({ message: MSG_TYPES.PRODUCT_FOUND, products });
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

const getProductsUser = async (req: any, res: any) => {
	try {
		const products = await db.FarmProduct.findAll()
		const user = await db.User.findOne({where: {id:req.user.id}})
		const merge = {...products, user}
			res.status(200).render('customerDashboard', { products: merge });
		// res.status(200).json({ message: MSG_TYPES.PRODUCT_FOUND, products });
	} catch (error: any) {
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export default {
	createProduct,  
	getProducts, 
	getProductById, 
	updateProduct, 
	deleteProduct, 
	getProductsByUser,
	getProductsForDashboard,
	getVendorsForAdminDashboard,
	getProductByIdForEdit,
	getProductsUser
}
