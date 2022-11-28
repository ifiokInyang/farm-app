import Joi from "joi";

const validateProduct = (data:any) => {
    const schema = Joi.object({
            name: Joi.string().required().min(3).max(255),
            quantity: Joi.number().required(),
            category: Joi.string().required().min(3).max(255),
            description: Joi.string().min(3).max(255).required(),
            price: Joi.number().min(0).max(1000000).required(),
        //     countInStock: Joi.number().min(0).max(1000000).required(),
            // rating: Joi.number().min(0).max(5).required(),
            // numReviews: Joi.number().min(0).max(1000000).required(),
    });
    return schema.validate(data);
    };
   export default validateProduct