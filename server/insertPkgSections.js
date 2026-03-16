const pool = require("./db");

async function run() {
  try {
    const rows = [
      ["Kolom H 200 x 200", "I/WIDE_FLANGE", 200, 200, 12, 8, 200, 12, 0, "PKG"],
      ["Kolom H 200 x 300", "I/WIDE_FLANGE", 200, 300, 12, 8, 300, 12, 0, "PKG"],
      ["Kolom H 300 x 300", "I/WIDE_FLANGE", 300, 300, 25, 16, 300, 25, 0, "PKG"],
      ["Kolom H 350 x 175", "I/WIDE_FLANGE", 350, 175, 11, 7, 175, 11, 0, "PKG"],
    ];

    for (const row of rows) {
      await pool.query(
        `
        INSERT INTO sections
        (name, type, height, width, flange_thickness_top, web_thickness,
         flange_width_bottom, flange_thickness_bottom, fillet_radius, standard)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (name) DO NOTHING
        `,
        row
      );
    }

    console.log("Insert PKG sections selesai");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();