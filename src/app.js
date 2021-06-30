require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const buildingsRouter = require("./buildings/buildings-router");
const companyRouter = require("./company/company-router");
const employeeRouter = require("./employee/employee-router");
const officeRouter = require("./office/office-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));

app.use(helmet());

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.use("/api/buildings", buildingsRouter);
app.use("/api/company", companyRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/office", officeRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "Server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
