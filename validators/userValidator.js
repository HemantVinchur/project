const { Joi, celebrate } = require('celebrate')
const signupReqValidator = celebrate({
    body: Joi.object().keys({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        contact: Joi.string().required(),
        state: Joi.string().required(),
    })
})

const verifyEmailValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required()
    })
})

const verifyOTPValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        otp: Joi.string().regex(/^[0-9]{4}$/).required(),
    })
})


const signinReqValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
})

const resetPasswordValidator = celebrate({
    body: Joi.object().keys({
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    })
})

module.exports = { signupReqValidator, verifyEmailValidator, verifyOTPValidator, signinReqValidator, resetPasswordValidator }