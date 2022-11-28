import express from 'express';
const UserRoutes = express.Router();

import * as UserControllers from "../controller/users";

UserRoutes.post("/signup", UserControllers.signup);
UserRoutes.post("/login", UserControllers.login);
UserRoutes.post("/customer-signup", UserControllers.customerSignup)
UserRoutes.post("/customer-login", UserControllers.customerLogin);
UserRoutes.post("/admin", UserControllers.adminSignup)
UserRoutes.post("/admin-login", UserControllers.adminLogin)
// UserRoutes.post("/logout", UserControllers.logout);




export default UserRoutes; 