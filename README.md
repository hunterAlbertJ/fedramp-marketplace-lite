FedRAMP Marketplace Lite
FedRAMP Marketplace Lite is a simplified, accessible frontend for exploring FedRAMP-authorized cloud products. It is designed to improve public visibility into FedRAMP-authorized offerings by providing a fast, static, searchable, and filterable user interface.

This project is built using Eleventy (11ty), a static site generator, and is deployed via GitHub Pages. Product data is structured using CSV files and converted to JSON at build time for dynamic filtering and comparison on the frontend.

Features
Searchable product listings using Fuse.js

Filtering by impact level, authorization status, and sponsor agency

CSV export of filtered results

Ability to compare selected products

Dedicated agency pages with scoped search and filtering

Fully static architecture suitable for zero-infrastructure hosting

Getting Started
To get started with this project, ensure you have Node.js and npm installed on your system. Clone the repository and install the dependencies using npm install.

You can build the site using Eleventy by running npx @11ty/eleventy, and start a local development server with npx @11ty/eleventy --serve. The site will be viewable locally at http://localhost:8080.

Deployment
This site is automatically deployed to GitHub Pages using GitHub Actions. On each push to the main branch, the site is rebuilt and published from the \_site directory to the gh-pages branch. GitHub Pages is configured to serve content from this branch.

Directory Structure
data/: Includes product data, with vendor-specific CSVs and a generated products.json file

src/: Contains Eleventy input files, templates, and scripts

src/agencies/: Contains paginated agency-specific views

src/scripts/: Contains the product hydration script

\_site/: Build output directory (auto-generated)

.github/workflows/: Contains the deployment workflow configuration
