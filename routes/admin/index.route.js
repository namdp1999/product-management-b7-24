const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");

module.exports = (app) => {
  app.use("/admin/dashboard", dashboardRoute);
  
  app.use("/admin/products", productRoute);
}