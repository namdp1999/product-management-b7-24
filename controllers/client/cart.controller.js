const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;

  let total = 0;

  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId,
      deleted: false,
      status: "active"
    });

    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;

    item.priceNew = infoItem.price;
    if(infoItem.discountPercentage > 0) {
      item.priceNew = (1 - infoItem.discountPercentage/100) * infoItem.price;
      item.priceNew = item.priceNew.toFixed(0);
    }

    item.total = item.priceNew * item.quantity;

    total += item.total;
  }

  res.render("client/pages/cart/index", {
  pageTitle: "Giỏ hàng",
  products: products,
  total: total
});
};

module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;

  const existProduct = products.find(item => item.productId == req.params.id);

  if(existProduct) {
    existProduct.quantity = existProduct.quantity + parseInt(req.body.quantity);
  } else {
    const product = {
      productId: req.params.id,
      quantity: parseInt(req.body.quantity)
    };
  
    products.push(product);
  }

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });

  res.redirect("back");
}