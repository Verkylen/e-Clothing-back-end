import Joi from "joi";

const cartProductSchema = Joi.object({
    "amount": Joi.number().required(),
    "size": Joi.string().required(),
    "color": Joi.string().required()
});

export default cartProductSchema;