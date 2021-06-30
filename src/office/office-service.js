const OfficeService = {
  getAllOffice(knex) {
    return knex.select("*").from("office");
  },
  insertOffice(knex, newOffice) {
    return knex
      .insert(newOffice)
      .into("office")
      .returning("*")
      .then((rows) => {
        return rows[0]; //return object of inserted office
      });
  },
  getById(knex, id) {
    return knex.from("office").select("*").where("officeid", id).first();
  },
  deleteOffice(knex, id) {
    return knex("office").where("officeid", id).delete();
  },
  updateOffice(knex, id, newOfficeFields) {
    return knex("office").where("officeid", id).update(newOfficeFields);
  },
};

module.exports = OfficeService;
