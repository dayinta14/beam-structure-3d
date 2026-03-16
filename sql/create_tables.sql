CREATE TABLE IF NOT EXISTS plant (
  id SERIAL PRIMARY KEY,
  name TEXT,
  pabrik_id TEXT
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  plant_id INT REFERENCES plant(id),
  name TEXT
);

CREATE TABLE IF NOT EXISTS subunit (
  id SERIAL PRIMARY KEY,
  equipment_id INT REFERENCES equipment(id),
  name TEXT
);

CREATE TABLE IF NOT EXISTS points (
  id INT PRIMARY KEY,
  x FLOAT,
  y FLOAT,
  z FLOAT
);

CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type TEXT,
  height FLOAT,
  width FLOAT,
  flange_thickness_top FLOAT,
  web_thickness FLOAT,
  flange_width_bottom FLOAT,
  flange_thickness_bottom FLOAT,
  fillet_radius FLOAT,
  standard TEXT
);

CREATE TABLE IF NOT EXISTS beams (
  id SERIAL PRIMARY KEY,
  name TEXT,
  point1 INT REFERENCES points(id),
  point2 INT REFERENCES points(id),
  section_id INT REFERENCES sections(id),
  subunit_id INT REFERENCES subunit(id),
  status TEXT,
  recommendation TEXT,
  note TEXT
);


SELECT * FROM Plant
SELECT * FROM Equipment
SELECT * FROM Subunit
SELECT * FROM Points
SELECT * FROM Sections
SELECT * FROM Beams