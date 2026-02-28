let mods = [];
const container = document.getElementById("modContainer");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

// Load mods from JSON
fetch('mods.json')
    .then(res => res.json())
    .then(data => {
        mods = data;
        populateCategories();
        renderMods(mods);
    });

function populateCategories() {
    const categories = [...new Set(mods.map(m => m.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

function renderMods(list) {
    container.innerHTML = '';
    list.forEach(mod => {
        const card = document.createElement('div');
        card.className = 'modCard';
        card.innerHTML = `
            <h3>${mod.name}</h3>
            <p>By: ${mod.creator}</p>
            <a href="${mod.link}" target="_blank">Download / Info</a>
        `;
        container.appendChild(card);
    });
}

// Search & Filter
searchInput.addEventListener('input', updateDisplay);
categoryFilter.addEventListener('change', updateDisplay);

function updateDisplay() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const filtered = mods.filter(mod => {
        return (mod.name.toLowerCase().includes(searchTerm) || mod.creator.toLowerCase().includes(searchTerm)) &&
               (category === 'all' || mod.category === category);
    });
    renderMods(filtered);
}