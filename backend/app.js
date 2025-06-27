const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("../backend/database/db.connect");
const fs = require("fs");

const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const PORT =  process.env.PORT||3000;

app.use(express.json());

app.use(cookieParser());

 
app.use(cors({
  origin: 'https://expensify-1-0oc2.onrender.com', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
const userroutes = require("./routes/user.auth.routes");
const categoryroutes = require("./routes/category.route");
const incomeroutes = require("./routes/income.routes");
const expenseroutes = require("./routes/expense.route");
const dashboardroutes = require("./routes/dashboard.route");
app.use("/api/v1/users", userroutes);
app.use("/api/v1/categories", categoryroutes);
app.use("/api/v1/incomes", incomeroutes);
app.use("/api/v1/expenses", expenseroutes);
app.use("/api/v1/dashboard", dashboardroutes);
app.get("/", (req, res) => {
  res.send("Hello home");
});
const server = () => {
  db();
  app.listen(PORT , () => {
    console.log("Listening on port", PORT);
  });
};
server();
