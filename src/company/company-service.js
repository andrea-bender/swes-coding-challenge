const CompanyService = {
  getAllCompany(knex) {
    return knex.select("*").from("company");
  },
  insertCompany(knex, newCompany) {
    return knex
      .insert(newCompany)
      .into("company")
      .returning("*")
      .then((rows) => {
        return rows[0]; //return object of inserted company
      });
  },
  getById(knex, id) {
    return knex.from("company").select("*").where("companyid", id).first();
  },
  deleteCompany(knex, id) {
    return knex("company").where("companyid", id).delete();
  },
  updateCompany(knex, id, newCompanyFields) {
    return knex("company").where("companyid", id).update(newCompanyFields);
  },
};

module.exports = CompanyService;
