const BuildingsService = {
  getAllBuildings(knex) {
    return knex.select("*").from("buildings");
  },
  insertBuilding(knex, newBuilding) {
    return knex
      .insert(newBuilding)
      .into("buildings")
      .returning("*")
      .then((rows) => {
        return rows[0]; //return object of inserted building
      });
  },
  getById(knex, id) {
    return knex.from("buildings").select("*").where("buildingid", id).first();
  },
  deleteBuilding(knex, id) {
    return knex("buildings").where("buildingid", id).delete();
  },
  updateBuilding(knex, id, newBuildingFields) {
    return knex("buildings").where("buildingsid", id).update(newBuildingFields);
  },
};

module.exports = BuildingsService;
