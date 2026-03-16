const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const pool = require("./db");

async function run() {
  try {
    const xmlPath = path.join(__dirname, "..", "data", "JIS-G-3192-2014.xml");
    const xmlData = fs.readFileSync(xmlPath, "utf-8");

    const parser = new xml2js.Parser({
      explicitArray: true,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });

    const result = await parser.parseStringPromise(xmlData);
    const sections = result.PROPERTY_FILE.STEEL_I_SECTION || [];

    for (const s of sections) {
      const name = s.LABEL?.[0] || null;
      const height = parseFloat(s.D?.[0] || 0);
      const width = parseFloat(s.BF?.[0] || 0);
      const tf = parseFloat(s.TF?.[0] || 0);
      const tw = parseFloat(s.TW?.[0] || 0);

      await pool.query(
        `
        INSERT INTO sections
        (name, type, height, width, flange_thickness_top, web_thickness,
         flange_width_bottom, flange_thickness_bottom, fillet_radius, standard)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (name) DO NOTHING
        `,
        [name, "I/WIDE_FLANGE", height, width, tf, tw, width, tf, 0, "JIS"]
      );
    }

    console.log("Import XML sections selesai");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();