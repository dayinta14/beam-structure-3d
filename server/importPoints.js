const xlsx = require("xlsx");
const { Pool } = require("pg");
const path = require("path");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Beamstructureviewer",
  password: "dayinta14",
  port: 5432
});

const filePath = path.join(
  __dirname,
  "../data/Interactive Database Editing.xlsx"
);

async function importPoints(){

  const workbook = xlsx.readFile(filePath);

  const sheet = workbook.Sheets["Joint Coordinates"];

  const rows = xlsx.utils.sheet_to_json(sheet,{header:1});

  console.log("Total rows Excel:", rows.length);

  let inserted = 0;

  for(let i=1;i<rows.length;i++){

    const row = rows[i];

    const id = row[0];
    const x = row[3];
    const y = row[4];
    const z = row[6];

    if(!id) continue;

    await pool.query(
      `INSERT INTO points(id,x,y,z)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (id) DO NOTHING`,
      [id,x,y,z]
    );

    inserted++;

  }

  console.log("Points imported:",inserted);

  await pool.end();

}

importPoints();