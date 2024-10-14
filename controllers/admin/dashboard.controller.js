const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // Sản phẩm
  statistic.product.total = await Product.countDocuments({
    deleted: false
  });

  statistic.product.active = await Product.countDocuments({
    status: "active",
    deleted: false
  });

  statistic.product.inactive = await Product.countDocuments({
    status: "inactive",
    deleted: false
  });
  // Hết Sản phẩm

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
}