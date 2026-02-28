import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const db = window.db;
const fns = window.firebaseFns;

const container = document.getElementById("modContainer");
const mainSection = document.getElementById("mainSection");
const adminSection = document.getElementById("adminSection");

// Password setup
const ADMIN_PASSWORD = "6899rqxf";
const passwordInput = document.getElementById("adminPassword");
const submitPasswordBtn = document.getElementById("submitPassword");
const passwordMessage = document.getElementById("passwordMessage");
const adminControls = document.getElementById("adminControls");

// Admin inputs
const addBtn = document.getElementById("addMod");
const adminName = document.getElementById("adminName");
const adminCreator = document.getElementById("adminCreator");
const adminLink = document.getElementById("adminLink");
const adminModList = document.getElementById("adminModList");

const modsCollection = collection(db, "mods");

// ---- Admin Password ----
submitPasswordBtn.onclick = () => {
    if(passwordInput.value === ADMIN_PASSWORD){
        passwordMessage.textContent = "";
        adminControls.style.display = "block";
        document.getElementById("passwordPrompt").style.display = "none";
        renderAdmin();
    } else {
        passwordMessage.textContent = "Incorrect password!";
    }
};

// ---- Render Functions ----
async function getAllMods() {
    const snapshot = await getDocs(modsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function renderAll(list = null) {
    const mods = list || await getAllMods();
    container.innerHTML = "";

    if (mods.length === 0) {
        container.innerHTML = "<p>No mods here yet.</p>";
        return;
    }

    mods.forEach(mod => {
        const card = document.createElement("div");
        card.className = "modCard";

        const count = mod.likes || 0;

        card.innerHTML = `
            <h3>${mod.name}</h3>
            <p>By ${mod.creator}</p>
            <p>❤️ ${count}</p>
            <button class="likeBtn">Like</button>
            <a href="${mod.link}" target="_blank">Open</a>
        `;

        card.querySelector(".likeBtn").onclick = async () => {
            const docRef = doc(db, "mods", mod.id);
            await updateDoc(docRef, { likes: increment(1) });
            renderAll(list);
        };

        container.appendChild(card);
    });
}

// ---- Admin Functions ----
async function renderAdmin() {
    const mods = await getAllMods();
    adminModList.innerHTML = "";
    mods.forEach(mod => {
        const div = document.createElement("div");
        div.innerHTML = `${mod.name} <button onclick="deleteModFirebase('${mod.id}')">Delete</button>`;
        adminModList.appendChild(div);
    });
}

window.deleteModFirebase = async function(id) {
    await deleteDoc(doc(db, "mods", id));
    renderAdmin();
    renderAll();
};

addBtn.onclick = async () => {
    const name = adminName.value;
    const creator = adminCreator.value;
    const link = adminLink.value;

    if (!name || !link) return;

    await addDoc(modsCollection, { name, creator, link, likes: 0 });
    adminName.value = adminCreator.value = adminLink.value = "";
    renderAdmin();
    renderAll();
};

// ---- Sidebar Buttons ----
document.getElementById("showAll").onclick = () => {
    mainSection.style.display = "block";
    adminSection.style.display = "none";
    renderAll();
};

document.getElementById("showLikes").onclick = async () => {
    const mods = await getAllMods();
    renderAll(mods.filter(m => m.likes > 0));
};

document.getElementById("showRandom").onclick = async () => {
    const mods = await getAllMods();
    const random = mods[Math.floor(Math.random() * mods.length)];
    renderAll([random]);
};

document.getElementById("showAdmin").onclick = () => {
    mainSection.style.display = "none";
    adminSection.style.display = "block";
    document.getElementById("passwordPrompt").style.display = "block";
    adminControls.style.display = "none";
};

// ---- Dark Mode ----
document.getElementById("darkToggle").onclick = () => {
    document.body.classList.toggle("light");
};

// Initial Render
renderAll();