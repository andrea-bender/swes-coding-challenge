const knex = require("knex");
const app = require("../src/app");
const {
  makeBuildingsArray,
  cleanTables,
} = require("./fixtures/buildings.fixtures");

describe("Buildings Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());
  before("cleanup", () => cleanTables(db));
  afterEach("cleanup", () => cleanTables(db));

  describe(`GET /api/buildings`, () => {
    context(`Given no buildings`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/buildings").expect(200, []);
      });
    });

    context("Given there are buildings in the database", () => {
      const testBuildings = makeBuildingsArray();

      beforeEach("insert buildings", () => {
        return db.into("buildings").insert(testBuildings);
      });

      it("GET /buildings responds with 200 and all of the buildings", () => {
        return supertest(app).get("/api/buildings").expect(200, testBuildings);
      });
    });
  });

  describe(`GET /api/buildings/:buildingid`, () => {
    context(`Given no buildings`, () => {
      it(`responds with 404`, () => {
        const buildingid = 123456;
        return supertest(app)
          .get(`/api/buildings/${buildingid}`)
          .expect(404, { error: { message: `Building doesn't exist` } });
      });
    });

    context("Given there are buildings in the database", () => {
      const testBuildings = makeBuildingsArray();

      beforeEach("insert buildings", () => {
        return db.into("buildings").insert(testBuildings);
      });

      it("responds with 200 and the specified building", () => {
        const buildingid = 2;
        const expectedBuilding = testBuildings[buildingid - 1];
        return supertest(app)
          .get(`/api/buildings/${buildingid}`)
          .expect(200, expectedBuilding);
      });
    });
  });

  describe(`POST /api/buildings`, () => {
    it(`creates a building, responding with 201 and the new building`, () => {
      const newBuilding = {
        building_name: "Test new building",
      };
      return supertest(app)
        .post("/api/buildings")
        .send(newBuilding)
        .expect(201)
        .expect((res) => {
          expect(res.body.building_name).to.eql(newBuilding.building_name);
          expect(res.body).to.have.property("buildingid");
          expect(res.headers.location).to.eql(
            `/api/buildings/${res.body.buildingid}`
          );
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/buildings/${postRes.body.buildingid}`)
            .expect(postRes.body)
        );
    });

    const requiredFields = ["building_name"];

    requiredFields.forEach((field) => {
      const newBuilding = {
        building_name: "Test new building name",
      };

      it(`responds with 400 and an error message when the 'building_name' is missing`, () => {
        delete newBuilding[field];

        return supertest(app)
          .post("/api/buildings")
          .send(newBuilding)
          .expect(400, {
            error: { message: `Missing 'building_name' in request body` },
          });
      });
    });
  });

  describe(`DELETE /api/buildings/:buildingid`, () => {
    context(`Given no buildings`, () => {
      it(`responds with 404`, () => {
        const buildingid = 123456;
        return supertest(app)
          .delete(`/api/buildings/${buildingid}`)
          .expect(404, { error: { message: `Building doesn't exist` } });
      });
    });

    context("Given there are buildings in the database", () => {
      const testBuildings = makeBuildingsArray();

      beforeEach("insert buildings", () => {
        return db.into("buildings").insert(testBuildings);
      });

      it("responds with 204 and removes the building", () => {
        const idToRemove = 2;
        const expectedBuildings = testBuildings.filter(
          (buildings) => buildings.buildingid !== idToRemove
        );
        return supertest(app)
          .delete(`/api/buildings/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/buildings`).expect(expectedBuildings)
          );
      });
    });
  });

  describe(`PATCH /api/buildings/:buildingid`, () => {
    context(`Given no buildings`, () => {
      it(`responds with 404`, () => {
        const buildingid = 123456;
        return supertest(app)
          .delete(`/api/buildings/${buildingid}`)
          .expect(404, { error: { message: `Building doesn't exist` } });
      });
    });

    context("Given there are buildings in the database", () => {
      const testBuildings = makeBuildingsArray();

      beforeEach("insert buildings", () => {
        return db.into("buildings").insert(testBuildings);
      });

      it("responds with 204 and updates the building", () => {
        const idToUpdate = 2;
        const updateBuilding = {
          building_name: "updated building_name",
        };
        const expectedBuilding = {
          ...testBuildings[idToUpdate - 1],
          ...updateBuilding,
        };
        return supertest(app)
          .patch(`/api/buildings/${idToUpdate}`)
          .send(updateBuilding)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/buildings/${idToUpdate}`)
              .expect(expectedBuilding)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 1;
        return supertest(app)
          .patch(`/api/buildings/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Missing key 'building_name' in request body`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateBuilding = {
          building_name: "updated building name",
        };
        const expectedBuilding = {
          ...testBuildings[idToUpdate - 1],
          ...updateBuilding,
        };

        return supertest(app)
          .patch(`/api/buildings/${idToUpdate}`)
          .send({
            ...updateBuilding,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/buildings/${idToUpdate}`)
              .expect(expectedBuilding)
          );
      });
    });
  });
});
