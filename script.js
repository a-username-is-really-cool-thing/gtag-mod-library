const modContainer = document.getElementById("modContainer");
const showAllBtn = document.getElementById("showAll");
const showLikesBtn = document.getElementById("showLikes");
const showRandomBtn = document.getElementById("showRandom");

// Load mods from mods.json
let mods = [];
fetch('mods.json')
    .then(res => res.json())
    .then(data => {
        mods = data.map(mod => {
            mod.likes = parseInt(localStorage.getItem('like_' + mod.name)) || 0;
            return mod;
        });
        renderMods(mods);
    });

function renderMods(list) {
    modContainer.innerHTML = "";
    list.forEach(mod => {
        const card = document.createElement("div");
        card.className = "modCard";
        card.innerHTML = `
            <h3>${mod.name}</h3>
            <p>By ${mod.creator}</p>
            <p>Category: ${mod.category}</p>
            <p>❤️ ${mod.likes}</p>
            <button class="likeBtn">Like</button>
            <a href="${mod.link}" target="_blank">Open</a>
        `;
        card.querySelector(".likeBtn").onclick = () => {
            mod.likes++;
            localStorage.setItem('like_' + mod.name, mod.likes);
            renderMods(list);
        };
        modContainer.appendChild(card);
    });
}

// Sidebar buttons
showAllBtn.onclick = () => renderMods(mods);
showLikesBtn.onclick = () => renderMods(mods.filter(m => m.likes > 0));
showRandomBtn.onclick = () => {
    const randomMod = mods[Math.floor(Math.random() * mods.length)];
    renderMods([randomMod]);
};