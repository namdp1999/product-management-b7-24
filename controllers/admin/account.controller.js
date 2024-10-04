const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  const records = await Account.find({
    deleted: false
  });

  for (const item of records) {
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false
    });

    item.role_title = role.title;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Tài khoản quản trị",
    records: records
  });
}

module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản quản trị",
    roles: roles
  });
}

module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);
  req.body.token = generateHelper.generateRandomString(30);
  
  const account = new Account(req.body);
  await account.save();

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.edit = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false
  });

  res.render("admin/pages/accounts/edit", {
    pageTitle: "Chỉnh sửa tài khoản quản trị",
    roles: roles,
    account: account
  });
}

module.exports.editPatch = async (req, res) => {
  await Account.updateOne({
    _id: req.params.id,
    deleted: false
  }, req.body);

  req.flash("success", "Cập nhật thành công!");

  res.redirect(`back`);
}

module.exports.changePassword = async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false
  });

  res.render("admin/pages/accounts/change-password", {
    pageTitle: "Đổi mật khẩu",
    account: account
  });
}

module.exports.changePasswordPatch = async (req, res) => {
  await Account.updateOne({
    _id: req.params.id,
    deleted: false
  }, {
    password: md5(req.body.password)
  });

  req.flash("success", "Cập nhật mật khẩu thành công!");

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.myProfile = async (req, res) => {
  res.render("admin/pages/accounts/my-profile", {
    pageTitle: "Thông tin cá nhân"
  });
}