const functions = require('../function');
const user = require('../models/user');
const userAuth = require('../models/userAuth');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
//......................................................User onboard started.................................................................................................................................................................................................................................................


//Signup

const userSignup = async(payLoad) => {
    try {
        console.log(payLoad)
        let findData = await user.findOne({ email: payLoad.email });
        console.log(findData)
        let mobileData = await user.findOne({ contact: payLoad.contact });
        let hashObj = functions.hashPassword(payLoad.password)
        console.log(hashObj)
        delete payLoad.password
        payLoad.salt = hashObj.salt
        payLoad.password = hashObj.hash
        if (!findData) {
            if (!mobileData) {
                otp = Math.floor(1000 + Math.random() * 9000);
                if (otp) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'venus.bityotta@gmail.com',
                            pass: 'venus@123'
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    const mailOptions = {
                        from: 'venus.bityotta@gmail.com',
                        to: payLoad.email,
                        subject: "OTP verification mail",
                        text: "Hi, " + "\n" + "Your OTP is " + otp
                    };

                    var sendMail = await transporter.sendMail(mailOptions);


                } else {
                    var data = "OTP does not created"
                }
                data = { fullName: payLoad.fullName, email: payLoad.email, contact: payLoad.contact, salt: payLoad.salt, password: payLoad.password, otp: otp }
                var userData = await user.create(data);
                console.log(userData)
            } else {
                console.log("User already signup");
            }
        } else {
            console.log("User already signup");
        }
        console.log(userData)
        return { userData, findData, mobileData, sendMail };
    } catch (error) {
        console.error(error)
        throw error
    }
}


//verifyEmail:-

const verifyEmailServices = async(payLoad) => {
    try {
        let find = await user.findOne({ email: payLoad.email });
        if (find) {
            console.log("Email is correct");
            otp = Math.floor(1000 + Math.random() * 9000);
            if (otp) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'venus.bityotta@gmail.com',
                        pass: 'venus@123'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                const mailOptions = {
                    from: 'venus.bityotta@gmail.com',
                    to: payLoad.email,
                    subject: "OTP verification mail",
                    text: "Hi, " + "\n" + "Your OTP is " + otp
                };

                var sendMail = await transporter.sendMail(mailOptions);
                var userData = await user.updateOne({
                    email: payLoad.email
                }, {
                    $set: {
                        otp: otp
                    }
                });
                var findData = await user.findOne({ email: payLoad.email });
            } else {
                console.log("OTP does not created.");
            }
        } else {
            console.log("Email is not correct");
        }
        return { findData, sendMail }
    } catch (error) {
        console.error(error);
        res.status(200).json({
            statusCode: 400,
            message: "Error",
            data: {}
        })
    }
}


//verifyOTP:-

const verifyOTPServices = async(payLoad) => {
    try {
        let find = await user.findOne({ email: payLoad.email });
        if (find) {
            if (find.isVerified == false) {
                if (find.otp == payLoad.otp) {
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        $set: {
                            isVerified: true
                        }
                    });
                } else {
                    console.log("OTP is not correct")
                }
            } else {
                if (find.otp == payLoad.otp) {
                    var userData = "Email is verified"
                } else {
                    console.log("OTP is not correct")
                }
            }
        } else {
            console.log("Email is not correct")
        }
        return { find, userData }
    } catch (error) {
        console.error(error);
        res.status(200).json({
            statusCode: 400,
            message: "Error",
            data: {}
        })
    }
}


//Reset password:-

const resetPassServices = async(payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        if (find.email) {
            var findData = await user.findOne({ email: find.email });
            if (!findData) {
                return "User does not exist";
            } else {
                if (payLoad.password == payLoad.confirmPassword) {
                    let hashObj = functions.hashPassword(payLoad.password);
                    console.log(hashObj)
                    delete password;
                    payLoad.salt = hashObj.salt;
                    payLoad.password = hashObj.hash;
                    var updateData = await user.updateOne({ email: find.email }, {
                        $set: {
                            password: payLoad.password,
                            salt: payLoad.salt
                        }
                    }, { new: true });
                } else {
                    var confirm = "Confirm password is not correct"
                }
            }
        } else {
            return "User does not exists";
        }
        return { updateData, findData, confirm };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Signin:-

const userSignIn = async(payLoad) => {

    try {
        let data = await user.findOne({ email: payLoad.email });
        let authData = await userAuth.findOne({ email: payLoad.email });
        if (!data) {
            console.log("User not found")
        } else if (data.isVerified == false) {
            var verification = "User is not verified"
            console.log("User is not verified")
        } else {
            var isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
        }
        if (!isPasswordValid) {
            console.log("Incorrect password")
        } else if (authData) {
            console.log("Access token is already created.")
            var userInfo = { fullName: data.fullName, email: data.email, contact: data.contact, accessToken: authData.accessToken }
        } else {
            let token = jwt.sign({ email: payLoad.email }, 's3cr3t');
            console.log("Token-:", token)
            var userData = await userAuth.create({ email: payLoad.email, accessToken: token });
            var userInfo = { fullName: data.fullName, email: data.email, contact: data.contact, accessToken: userData.accessToken }
        }
        return { data, isPasswordValid, userInfo, verification, authData }
    } catch (error) {
        console.log(error)
        throw error
    }
}


//Signin via access token:-

const signinViaTokenService = async(token) => {
    try {
        let decodedData = await functions.authenticate(token);
        console.log(decodedData)
        if (!decodedData) {
            console.log("Access token is not correct")
        }
        let userData = await userAuth.findOne({
            accessToken: token
        })
        if (!userData) {
            console.log("User not found")
        } else {
            let userInfo = await user.findOne({ email: userData.email });
            return { userInfo, decodedData, userData }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


//Edit profile

const updateProfile = async(payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        if (find) {
            if (find.email == payLoad.email) {
                if (payLoad.fullName) {
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        fullName: payLoad.fullName
                    });
                }
                if (payLoad.contact) {
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        contact: payLoad.contact
                    });
                }
                if (payLoad.password) {
                    let hashObj = functions.hashPassword(payLoad.password)
                    console.log(hashObj)
                    delete payLoad.password
                    payLoad.salt = hashObj.salt
                    payLoad.password = hashObj.hash
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        password: payLoad.password,
                        salt: payLoad.salt
                    });
                } else {
                    var Invalid = "Invalid credentials";
                }
            } else {
                var invalid = "Access token or email is not correct";
            }
        } else {
            console.log("Access token is null")
            var accesstoken = "Access token is null"
        }
        return { userData, Invalid, invalid, accesstoken };
    } catch (error) {
        console.error(error)
        throw error

    }

}

//User Logout

const userLogout = async(token) => {
    try {
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            console.log("Access token not found")
        }
        token.accessToken = decodeCode.accessToken
        let deletetoken = await userAuth.deleteOne(token.accessToken)
        return deletetoken
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { userSignup, verifyEmailServices, verifyOTPServices, resetPassServices, userSignIn, signinViaTokenService, updateProfile, userLogout }