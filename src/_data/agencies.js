const fs = require("fs");
const path = require("path");

module.exports = () => {
  const filePath = path.join(__dirname, "../../data/products.json");
  const products = JSON.parse(fs.readFileSync(filePath));
  return [...new Set(products.map(p => p.agency).filter(Boolean))];
};

