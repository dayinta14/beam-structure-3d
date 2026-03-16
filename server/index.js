const path = require("path");
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/structure", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.name,
        b.point1,
        b.point2,
        b.status,
        b.recommendation,
        b.note,
        b.subunit_id,

        p1.x AS x1,
        p1.y AS y1,
        p1.z AS z1,

        p2.x AS x2,
        p2.y AS y2,
        p2.z AS z2,

        s.id AS section_id,
        s.name AS section_name,
        s.type AS section_type,
        s.height,
        s.width,
        s.flange_thickness_top,
        s.web_thickness,
        s.flange_width_bottom,
        s.flange_thickness_bottom,
        s.fillet_radius,
        s.standard

      FROM beams b
      JOIN points p1 ON b.point1 = p1.id
      JOIN points p2 ON b.point2 = p2.id
      LEFT JOIN sections s ON b.section_id = s.id
      ORDER BY b.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET /structure error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(3001, () => {
  console.log("App running on http://localhost:3001");
});