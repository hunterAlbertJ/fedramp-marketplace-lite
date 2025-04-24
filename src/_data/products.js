const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

module.exports = () => {
  const dir = path.join(__dirname, "../../data/products");
  const files = fs.readdirSync(dir).filter(file => file.endsWith(".csv"));

  const headers = [
    "product_id", "product_name", "certification_level", "agency", "sponsor",
    "authorization_date", "impact_level", "description", "link"
  ];

  let all = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });

    all = all.concat(records.map(row => {
      const product = {};
      headers.forEach(key => product[key] = row[key]?.trim() || "");
      return product;
    }));
  }

  console.log(`✅ Loaded ${all.length} products from ${files.length} CSVs.`);
  return all;
};

