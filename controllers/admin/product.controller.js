const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const moment = require("moment");

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

  // Sắp xếp
  const sort = {};

  if(req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    sort[sortKey] = sortValue;
  } else {
    sort["position"] = "desc";
  }
  // Hết Sắp xếp

  const products = await Product
    .find(find)
    .limit(limitItems)
    .skip(skip)
    .sort(sort);

  for (const item of products) {
    // Tạo bởi
    const infoCreated = await Account.findOne({
      _id: item.createdBy
    });

    if(infoCreated) {
      item.createdByFullName = infoCreated.fullName;
    } else {
      item.createdByFullName = "";
    }

    if(item.createdAt) {
      item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YY");
    }

    // Cập nhật bởi
    const infoUpdated = await Account.findOne({
      _id: item.updatedBy
    });

    if(infoUpdated) {
      item.updatedByFullName = infoUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    if(item.updatedAt) {
      item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YY");
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    totalPage: totalPage,
    currentPage: page,
    limitItems: limitItems
  });
}

module.exports.changeStatus = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status,
    updatedBy: res.locals.user.id,
    updatedAt: new Date()
  });

  req.flash('success', 'Đổi trạng thái thành công!');

  res.json({
    code: "success"
  });
}

module.exports.changeMulti = async (req, res) => {
  switch (req.body.status) {
    case 'active':
    case 'inactive':
      await Product.updateMany({
        _id: req.body.ids
      }, {
        status: req.body.status,
        updatedBy: res.locals.user.id,
        updatedAt: new Date()
      });

      req.flash('success', 'Đổi trạng thái thành công!');

      res.json({
        code: "success"
      });
      break;
    case 'delete':
      await Product.updateMany({
        _id: req.body.ids
      }, {
        deleted: true,
        deletedBy: res.locals.user.id,
        deletedAt: new Date()
      });

      req.flash('success', 'Xóa thành công!');

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
    deleted: true,
    deletedBy: res.locals.user.id,
    deletedAt: new Date()
  });

  req.flash('success', 'Xóa thành công!');

  res.json({
    code: "success"
  });
}

module.exports.changePosition = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    position: req.body.position,
    updatedBy: res.locals.user.id,
    updatedAt: new Date()
  });

  req.flash('success', 'Đổi vị trí thành công!');

  res.json({
    code: "success"
  });
}

module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  });

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    listCategory: listCategory
  });
}

module.exports.createPost = async (req, res) => {
  if(res.locals.role.permissions.includes("products_create")) {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.createdBy = res.locals.user.id;
    req.body.createdAt = new Date();
  
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countRecord = await Product.countDocuments();
      req.body.position = countRecord + 1;
    }
  
    const record = new Product(req.body);
    await record.save();
  }

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({
    _id: id,
    deleted: false
  });

  const listCategory = await ProductCategory.find({
    deleted: false
  });

  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    listCategory: listCategory
  });
}

module.exports.editPatch = async (req, res) => {
  if(res.locals.role.permissions.includes("products_edit")) {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.updatedBy = res.locals.user.id;
    req.body.updatedAt = new Date();

    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    }

    await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
  }
}

module.exports.detail = async (req, res) => {
  if(res.locals.role.permissions.includes("products_view")) {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false
    });

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  }
}