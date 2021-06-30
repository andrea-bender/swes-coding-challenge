const path = require("path");
const express = require("express");
const buildingsRouter = express.Router();
const jsonParser = express.json();

const BuildingsService = require("./buildings-service");

const serializeBuilding = (building) => ({
  buildingid: building.buildingid,
  building_name: building.building_name,
  country: building.country,
  building_address: building.building_address,
  rent_per_floor: Number(building.rent_per_floor),
  number_of_floors: Number(building.number_of_floors),
});

buildingsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    BuildingsService.getAllBuildings(knexInstance)
      .then((buildings) => {
        if (!buildings) {
          return res.status(400).json({
            error: { message: `Building doesn't exist` },
          });
        }
        res.json(buildings.map(serializeBuilding));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      building_name,
      country,
      building_address,
      rent_per_floor,
      number_of_floors,
    } = req.body;
    const newBuilding = {
      building_name,
      country,
      building_address,
      rent_per_floor,
      number_of_floors,
    };

    //each value in new building is required, verify that they were sent
    for (const [key, value] of Object.entries(newBuilding)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    const knexInstance = req.app.get("db");
    BuildingsService.insertBuilding(knexInstance, newBuilding)
      .then((buildings) => {
        res
          .status(201)
          .location(
            path.posix.join(req.originalUrl + `/${buildings.buildingid}`)
          )
          .json(serializeBuilding(buildings));
      })
      .catch(next);
  });

buildingsRouter
  .route("/:buildingid")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    BuildingsService.getById(knexInstance, req.params.buildingid)
      .then((buildings) => {
        if (!buildings) {
          return res.status(404).json({
            error: { message: `Building doesn't exist` },
          });
        }
        res.buildings = buildings;
        next();
        res.json(serializeBuilding(buildings));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeBuilding(res.buildings));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    BuildingsService.deleteBuilding(knexInstance, req.params.buildingid)
      .then((buildings) => {
        res.status(204).json(buildings);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      building_name,
      country,
      building_address,
      rent_per_floor,
      number_of_floors,
    } = req.body;
    const buildingToUpdate = {
      building_name,
      country,
      building_address,
      rent_per_floor,
      number_of_floors,
    };

    const numberOfValues =
      Object.values(buildingToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'building_name', 'country', 'building_address', 'rent_per_floor', 'number_of_floors' `,
        },
      });

    const knexInstance = req.app.get("db");
    BuildingsService.updateBuilding(
      knexInstance,
      req.params.buildingid,
      buildingToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = buildingsRouter;
