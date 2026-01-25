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

        if (currentCategory) {
            filteredFormulas = formulasData[currentCategory] || [];
        } else {
            Object.values(formulasData).forEach(catFormulas => {
                filteredFormulas = filteredFormulas.concat(catFormulas);
            });
        }

        if (categoryFilter) {
            filteredFormulas = formulasData[categoryFilter] || [];
        }

        if (searchTerm) {
            filteredFormulas = filteredFormulas.filter(formula =>
                formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                formula.explanation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filteredFormulas.forEach(formula => {
            const card = document.createElement('div');
            card.className = 'formula-card';
            card.innerHTML = `
                <h4>${formula.name}</h4>
                <div class="formula">${formula.formula}</div>
                <div class="explanation">${formula.explanation}</div>
                <div class="variables"><strong>Variables:</strong> ${formula.variables}</div>
                <div class="units"><strong>Units:</strong> ${formula.units}</div>
                <button onclick="copyToClipboard('${formula.formula}')">Copy Formula</button>
            `;
            cardsContainer.appendChild(card);
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

    // Copy to clipboard
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Formula copied to clipboard!');
        });
    };
});