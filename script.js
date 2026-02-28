const modContainer = document.getElementById("modContainer");
const showAllBtn = document.getElementById("showAll");
const showLikesBtn = document.getElementById("showLikes");
const showRandomBtn = document.getElementById("showRandom");
const searchInput = document.getElementById("searchInput");
const themeCheckbox = document.getElementById("themeCheckbox");

let mods = [];
let likedMods = JSON.parse(localStorage.getItem("likedMods") || "{}");

fetch('mods.json')
    .then(res => res.json())
    .then(data => {
        mods = data.map(mod => ({ ...mod }));
        renderMods(mods);
    });

function renderMods(list) {
    modContainer.innerHTML = "";
    list.forEach(mod => {
        const card = document.createElement("div");
        card.className = "modCard";

        const isLiked = likedMods[mod.name] || false;
        const likeCount = isLiked ? 1 : 0;

        card.innerHTML = `
            <h3>${mod.name}</h3>
            <p>By ${mod.creator}</p>
            <p>Category: ${mod.category}</p>
            <p>❤️ <span class="likeCount">${likeCount}</span></p>
            <button class="likeBtn">${isLiked ? 'Unlike' : 'Like'}</button>
            <a href="${mod.link}" target="_blank">Open</a>
        `;

        const likeBtn = card.querySelector(".likeBtn");
        const likeCountEl = card.querySelector(".likeCount");

        likeBtn.onclick = () => {
            if(likedMods[mod.name]){
                likedMods[mod.name] = false;
                likeCountEl.textContent = 0;
                likeBtn.textContent = 'Like';
            } else {
                likedMods[mod.name] = true;
                likeCountEl.textContent = 1;
                likeBtn.textContent = 'Unlike';
            }
            localStorage.setItem("likedMods", JSON.stringify(likedMods));
        };

        modContainer.appendChild(card);
    });
}

showAllBtn.onclick = () => renderMods(mods);
showLikesBtn.onclick = () => renderMods(mods.filter(m => likedMods[m.name]));
showRandomBtn.onclick = () => {
    const randomMod = mods[Math.floor(Math.random() * mods.length)];
    renderMods([randomMod]);
};

searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    renderMods(mods.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.creator.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
    ));
};

if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    themeCheckbox.checked = true;
} else {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    themeCheckbox.checked = false;
}

themeCheckbox.onchange = () => {
    if(themeCheckbox.checked){
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
    }
};