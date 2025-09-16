const mongoose = require("mongoose");
const User = require("../models/user.model");
const Verification = require("../models/verify.model");
const errorHandler = require("../utils/error");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const verification = require("../models/verify.model");


const getRequest = (req, res) => {
    try {

        res.status(201).json({
            status : "Success",
            message : "Hello World!"
        });
        console.log("ok");

    } catch (error) {
        next(error);
        console.log(error);
        console.log("catch"); 
    }
}


const getUser = async (req,res,next) => {
    try {
        const userId = req.params.userId;
        const findUser = await User.findById(userId);
        
        if (!findUser) {
            return next(errorHandler(401, "User  Not Found"));
        }

        res.status(200).json({
            status : "Success",
            message : "User successfully found"
        });

        console.log(findUser);

    } catch (error) {
        next(error);
        console.log(error);
        console.log("catch"); 
    }
}



const deleteUser = async (req,res,next) => {
    try {
        const findUser = await User.findByIdAndDelete(req.params.userId)
        console.log(findUser);
        res.status(200).json({
            status : "Success",
            message : "User has been deleted"
        })

    } catch (error) {
        next(error);
        console.log(error);
        console.log("catch"); 
    }
}




const forgetPassword = async (req,res,next) => {
    const {email} = req.body;
    try {
        
        if ( !email) {
            return next(errorHandler(401 , "The Field most be filled"));
        }

        await Verification.deleteMany();
        const checkUser = await User.findOne({email});

        if (!checkUser) {
            return next(errorHandler(404 , "User with given email Not exists"));
        }

        if (checkUser.verified !== true) {
            return next(errorHandler(401 , "You are not verified"));
        }


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        })


        // Generate a 6-digit code
        const code = crypto.randomInt(100000, 999999).toString();
        const emailHTML = `
            <!DOCTYPE html>
        <html lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تأیید ایمیل - BARIN TRADE</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap"
            rel="stylesheet"
            />
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
        
                body {
                    font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
                    direction: rtl;
                    background-color: #f0f2f5;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 550px;
                    margin: 50px auto;
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    border: 2px solid #007bff;
                }
        
                .logo {
                    width: 120px;
                    margin-bottom: 15px;
                }
        
                h1 {
                    font-size: 22px;
                    color: #333333;
                    font-weight: 700;
                }
        
                p {
                    font-size: 16px;
                    color: #555;
                    margin-bottom: 20px;
                    line-height: 1.8;
                }
        
                .code {
                    display: inline-block;
                    background: linear-gradient(135deg, #007bff, #00b4db);
                    color: #ffffff;
                    font-size: 22px;
                    font-weight: bold;
                    padding: 14px 26px;
                    border-radius: 8px;
                    letter-spacing: 4px;
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                    margin: 15px 0;
                    transition: 0.3s;
                }
        
                .code:hover {
                    transform: scale(1.05);
                }
        
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    color: #777;
                }
        
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 700;
                }
        
                .footer a:hover {
                    text-decoration: underline;
                }
        
                @media (max-width: 600px) {
                    .container {
                        width: 90%;
                        padding: 20px;
                    }
        
                    .code {
                        font-size: 20px;
                        padding: 12px 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://baryntrade.s3.ir-thr-at1.arvanstorage.ir/logo.jpg?versionId=" alt="BARIN TRADE Logo" class="logo">
                <h1>کد تأیید ایمیل شما</h1>
                <p>پیوسته اید خرسندیم! لطفا کد زیر را برای فعال سازی حساب خود وارد کنید BARIN TRADE از اینکه به</p>
                <div class="code">${code}</div>
                <p>اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
                <div class="footer">
                    &copy; ۲۰۲۵ <a href="https://barin-co.com">BARIN TRADE</a>. تمامی حقوق محفوظ است.
                </div>
            </div>
        </body>
        </html>
        `;

        const newVerification = new Verification({
            username : checkUser.username,
            contact : checkUser.contact,
            password: checkUser.password,
            email,
            code,
            expiresAt: Date.now() + 10 * 60 * 1000,
            verified : false,
        });

        // Save the code in DB with expiration (10 minutes)
        const verificationDetail = await newVerification.save();
        console.log(verificationDetail);

        
        // Send the email
        transporter.sendMail({
            from: "mohammad.arhami.20050902@gmail.com", //  Sender address
            to: email, // Receiver
            subject: "New Request", // Subject line
            html: emailHTML, // HTML body
        });
        
        res.status(200).json({ message: "Reques Sent" });
        console.log("ok");
        
    } catch (error) {
        next(error);
        console.log(error);
        console.log("catch");    
    }
}


const verify = async (req,res,next) => {
    const {email,code} = req.body;
    try {

        if (!email || !code) {
            return next(errorHandler(401 , "The Field most be filled"));
        }
        
        const checkUser = await Verification.findOne({email});

        if (!checkUser) {
            return next(errorHandler(401 , "Email not found"));
        }
        
        if (checkUser.code !== code) {
            return next(errorHandler(401 , "The code is wrong"));
        }
        

        if (new Date(checkUser.expiresAt) < Date.now()) {
            return next(errorHandler(401 , "The code has expired"));
        }

        const verifyUser = await Verification.updateOne({email} , {verified : true});
        console.log(verifyUser);

        res.status(201).json({
            status : "Success" ,
            message : "User Verified"
        });
        
    } catch (error) {
        next(error);
        console.log(error);
        console.log("catch");  
    }
}


const newPassword = async (req,res,next) => {
    const {email,password} = req.body;
    try {

        if (!email || !password) {
            return next(errorHandler(401 , "Fields most be filled in"));
        }

        const checkUser = await Verification.findOne({email});

        if (!checkUser ) {
            return next(errorHandler(404 , "User not found"));
        }

        if (checkUser.verified !== true) {
            return next(errorHandler(404 , "User not verified"));
        }

        const findUser = await User.findOne({email});

        if (!findUser) {
            return next(errorHandler(401 , "Email is incorrect"))
        }

        if (password < 8) {
            return next(errorHandler(401 , "Password is too short"))
        }

        const hashPassword = bcrypt.hashSync(password , 10);
        await User.updateOne({email} , {password : hashPassword});
        await verification.deleteMany();

        res.status(201).json({
            status : " Success",
            message : "New Password Succesfuly Registered"
        });

    } catch (error) {
        next(error);
        console.log(error);
        console.log("catch"); 
    }
}


module.exports = {
    getRequest,
    getUser,
    deleteUser,
    forgetPassword,
    verify,
    newPassword,
}