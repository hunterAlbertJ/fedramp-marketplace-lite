module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");           
  eleventyConfig.addPassthroughCopy({ "data/products.json": "data/products.json" }); 

  return {
    pathPrefix: "/fedramp-marketplace-lite", 
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
