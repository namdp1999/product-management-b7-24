const express = require("express");
require('dotenv').config();
const app = express();
const port = process.env.PORT;

const databse = require("./config/database");
databse.connect();

const routeClient = require("./routes/client/index.route");

app.set('views', './views'); // Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug

app.use(express.static('public')); // Thiết lập thư mục chứa file tĩnh

routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});