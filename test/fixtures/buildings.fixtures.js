function makeBuildingsArray() {
  return [
    {
      buildingid: 1,
      building_name: "Test 1",
      country: "USA",
      building_address: "123 Test Ave",
      rent_per_floor: 500,
      number_of_floors: 3,
    },
    {
      buildingid: 2,
      building_name: "Test 2",
      country: "USA",
      building_address: "123 Test St",
      rent_per_floor: 700,
      number_of_floors: 4,
    },
  ];
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
    office,
    employee,
    company,
    buildings
    RESTART IDENTITY CASCADE`
  );
}

module.exports = {
  makeBuildingsArray,
  cleanTables,
};
