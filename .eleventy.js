module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");

  // Also copy JSON and CSV product data
  eleventyConfig.addPassthroughCopy({ "data/products.json": "data/products.json" });
  eleventyConfig.addPassthroughCopy({ "data/products": "data/products" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
