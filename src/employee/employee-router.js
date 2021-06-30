const path = require("path");
const express = require("express");
const employeeRouter = express.Router();
const jsonParser = express.json();

const EmployeeService = require("./employee-service");

const serializeEmployee = (employee) => ({
  employeeid: employee.employeeid,
  employee_name: employee.employee_name,
  employee_title: employee.employee_title,
  companyid: Number(employee.companyid),
});

employeeRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    EmployeeService.getAllEmployee(knexInstance)
      .then((employee) => {
        if (!employee) {
          return res.status(400).json({
            error: { message: `Employee doesn't exist` },
          });
        }
        res.json(employee.map(serializeEmployee));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { employee_name, employee_title, companyid } = req.body;
    const newEmployee = {
      employee_name,
      employee_title,
      companyid,
    };

    //each value in new employee is required, verify that they were sent
    for (const [key, value] of Object.entries(newEmployee)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    const knexInstance = req.app.get("db");
    EmployeeService.insertEmployee(knexInstance, newEmployee)
      .then((employee) => {
        res
          .status(201)
          .location(
            path.posix.join(req.originalUrl + `/${employee.employeeid}`)
          )
          .json(serializeEmployee(employee));
      })
      .catch(next);
  });

employeeRouter
  .route("/:employeeid")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    EmployeeService.getById(knexInstance, req.params.employeeid)
      .then((employee) => {
        if (!employee) {
          return res.status(404).json({
            error: { message: `Employee doesn't exist` },
          });
        }
        res.employee = employee;
        next();
        res.json(serializeEmployee(employee));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeEmployee(res.employee));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    EmployeeService.deleteEmployee(knexInstance, req.params.employeeid)
      .then((employee) => {
        res.status(204).json(employee);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { employee_name, employee_title, companyid } = req.body;
    const employeeToUpdate = {
      employee_name,
      employee_title,
      companyid,
    };

    const numberOfValues =
      Object.values(employeeToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'employee_name', 'employee_title', 'companyid' `,
        },
      });

    const knexInstance = req.app.get("db");
    EmployeeService.updateEmployee(
      knexInstance,
      req.params.employeeid,
      employeeToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = employeeRouter;
