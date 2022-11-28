"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const product_1 = __importDefault(require("../controller/product"));
const { upload, fileSizeLimitErrorHandler } = require("../middlewares/multer");
const auth_1 = require("../middlewares/auth");
router.get('/', product_1.default.getProducts);
router.get('/show/:id', product_1.default.getProductById);
router.get('/login', function (req, res, next) {
    res.render('login');
});
//  router.get('/customer-login', ProductController.getProductsWithUserId)
router.get('/customer-signup', function (req, res, next) {
    res.render('customerSignup');
});
router.get('/adminlogin', function (req, res, next) {
    res.render('adminlogin');
});
router.get('/signup', function (req, res, next) {
    res.render('signup');
});
router.get('/admin-signup', function (req, res, next) {
    res.render('adminsignup');
});
//logout
// router.post('/logout',  newUser.logout);
router.use(auth_1.verifyToken);
router.get('/dashboard', product_1.default.getProductsForDashboard
//     function(req: Request, res: Response, next: NextFunction) {
//         res.render('dashboard');
//    }
);
router.get('/admindashboard', product_1.default.getVendorsForAdminDashboard
//     function(req: Request, res: Response, next: NextFunction) {
//         res.render('dashboard');
//    }
);
router.get('/addproduct', function (req, res, next) {
    res.render('addproduct');
});
router.get('/editproduct/:id', product_1.default.getProductByIdForEdit);
router.get('/logout', function (req, res, next) {
    // logout logic
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save(function (err) {
        if (err)
            next(err);
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err)
                next(err);
            res.redirect('/');
        });
    });
});
exports.default = router;
