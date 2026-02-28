let mods = [];
const container = document.getElementById("modContainer");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const mainSection = document.getElementById("mainSection");
const suggestSection = document.getElementById("suggestSection");

// Load mods with cache bypass
fetch('mods.json?v=' + new Date().getTime())
    .then(res => res.json())
    .then(data => {
        mods = data;
        populateCategories();
        renderMods(mods);
    })
    .catch(error => {
        console.error("Error loading mods:", error);
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

        const isLiked = getLikedMods().includes(mod.name);

        card.innerHTML = `
            <h3>${mod.name}</h3>
            <p>By: ${mod.creator}</p>
            <button class="likeBtn">
                ${isLiked ? "💚 Liked" : "🤍 Like"}
            </button>
            <a href="${mod.link}" target="_blank">Download / Info</a>
        `;

        const likeBtn = card.querySelector(".likeBtn");

        likeBtn.addEventListener("click", () => {
            toggleLike(mod.name);
            renderMods(list);
        });

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
        const matchesSearch =
            mod.name.toLowerCase().includes(searchTerm) ||
            mod.creator.toLowerCase().includes(searchTerm);

        const matchesCategory =
            category === 'all' || mod.category === category;

        return matchesSearch && matchesCategory;
    });

    renderMods(filtered);
}

// LIKE SYSTEM
function getLikedMods() {
    return JSON.parse(localStorage.getItem("likedMods")) || [];
}

function toggleLike(modName) {
    let liked = getLikedMods();

    if (liked.includes(modName)) {
        liked = liked.filter(name => name !== modName);
    } else {
        liked.push(modName);
    }

    localStorage.setItem("likedMods", JSON.stringify(liked));
}

// TAB ANIMATION FUNCTION
function switchSection(showElem, hideElem) {
    hideElem.classList.add("fade-out");

    hideElem.addEventListener("animationend", () => {
        hideElem.style.display = "none";
        hideElem.classList.remove("fade-out");

        showElem.style.display = "block";
        showElem.classList.add("fade-in");

        showElem.addEventListener("animationend", () => {
            showElem.classList.remove("fade-in");
        }, { once: true });
    }, { once: true });
}

// TAB BUTTONS
document.getElementById("showLikes").addEventListener("click", () => {
    switchSection(mainSection, suggestSection);
    const liked = getLikedMods();
    const likedMods = mods.filter(mod => liked.includes(mod.name));
    renderMods(likedMods);
});

document.getElementById("showAll").addEventListener("click", () => {
    switchSection(mainSection, suggestSection);
    renderMods(mods);
});

document.getElementById("showSuggest").addEventListener("click", () => {
    switchSection(suggestSection, mainSection);
});