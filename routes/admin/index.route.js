const dashboardRoute = require("./dashboard.route");

module.exports = (app) => {
  app.use("/admin/dashboard", dashboardRoute);
}