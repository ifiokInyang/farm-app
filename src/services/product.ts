import fs from "fs";
import path from "path";
// const {Product} = require ("../models");
import HttpError from "../utils/httpError";
import envsecret  from "../config/env";
import db from "../models";

const createProduct = async (data:any) =>{
const {
    name,
    image,
    category,
    quantity,
    description,
    price,
    authorId,
    
  
} = data;
const product = await db.FarmProduct.create({
    name,
    image,
    category,
    quantity,
    description,
    price,
    authorId,
})
return product;
}

const getProducts = async ()=> {
    const products = await db.FarmProduct.findAll()
    // console.log("finding products", products);
    return products
}

const getProductById = async(id:Number) => {
    const product = await db.FarmProduct.findByPk(id)
    if(!product){
        throw new HttpError("Product not found", 404)
    }
    return product
}

const updateProduct = async(id:Number, data:any)=> {
    const product = await db.FarmProduct.findByPk(id)
    if(!product){
        throw new HttpError("Product not found", 404)
    }
    if(product.authorId !== data.userId){
        throw new HttpError("You are not authorized to update this product", 404)
    }
    const {
        name,
        image,
        category,
        quantity,
        description,
        price
    }= data
    product.name = name, 
    product.image= image,  
    product.category = category, 
    product.quantity = quantity, 
    product.description = description, 
    product.price = price, 
    
    await product.save();
    return product;
}

const deleteProduct = async (id:Number, userId:string) => {
    const product = await db.FarmProduct.findByPk(id)
    if(!product){
        throw new HttpError("Product not found", 404)
    }
    if(product.authorId !== userId){
        throw new HttpError("You are not authorized to delete this product", 404)
    }
    // console.log('Image Path: ', envsecret);
    const imagePath = path.join(
    __dirname, 
    "../../public/", 
    // Nullish Coalescence Operator
product.image.split(`${envsecret.FILE_HOST}`)[1]);


    fs.unlinkSync(imagePath);
    await product.destroy();
    return product;
}

const getProductsByUser = async (id:Number) => {
    const products = await db.FarmProduct.findAll({
        where: {
            authorId: id,
        },
    })
    return products;
}
export default {
    createProduct,  
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    getProductsByUser
}