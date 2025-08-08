const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");


module.exports.requireAuth = async (req,res,next)=>{
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    const user = await Account.findOne({token: req.cookies.token});
    if(!user){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    
    const role = await Role.findOne({_id: user.role_id }).select("title permission");
    res.locals.user = user;
    res.locals.role = role;
    next();
  
}
module.exports.checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    const role = res.locals.role;
    if (!role || !Array.isArray(role.permission)) {
      return res.status(403).send("Bạn không có quyền truy cập chức năng này");
    }

    // Cho phép truyền vào 1 string hoặc 1 mảng quyền
    const permissionsToCheck = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    const hasPermission = permissionsToCheck.some((perm) =>
      role.permission.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).send("Bạn không có quyền truy cập chức năng này");
    }

    next();
  };
};
