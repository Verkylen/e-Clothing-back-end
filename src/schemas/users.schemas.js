import Joi from "joi";

const newUserSchema = Joi.object({
    "username": Joi.string().required(),
    "email": Joi.string().email().required(),
    "password": Joi.string().required(),
    "repeatPassword": Joi.ref('password')
});

export default newUserSchema;