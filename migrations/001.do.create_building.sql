CREATE TABLE buildings (
    buildingid SERIAL PRIMARY KEY,
    building_name TEXT NOT NULL,
    country TEXT NOT NULL,
    building_address VARCHAR (200) NOT NULL,
    rent_per_floor INTEGER NOT NULL,
    number_of_floors INTEGER NOT NULL
);