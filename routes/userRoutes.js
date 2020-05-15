const router = require('express').Router();
const userValidator = require('../validators/userValidator');
const services = require('../services/userServices');
const functions = require('../function');
console.log("userRoutes....................")


//Signup

router.post('/signup', userValidator.signupReqValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignup(payLoad);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signup successful",
                    data: newData.userData
                })
            } else if (newData.findData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Email already exists",
                    data: {}
                })
            } else if (newData.mobileData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Mobile no. already exists",
                    data: {}
                })
            } else if (!newData.sendMail) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Mail does not send",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User already registered",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Signup unsuccessful",
                data: {}
            })
        }

    })


//Verify Email

router.post('/verifyEmail', userValidator.verifyEmailValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            console.log(payLoad);
            let newData = await services.verifyEmailServices(payLoad);
            if (newData.findData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Email verified",
                    data: newData.findData
                })
            } else if (!newData.sendMail) {
                return res.status(200).json({
                    statusCode: 409,
                    message: "Mail does not send.",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Email is not verified",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error);

        }
    })


//Verify OTP
router.post('/verifyOTP', userValidator.verifyOTPValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            console.log(payLoad);
            let newData = await services.verifyOTPServices(payLoad);
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "OTP verified",
                    data: newData.find
                })
            } else if (newData.find) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "OTP is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Email is not correct",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error);

        }
    })


//User reset password

router.post('/resetPassword', userValidator.resetPasswordValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.resetPassServices(payLoad);
            console.log(newData)
            if (newData.updateData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Password successfully updated",
                    data: newData.updateData
                })
            } else if (!newData.findData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not exists",
                    data: {}
                })
            } else if (newData.confirm) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Confirm password is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Password does not updated",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Password does not updated",
                data: {}
            })
        }
    })


//User change password

router.post('/changePassword', userValidator.changePasswordValidator,
    async(req, res) => {
        try {

            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let decodeCode = await functions.authenticate(token)
            if (!decodeCode) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            token.accessToken = decodeCode.accessToken
            let payLoad = req.body;
            let newData = await services.changePassServices(payLoad, token);
            console.log(newData)
            if (newData.updateData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Password successfully updated",
                    data: newData.updateData
                })
            } else if (!newData.findData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not exists",
                    data: {}
                })
            } else if (newData.confirm) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Old password is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Password does not updated",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Password does not updated",
                data: {}
            })
        }
    })

//Signin

router.post('/signin', userValidator.signinReqValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignIn(payLoad);
            if (newData.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "SignIn successful",
                    data: newData.userInfo
                })
            } else if (newData.verification) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User is not verified, please verify first and then signin",
                    data: {}
                })
            } else if (!newData.data) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User not found",
                    data: {}
                })
            } else if (!newData.isPasswordValid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Incorrect password",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Signin unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Signin unsuccessful",
                data: {}
            })
        }

    })


//Signin via accesstoken

router.post('/signinviatoken',
    async(req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);
            let data = await services.signinViaTokenService(token);
            if (data.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signin successful",
                    data: data.userInfo
                })
            } else if (!data.userData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User not found",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Signin unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access token is not correct",
                data: {}
            })
        }
    })


//Edit profile:-

router.put('/editProfile',
    async(req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let decodeCode = await functions.authenticate(token)
            if (!decodeCode) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            token.accessToken = decodeCode.accessToken
            let payLoad = req.body;
            let newData = await services.updateProfile(payLoad, token);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Profile successfully updated",
                    data: newData.userData
                })
            } else if (newData.Invalid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Invalid credentials",
                    data: {}
                })
            } else if (newData.invalid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Access token or email is not correct",
                    data: {}
                })
            } else if (newData.accesstoken) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access token not found",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Profile does not updated",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Profile does not updated",
                data: {}
            })


        }

    })


//Add states-:

router.post('/addStates', userValidator.addStatesValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.addStates(payLoad);
            console.log(newData)
            if (newData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "States successfully added",
                    data: newData
                })
            } else {
                return res.status(200).json({
                    statusCode: 500,
                    message: "States does not added",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "States does not added",
                data: {}
            })
        }

    })


//List of states-:

router.get('/listOfStates',
    async(req, res) => {
        try {
            var data = await services.listOfStates();
            if (data) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "List of states successfully fetched",
                    data: data
                })
            } else if (data.empty) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "List of states does not present",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 404,
                    message: "List of states does not present",
                    data: {}
                })
            }
        } catch (error) {
            res.status(200).json({
                statusCode: 401,
                message: "Internal error, please check access token",
                data: {}
            })

        }

    })

//User Logout

router.post('/logout',
    async(req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.userLogout(token);
            if (data) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Logout successful",
                    data: data
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Logout unsuccessful",
                    data: data
                })
            }
        } catch (error) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access token is not correct",
                data: {}
            })
        }
    })

module.exports = router;