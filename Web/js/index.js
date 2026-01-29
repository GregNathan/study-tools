// Index Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refresh-btn');
    const itemTitle = document.getElementById('item-title');
    const itemContent = document.getElementById('item-content');
    const itemSource = document.getElementById('item-source');

    let items = [];

    // Load items
    fetch('data/memes_reddit.json')
        .then(response => response.json())
        .then(data => {
            items = data;
            loadRandomItem();
        });

    function loadRandomItem() {
        if (items.length > 0) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            itemTitle.textContent = randomItem.title;
            itemContent.textContent = randomItem.content;
            itemSource.textContent = `Source: ${randomItem.source}`;
        }
    }

    refreshBtn.addEventListener('click', loadRandomItem);

    // Load initial item
    loadRandomItem();

    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero h1');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100); // Adjust speed here (100ms per character)
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeWriter, 500);
});