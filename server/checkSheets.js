const xlsx = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname,"..","data","Interactive Database Editing.xlsx");

const wb = xlsx.readFile(filePath);

console.log("Daftar Sheet:");
console.log(wb.SheetNames);