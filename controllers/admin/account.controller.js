module.exports.index = (req, res) => {
  res.render("admin/pages/accounts/index", {
    pageTitle: "Tài khoản quản trị"
  });
}