const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const userRoute = require("./user.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

const cartMiddleware = require("../../middlewares/client/cart.middleware");

const userMiddleware = require("../../middlewares/client/user.middleware");

const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cart);

  app.use(userMiddleware.infoUser);

  app.use(settingMiddleware.general);

  app.use("/", homeRoute);
  
  app.use("/products", productRoute);

  app.use("/cart", cartRoute);

  app.use("/order", orderRoute);

  app.use("/user", userRoute);

  app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  });
}