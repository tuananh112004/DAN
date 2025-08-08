const Account = require("../../models/account.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");
const generate = require("../../helper/generate");
const sendMail = require("../../helper/sendmail");

//[GET] /admin/auth/login
module.exports.login = async (req,res)=>{
    res.render("admin/pages/auth/login",{
        pageTitle: "Login Page"
    });
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req,res)=>{
    
    const email = req.body.email;
    const password = md5(req.body.password);
    //const password = req.body.password;
    const user = await Account.findOne(
        {   
            email: email,
            deleted: false
        });
    if(!user){
        req.flash("error","Tai khoan khong ton tai");
        res.redirect("back");
        return;
    }
    if(password != user.password){
        req.flash("error","Sai password");
        res.redirect("back");
        return;
    }
    if(user.status == "inactive"){
        req.flash("error","Tai khoan bi khoa");
        res.redirect("back");
        return;
    }
    res.cookie("token",user.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

//[GET] /admin/auth/logout
module.exports.logout = async (req,res)=>{
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}

//[GET] /admin/auth/forgot-password
module.exports.forgotPassword = async (req,res)=>{
    res.render("admin/pages/auth/forgot-password",{
        pageTitle: "Quên mật khẩu"
    });
}

//[POST] /admin/auth/forgot-password
module.exports.forgotPasswordPost = async (req,res)=>{
    const email = req.body.email;
    
    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error","Email không tồn tại trong hệ thống");
        res.redirect("back");
        return;
    }

    const otp = generate.generateRandomNumber(6);
    
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date()
    };

    await ForgotPassword.create(objectForgotPassword);

    const subject = "Mã OTP xác minh quên mật khẩu";
    const html = `
        Mã OTP của bạn là: <b>${otp}</b>
        <br>
        Mã này có hiệu lực trong 3 phút.
    `;

    sendMail.sendMail(email, subject, html);

    req.flash("success","Mã OTP đã được gửi đến email của bạn");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/otp-password`);
}

//[GET] /admin/auth/otp-password
module.exports.otpPassword = async (req,res)=>{
    res.render("admin/pages/auth/otp-password",{
        pageTitle: "Nhập mã OTP"
    });
}

//[POST] /admin/auth/otp-password
module.exports.otpPasswordPost = async (req,res)=>{
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        req.flash("error","Mã OTP không đúng");
        res.redirect("back");
        return;
    }

    const user = await Account.findOne({
        email: email
    });

    res.cookie("tokenUser", user.token);

    res.redirect(`/${systemConfig.prefixAdmin}/auth/reset-password`);
}

//[GET] /admin/auth/reset-password
module.exports.resetPassword = async (req,res)=>{
    res.render("admin/pages/auth/reset-password",{
        pageTitle: "Đặt lại mật khẩu"
    });
}

//[POST] /admin/auth/reset-password
module.exports.resetPasswordPost = async (req,res)=>{
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;

    if(password !== confirmPassword){
        req.flash("error","Mật khẩu xác nhận không khớp");
        res.redirect("back");
        return;
    }

    await Account.updateOne(
        { token: tokenUser },
        { password: md5(password) }
    );

    res.clearCookie("tokenUser");

    req.flash("success","Đổi mật khẩu thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}