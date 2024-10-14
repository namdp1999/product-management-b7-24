const Setting = require("../../models/setting.model");

module.exports.general = async (req, res) => {
  const setting = await Setting.findOne({});

  console.log(setting);

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    setting: setting
  });
};

module.exports.generalPatch = async (req, res) => {
  const existRecord = await Setting.findOne({});
  if(existRecord) {
    await Setting.updateOne({
      _id: existRecord.id
    }, req.body);
  } else {
    const record = new Setting(req.body);
    await record.save();
  }

  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};