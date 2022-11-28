import Joi from "joi";

const validateUser = (user: string) => {
    const schema = Joi.object({
            fullname: Joi.string().required().min(3).max(50),
            email: Joi.string().email().required(),
            gender: Joi.string().required(),
            phone: Joi.string().required().min(11).max(13),
            address: Joi.string().required(),
            password: Joi.string().min(8).max(12).required(),
    });
    return schema.validate(user);
    };
    
    const validateLogin = (user: string) => {
        const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
        });
        return schema.validate(user);
        };

   export { validateUser, validateLogin };