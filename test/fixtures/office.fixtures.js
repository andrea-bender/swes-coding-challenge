// officeid, floor, buildingid, companyid
function makeOfficesArray() {
  return [
    {
      officeid: 1,
      floor: "Test office 1",
      buildingid: 1,
      companyid: 1,
    },
    {
      officeid: 2,
      floor: "Test office 2",
      buildingid: 2,
      companyid: 2,
    },
  ];
}

module.exports = {
  makeOfficesArray,
};
