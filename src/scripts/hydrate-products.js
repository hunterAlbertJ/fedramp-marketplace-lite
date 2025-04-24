// src/scripts/hydrate-products.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputDir = path.resolve(__dirname, "../../data/products");
const outputFile = path.resolve(__dirname, "../../data/products.json");

const headers = [
  "product_id", "product_name", "certification_level", "agency", "sponsor",
  "authorization_date", "impact_level", "description", "link"
];

const allProducts = [];

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith(".csv")) {
    const filePath = path.join(inputDir, file);
    const contents = fs.readFileSync(filePath, "utf8").split("\n");
    const lines = contents.slice(1).filter(Boolean); // skip header

    lines.forEach(line => {
      const values = line.split(",");
      if (values.length === headers.length) {
        const obj = {};
        headers.forEach((key, i) => (obj[key] = values[i]));
        allProducts.push(obj);
      }
    });
  }
});

fs.writeFileSync(outputFile, JSON.stringify(allProducts, null, 2));
console.log(`✅ Wrote ${allProducts.length} products to products.json`);
