const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config();
const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

const databse = require("./config/database");
databse.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

app.set('views', './views'); // Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug

app.use(express.static('public')); // Thiết lập thư mục chứa file tĩnh

// Khai báo biến toàn cục cho file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// parse application/json
app.use(bodyParser.json());

// Khai báo đường dẫn
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});