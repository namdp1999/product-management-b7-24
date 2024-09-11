const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  // Lọc theo trạng thái
  if(req.query.status) {
    find.status = req.query.status;
  }
  // Hết Lọc theo trạng thái

  // Tìm kiếm
  if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // Hết Tìm kiếm

  const products = await Product.find(find);

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products
  });
}