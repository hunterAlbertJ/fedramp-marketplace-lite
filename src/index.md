---
layout: base.njk
title: FedRAMP Marketplace
---

<H2>Search, compare, and explore FedRAMP-authorized services.</H2>

<input type="text" id="searchInput" placeholder="Search products..." />
<div id="results"></div>

<div class="marketplace-grid">
  <aside id="filtersPanel">
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <button type="button" id="compareBtn">Compare</button>
      <button type="button" id="resetCompare">Clear Compare</button>
    </div>
    <h3>Filters</h3>

    <form id="filters">
      <section class="filter-group">
        <button type="button" class="filter-toggle" aria-expanded="false">Status</button>
        <div class="filter-options" hidden>
          <div class="filter-box"><label><span class="filter-label">Authorized</span><input type="checkbox" value="FedRAMP Authorized" class="statusFilter"></label></div>
          <div class="filter-box"><label><span class="filter-label">In Process</span><input type="checkbox" value="FedRAMP In Process" class="statusFilter"></label></div>
          <div class="filter-box"><label><span class="filter-label">Ready</span><input type="checkbox" value="FedRAMP Ready" class="statusFilter"></label></div>
        </div>
      </section>

      <section class="filter-group">
        <button type="button" class="filter-toggle" aria-expanded="false">Impact Level</button>
        <div class="filter-options" hidden>
          <div class="filter-box"><label><span class="filter-label">Low</span><input type="checkbox" value="Low" class="impactFilter"></label></div>
          <div class="filter-box"><label><span class="filter-label">Moderate</span><input type="checkbox" value="Moderate" class="impactFilter"></label></div>
          <div class="filter-box"><label><span class="filter-label">High</span><input type="checkbox" value="High" class="impactFilter"></label></div>
        </div>
      </section>

      <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button type="button" id="clearFilters">X Clear Filters</button>
        <button type="button" id="exportCsv">Export CSV</button>
      </div>
    </form>

  </aside>

  <main>
    <h2>All Products</h2>
    <div id="productList"></div>
  </main>
</div>

<script type="module">
  import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.min.js';

  document.querySelectorAll('.filter-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const options = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      options.hidden = expanded;
    });
  });

  const results = document.getElementById('results');
  const list = document.getElementById('productList');
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearFilters');
  const compareBtn = document.getElementById('compareBtn');
  const resetCompareBtn = document.getElementById('resetCompare');
  const exportBtn = document.getElementById('exportCsv');
  let allProducts = [];
  let selectedToCompare = new Set();
  let currentRendered = [];
  const basePath = window.location.pathname.replace(/\/$/, '');

  fetch('data/products.json')
    .then(res => res.json())
    .then(products => {
      allProducts = products.filter(p => p.product_name);
      const fuse = new Fuse(allProducts, {
        keys: ['product_name', 'agency', 'certification_level', 'sponsor'],
        threshold: 0.3
      });

      const getFilters = () => {
        const statuses = Array.from(document.querySelectorAll('.statusFilter:checked')).map(cb => cb.value);
        const impacts = Array.from(document.querySelectorAll('.impactFilter:checked')).map(cb => cb.value);
        return { statuses, impacts };
      };

      const filterProducts = () => {
        const searchTerm = input.value.trim();
        const { statuses, impacts } = getFilters();

        let filtered = allProducts;
        if (searchTerm) {
          filtered = fuse.search(searchTerm).map(r => r.item);
        }

        if (statuses.length > 0) {
          filtered = filtered.filter(p => statuses.includes(p.certification_level));
        }

        if (impacts.length > 0) {
          filtered = filtered.filter(p => impacts.includes(p.impact_level));
        }

        renderTable(filtered);
      };

      const renderTable = (items) => {
        currentRendered = items;
        list.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Compare</th>
                <th>Product</th>
                <th>Agency</th>
                <th>Sponsor</th>
                <th>Certification</th>
                <th>Date</th>
                <th>Impact</th>
                <th>Description</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(p => `
                <tr>
                  <td><input type="checkbox" class="compareCheckbox" data-product-id="${p.product_id}" ${selectedToCompare.has(p.product_id) ? 'checked' : ''}></td>
                  <td><a href="${basePath}/${p.agency.toLowerCase().replace(/[^a-z0-9]/g, "-")}/${p.product_id}/">${p.product_name}</a></td>
                  <td><a href="${basePath}/${p.agency.toLowerCase().replace(/[^a-z0-9]/g, "-")}/">${p.agency}</a></td>
                  <td>${p.sponsor}</td>
                  <td>${p.certification_level}</td>
                  <td>${p.authorization_date}</td>
                  <td>${p.impact_level}</td>
                  <td>${p.description}</td>
                  <td><a href="${p.link}" target="_blank">View</a></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;

        document.querySelectorAll('.compareCheckbox').forEach(cb => {
          cb.addEventListener('change', e => {
            const id = e.target.dataset.productId;
            if (e.target.checked) {
              selectedToCompare.add(id);
            } else {
              selectedToCompare.delete(id);
            }
          });
        });
      };

      document.querySelectorAll('#filters input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', filterProducts);
      });

      input.addEventListener('input', filterProducts);

      clearBtn.addEventListener('click', () => {
        input.value = '';
        document.querySelectorAll('#filters input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });
        renderTable(allProducts);
      });

      compareBtn.addEventListener('click', () => {
        const compared = allProducts.filter(p => selectedToCompare.has(p.product_id));
        renderTable(compared);
      });

      resetCompareBtn.addEventListener('click', () => {
        selectedToCompare.clear();
        renderTable(allProducts);
      });

      exportBtn.addEventListener('click', () => {
        const csvRows = [
          ['Product', 'Agency', 'Sponsor', 'Certification', 'Date', 'Impact', 'Description', 'Link']
        ];

        currentRendered.forEach(p => {
          csvRows.push([
            p.product_name,
            p.agency,
            p.sponsor,
            p.certification_level,
            p.authorization_date,
            p.impact_level,
            p.description,
            p.link
          ].map(v => `"${(v || '').replace(/"/g, '""')}"`));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(r => r.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fedramp_products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      renderTable(allProducts);
    });
</script>
