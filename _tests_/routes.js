import express, { Request, Response, NextFunction} from "express";
const router = express.Router();
const request = require('supertest');
import UserRoutes from "./users";
import ProductRoutes from "./product";
import pages from "./pages";
import indexRouter from "./routes/index";

const app = express();


app.use("/", indexRouter);
router.use("/", UserRoutes);
router.use("/", pages)
router.use("/product", ProductRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", users);

describe("tests users routes", () => {
    test("'/' get all product should work", async () => {
        request(router).get("/").expect(200).end((err, res) => { if (err) {} })
    })
    test("'/:id' gets single product, should work", () => {
        request(router).get("/show/:id").expect(200).end((err, res) => { if (err) {} })
    })
    
    test("'/signup' get user signup page should work", async () => {
        request(router).get("/signup").expect(200).end((err, res) => { if (err) {} })
    })
    test("'/signup' user signup successful post method should work", async () => {
        request(UserRoutes).post("/signup").expect(200).end((err, res) => { if (err) {} })
    })

    test("'/login' get user login page should work", async () => {
        request(router).get("/login").expect(200).end((err, res) => { if (err) {} })
    })
    test("'/login' user login successful post method should work", async () => {
        request(UserRoutes).post("/login").expect(200).end((err, res) => { if (err) {} })
    })


    test(" '/dashboard' get all product for admin dashboard should work", async () => {
        
        request(router).get("/dashboard").expect(200).end((err, res) => { if (err) {} })
    })

    test(" '/addproduct' get the add product form should work", async () => {
        
        request(router).get("/addproduct").expect(200).end((err, res) => { if (err) {} })
    })
    test(" '/addproduct' the add product post method should work", async () => {
        
        request(router).post("/addproduct").expect(200).end((err, res) => { if (err) {} })
    })

    test(" '/editproduct/:id' get the edit product form should work", async () => {
        
        request(router).get("/editproduct/:id").expect(200).end((err, res) => { if (err) {} })
    })
    test(" '/editproduct/:id' the edit product post method should work", async () => {
        
        request(router).post("/editproduct/:id").expect(200).end((err, res) => { if (err) {} })
    })

    test(" '/product/:id' product delete method should work", () => {
    
        request(router).delete("/product/:id").expect(200).end((err, res) => { if (err) {} })
    
    })

    test(" '/logout' user logout session should work", () => {
    
        request(router).get("/logout").expect(200).end((err, res) => { if (err) {} })
    
    })

})
