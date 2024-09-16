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

  // Phân trang
  let limitItems = 4;
  let page = 1;

  if(req.query.page) {
    page = parseInt(req.query.page);
  }

  if(req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }

  const skip = (page - 1) * limitItems;

  const totalProduct = await Product.countDocuments(find);
  const totalPage = Math.ceil(totalProduct/limitItems);
  // Hết Phân trang

  const products = await Product
    .find(find)
    .limit(limitItems)
    .skip(skip)
    .sort({
      position: "desc"
    });

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    totalPage: totalPage,
    currentPage: page
  });
}

module.exports.changeStatus = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status
  });

  res.json({
    code: "success",
    message: "Đổi trạng thái thành công!"
  });
}

module.exports.changeMulti = async (req, res) => {
  switch (req.body.status) {
    case 'active':
    case 'inactive':
      await Product.updateMany({
        _id: req.body.ids
      }, {
        status: req.body.status
      });

      res.json({
        code: "success",
        message: "Đổi trạng thái thành công!"
      });
      break;
    case 'delete':
      await Product.updateMany({
        _id: req.body.ids
      }, {
        deleted: true
      });

      res.json({
        code: "success",
        message: "Xóa thành công!"
      });
      break;
    default:
      res.json({
        code: "error",
        message: "Trạng thái không hợp lệ!"
      });
      break;
  }
}

module.exports.delete = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    deleted: true
  });

  res.json({
    code: "success",
    message: "Đổi trạng thái thành công!"
  });
}

module.exports.changePosition = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    position: req.body.position
  });

  res.json({
    code: "success",
    message: "Đổi vị trí thành công!"
  });
}