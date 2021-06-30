CREATE TABLE employee (
    employeeid SERIAL PRIMARY KEY,
    employee_name TEXT NOT NULL,
    employee_title TEXT NOT NULL,
    companyid INTEGER
            REFERENCES company(companyid) ON DELETE CASCADE NOT NULL
);