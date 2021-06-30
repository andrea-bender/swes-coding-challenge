const EmployeeService = {
  getAllEmployee(knex) {
    return knex.select("*").from("employee");
  },
  insertEmployee(knex, newEmployee) {
    return knex
      .insert(newEmployee)
      .into("employee")
      .returning("*")
      .then((rows) => {
        return rows[0]; //return object of inserted employee
      });
  },
  getById(knex, id) {
    return knex.from("employee").select("*").where("employeeid", id).first();
  },
  deleteEmployee(knex, id) {
    return knex("employee").where("employeeid", id).delete();
  },
  updateEmployee(knex, id, newEmployeeFields) {
    return knex("employee").where("employeeid", id).update(newEmployeeFields);
  },
};

module.exports = EmployeeService;
