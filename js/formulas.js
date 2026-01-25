// Formulas JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let formulasData = {};
    let currentCategory = '';

    // Load formulas
    fetch('data/formulas.json')
        .then(response => response.json())
        .then(data => {
            formulasData = data;
            populateCategories();
            populateFilter();
            displayFormulas();
        });

    function populateCategories() {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '<li><a href="#" data-category="">All</a></li>';
        Object.keys(formulasData).forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-category="${category}">${category}</a>`;
            categoryList.appendChild(li);
        });

        categoryList.addEventListener('click', function(e) {
            e.preventDefault();
            if (e.target.tagName === 'A') {
                // Remove active class from all
                document.querySelectorAll('#category-list a').forEach(a => a.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');
                currentCategory = e.target.getAttribute('data-category');
                displayFormulas();
            }
        });
    }

    function populateFilter() {
        const filter = document.getElementById('filter');
        filter.innerHTML = '<option value="">All Categories</option>';
        Object.keys(formulasData).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filter.appendChild(option);
        });
    }

    function displayFormulas(searchTerm = '', categoryFilter = '') {
        const cardsContainer = document.getElementById('formula-cards');
        cardsContainer.innerHTML = '';

        let filteredFormulas = [];

        // Start with all formulas if no category selected, or filter by current category
        if (currentCategory) {
            filteredFormulas = formulasData[currentCategory] || [];
        } else {
            Object.values(formulasData).forEach(catFormulas => {
                filteredFormulas = filteredFormulas.concat(catFormulas);
            });
        }

        // Apply dropdown filter if selected (this can further filter the already category-filtered results)
        if (categoryFilter) {
            if (currentCategory && currentCategory !== categoryFilter) {
                // If sidebar category is different from dropdown, show dropdown category
                filteredFormulas = formulasData[categoryFilter] || [];
            } else if (!currentCategory) {
                // If no sidebar selection, filter by dropdown
                filteredFormulas = formulasData[categoryFilter] || [];
            }
            // If they match, keep the current filtered results
        }

        // Apply search term filtering
        if (searchTerm) {
            filteredFormulas = filteredFormulas.filter(formula =>
                formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                formula.explanation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filteredFormulas.forEach((formula, index) => {
            const card = document.createElement('div');
            card.className = 'formula-card';
            card.innerHTML = `
                <h4>${formula.name}</h4>
                <div class="formula">${formula.formula}</div>
                <div class="explanation">${formula.explanation}</div>
                <div class="variables"><strong>Variables:</strong> ${formula.variables}</div>
                <div class="units"><strong>Units:</strong> ${formula.units}</div>
                <button class="copy-btn" data-formula="${formula.formula.replace(/"/g, '&quot;')}">Copy Formula</button>
            `;
            cardsContainer.appendChild(card);
        });

        // Add event listeners for copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const formula = this.getAttribute('data-formula');
                navigator.clipboard.writeText(formula).then(() => {
                    alert('Formula copied to clipboard!');
                });
            });
        });
    }

    // Search
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value;
        const categoryFilter = document.getElementById('filter').value;
        displayFormulas(searchTerm, categoryFilter);
    });

    // Filter
    const filterSelect = document.getElementById('filter');
    filterSelect.addEventListener('change', function() {
        const categoryFilter = this.value;
        const searchTerm = searchInput.value;
        displayFormulas(searchTerm, categoryFilter);
    });
});