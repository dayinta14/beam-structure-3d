const xlsx = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname,"..","data","Interactive Database Editing.xlsx");

const wb = xlsx.readFile(filePath);

const ws = wb.Sheets[wb.SheetNames[0]];

const rows = xlsx.utils.sheet_to_json(ws);

console.log(rows[0]);