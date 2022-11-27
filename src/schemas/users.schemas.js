import Joi from "joi";

const newUserSchema = Joi.object({
    "username": Joi.string().required(),
    "email": Joi.string().email().required(),
    "password": Joi.string().required(),
    "repeatPassword": Joi.ref('password'),
    "profilePicture": Joi.any().required()
});

const userSchema = Joi.object({
    "email": Joi.string().email().required(),
    "password": Joi.string().required(),
    "keepLogged": Joi.bool().required()
});

export {
    userSchema,
    newUserSchema
}