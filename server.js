const express = require("express");
let path = require('path');
const clientRegister = require("./routes/auth-client/register");
const productRoutes = require("./routes/products/products");
const authLogin = require("./routes/auth-admin/admin")
let cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors(""));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/auth/admin", authLogin)
app.use("/auth/client", clientRegister);
app.use("/api/products/", productRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("server is running on port " + port);
});
