CREATE TABLE office (
    officeid SERIAL PRIMARY KEY,
    floor INTEGER NOT NULL,
    buildingid INTEGER
            REFERENCES buildings(buildingid) ON DELETE CASCADE NOT NULL,
    companyid INTEGER
            REFERENCES company(companyid) ON DELETE CASCADE NOT NULL
);