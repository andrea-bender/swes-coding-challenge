function makeEmployeesArray() {
  return [
    {
      employeeid: 1,
      employee_name: "Test employee 1",
      employee_title: "Manager",
      companyid: 1,
    },
    {
      employeeid: 1,
      employee_name: "Test employee 2",
      employee_title: "Software Developer",
      companyid: 2,
    },
  ];
}

module.exports = {
  makeEmployeesArray,
};
