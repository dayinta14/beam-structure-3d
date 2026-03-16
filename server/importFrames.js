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

async function importFrames(){

  const workbook = xlsx.readFile(filePath);

  const sheet = workbook.Sheets["Connectivity - Frame"];

  const rows = xlsx.utils.sheet_to_json(sheet,{header:1});

  console.log("Total rows Excel:", rows.length);

  let inserted = 0;

  for(let i=1;i<rows.length;i++){

    const row = rows[i];

    const frame = row[0];
    const p1 = row[1];
    const p2 = row[2];

    if(!frame || !p1 || !p2) continue;

    await pool.query(
      `INSERT INTO beams(id,point1,point2)
       VALUES($1,$2,$3)
       ON CONFLICT (id) DO NOTHING`,
      [frame,p1,p2]
    );

    inserted++;

  }

  console.log("Frames imported:",inserted);

  await pool.end();

}

importFrames();