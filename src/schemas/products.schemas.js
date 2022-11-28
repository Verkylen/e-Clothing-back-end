import Joi from "joi";

const cartProductSchema = Joi.object({
    "amount": Joi.number().required(),
    "size": Joi.string().email().required(),
    "color": Joi.string().required()
});

export default cartProductSchema;