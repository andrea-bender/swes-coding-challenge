const path = require("path");
const express = require("express");
const officeRouter = express.Router();
const jsonParser = express.json();

const OfficeService = require("./office-service");

const serializeOffice = (office) => ({
  officeid: office.officeid,
  floor: office.floor,
  buildingid: Number(office.buildingid),
  companyid: Number(office.companyid),
});

officeRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    OfficeService.getAllOffice(knexInstance)
      .then((office) => {
        if (!office) {
          return res.status(400).json({
            error: { message: `Office doesn't exist` },
          });
        }
        res.json(office.map(serializeOffice));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { floor, building_id, company_id } = req.body;
    const newOffice = {
      floor,
      building_id,
      company_id,
    };

    //each value in new office is required, verify that they were sent
    for (const [key, value] of Object.entries(newOffice)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    const knexInstance = req.app.get("db");
    OfficeService.insertOffice(knexInstance, newOffice)
      .then((office) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${office.officeid}`))
          .json(serializeOffice(office));
      })
      .catch(next);
  });

officeRouter
  .route("/:officeid")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    OfficeService.getById(knexInstance, req.params.officeid)
      .then((office) => {
        if (!office) {
          return res.status(404).json({
            error: { message: `Office doesn't exist` },
          });
        }
        res.office = office;
        next();
        res.json(serializeOffice(office));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeOffice(res.office));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    OfficeService.deleteOffice(knexInstance, req.params.officeid)
      .then((office) => {
        res.status(204).json(office);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { floor, building_id, company_id } = req.body;
    const officeToUpdate = {
      floor,
      building_id,
      company_id,
    };

    const numberOfValues = Object.values(officeToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'floor', 'building_id', 'company_id' `,
        },
      });

    const knexInstance = req.app.get("db");
    OfficeService.updateOffice(
      knexInstance,
      req.params.officeid,
      officeToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = officeRouter;
