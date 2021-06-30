BEGIN;

TRUNCATE
  buildings,
  company,
  employee,
  office
  RESTART IDENTITY CASCADE;

INSERT INTO buildings (buildingid, building_name, country, building_address, rent_per_floor, number_of_floors)
VALUES
    (1, 'Building1', 'USA', '123 Boulder St.', 500, 3),
    (2, 'Building2', 'USA', '123 Scranton Ave', 450, 2),
    (3, 'Building3', 'USA', '100 Random St', 300, 4);

INSERT INTO company (companyid, company_name)
VALUES
    (1, 'NCAR' ),
    (2, 'Dunder Mifflin'),
    (3, 'Company3');

INSERT INTO employee (employeeid, employee_name, employee_title, companyid)
VALUES
    (1, 'Jane Doe', 'Sales Representative', 3),
    (2, 'John Doe', 'HR Manager', 2),
    (3, 'Bill Withers', 'Assistant Manager', 1),
    (4, 'Sue Doe', 'Sales Representative', 3),
    (5, 'Andrea Bender', 'Software Engineer', 2),
    (6, 'Nina Simone', 'Manager',  1);

INSERT INTO office (officeid, floor, buildingid, companyid)
VALUES
    (1, 1, 3, 1),
    (2, 2, 1, 2),
    (3, 1, 3, 3),
    (4, 3, 2, 3),
    (5, 2, 2, 2),
    (6, 3, 1, 1);

    COMMIT;