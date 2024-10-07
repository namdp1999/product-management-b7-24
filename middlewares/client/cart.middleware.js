const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
  if(!req.cookies.cartId) {
    const expiresDay = 365 * 24 * 60 * 60 * 1000;

    const cart = new Cart({
      expireAt: Date.now() + expiresDay
    });
    await cart.save();

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresDay)
    });

    res.locals.miniCart = 0;
  } else {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    res.locals.miniCart = cart.products.length;
  }

  next();
}