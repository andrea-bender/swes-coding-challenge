const path = require("path");
const express = require("express");
const companyRouter = express.Router();
const jsonParser = express.json();

const CompanyService = require("./company-service");

const serializeCompany = (company) => ({
  companyid: company.companyid,
  company_name: company.company_name,
});

companyRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    CompanyService.getAllCompany(knexInstance)
      .then((company) => {
        if (!company) {
          return res.status(400).json({
            error: { message: `Company doesn't exist` },
          });
        }
        res.json(company.map(serializeCompany));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { company_name } = req.body;
    const newCompany = { company_name };

    //each value in new company is required, verify that they were sent
    for (const [key, value] of Object.entries(newCompany)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    const knexInstance = req.app.get("db");
    CompanyService.insertCompany(knexInstance, newCompany)
      .then((company) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${company.companyid}`))
          .json(serializeCompany(company));
      })
      .catch(next);
  });

companyRouter
  .route("/:companyid")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    CompanyService.getById(knexInstance, req.params.companyid)
      .then((company) => {
        if (!company) {
          return res.status(404).json({
            error: { message: `Company doesn't exist` },
          });
        }
        res.company = company;
        next();
        res.json(serializeCompany(company));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeCompany(res.company));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    CompanyService.deleteCompany(knexInstance, req.params.companyid)
      .then((company) => {
        res.status(204).json(company);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { company_name } = req.body;
    const companyToUpdate = { company_name };

    const numberOfValues =
      Object.values(companyToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'company_name'`,
        },
      });

    const knexInstance = req.app.get("db");
    CompanyService.updateCompany(
      knexInstance,
      req.params.companyid,
      companyToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = companyRouter;
