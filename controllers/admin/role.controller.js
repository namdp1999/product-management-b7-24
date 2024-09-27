const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records
  });
}

module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền"
  });
}

module.exports.createPost = async (req, res) => {
  const role = new Role(req.body);
  await role.save();

  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const role = await Role.findOne({
    _id: id,
    deleted: false
  });

  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    role: role
  });
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne({
    _id: id,
    deleted: false
  }, req.body);

  req.flash("success", "Cập nhật thành công!");

  res.redirect(`back`);
}