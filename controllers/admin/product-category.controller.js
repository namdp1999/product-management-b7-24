const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

module.exports.index = (req, res) => {
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh sách danh mục sản phẩm"
  });
}

module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  });

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    listCategory: listCategory
  });
}

module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countRecord = await ProductCategory.countDocuments();
    req.body.position = countRecord + 1;
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}