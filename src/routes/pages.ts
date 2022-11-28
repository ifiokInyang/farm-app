import express, { Request, Response, NextFunction} from "express";
const router = express.Router();

import ProductController from "../controller/product";
// const { upload, fileSizeLimitErrorHandler } = require("../middlewares/multer");
import { verifyToken } from "../middlewares/auth";


    router.get('/', ProductController.getProducts)

    router.get('/show/:id', ProductController.getProductById) 

    router.get('/login', function(req: Request, res: Response, next: NextFunction) {
        res.render('login');
   });
  //  router.get('/customer-login', ProductController.getProductsWithUserId)
   router.get('/customer-signup', function(req: Request, res: Response, next: NextFunction) {
    res.render('customerSignup');
});
   router.get('/adminlogin', function(req: Request, res: Response, next: NextFunction) {
    res.render('adminlogin');
});
    router.get('/signup', function(req: Request, res: Response, next: NextFunction) {
        res.render('signup');
      }); 
    router.get('/admin-signup', function(req: Request, res: Response, next: NextFunction) {
      res.render('adminsignup');
    }); 
    //logout
    // router.post('/logout',  newUser.logout);

    router.use(verifyToken)

    router.get('/dashboard', ProductController.getProductsForDashboard
//     function(req: Request, res: Response, next: NextFunction) {
//         res.render('dashboard');
//    }
   );
   router.get('/admindashboard', ProductController.getVendorsForAdminDashboard
//     function(req: Request, res: Response, next: NextFunction) {
//         res.render('dashboard');
//    }
   );
    router.get('/addproduct', function(req: Request, res: Response, next: NextFunction) {
        res.render('addproduct');
   });
   
    router.get('/editproduct/:id',
    ProductController.getProductByIdForEdit
   );

    router.get('/logout', function (req: Request, res:Response, next:NextFunction) {
    // logout logic
  
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null
    req.session.save(function (err) {
      if (err) next(err)
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
        res.redirect('/')
      })
    })
  });

 
export default router