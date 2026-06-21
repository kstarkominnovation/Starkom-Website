// script.js — FINAL STABLE VERSION (ALL FIXES)

import { db, collection, getDocs } from "./firebase.js";

// STATE
let allProjects = [];
let filteredProjects = [];
let activeFilter = "all";

// SPLASH
function hideSplash() {
  const splash = document.getElementById("intro-splash");
  setTimeout(() => {
    if (splash) splash.classList.add("hidden");
  }, 2000);
}

// NAVBAR
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
}

// IMAGE FIX
function getImagePath(path) {
  if (!path) return "";
  // Strip kstarkom/ prefix if present
  return path.trim().replace(/^(\/?kstarkom\/)/, "");
}

// FETCH PROJECTS
async function fetchProjects() {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const cleanData = {};
    for (const key in data) {
      cleanData[key.trim()] = data[key];
    }
    return {
      id: doc.id,
      ...cleanData
    };
  });
}

// FETCH TEAM
async function fetchTeam() {
  const snapshot = await getDocs(collection(db, "team"));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const cleanData = {};
    for (const key in data) {
      cleanData[key.trim()] = data[key];
    }
    return {
      id: doc.id,
      ...cleanData
    };
  });
}


// FILTER BUTTONS
function buildFilterButtons(projects) {
  const container = document.getElementById("project-filters");
  const domains = [...new Set(projects.map(p => p.domain))];

  container.innerHTML = `<button class="filter-btn active" data-filter="all">All</button>`;

  domains.forEach(d => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = d;
    btn.textContent = d;
    container.appendChild(btn);
  });

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.dataset.filter;

    filteredProjects =
      activeFilter === "all"
        ? allProjects
        : allProjects.filter(p => p.domain === activeFilter);

    renderProjects(filteredProjects);
  });
}

// PROJECT CARDS
function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");

  grid.innerHTML = projects.map(p => `
    <div class="project-card">

      ${p.image 
        ? `<img src="${getImagePath(p.image)}" class="project-card-thumb">`
        : `<div class="project-card-thumb-placeholder">NO IMAGE</div>`}

      <div class="project-card-body">
        <div class="project-domain">${p.domain || ""}</div>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-desc">${p.shortDescription || ""}</p>

        <div class="project-tags">
          ${(p.technologies || []).map(t => `<span class="project-tag">${t}</span>`).join("")}
        </div>

        <div class="project-card-footer">
          ${p.presentedAt 
            ? `<div class="presented-badge">${p.presentedAt}</div>` 
            : `<div></div>`
          }
          <button class="btn-details" data-id="${p.id}">View Details</button>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".btn-details").forEach(btn => {
    btn.onclick = () => openModal(btn.dataset.id);
  });
}

// MODAL
function openModal(id) {
  const p = allProjects.find(x => x.id === id);
  const modal = document.getElementById("modal-content");

  modal.innerHTML = `
    ${p.image ? `<img src="${getImagePath(p.image)}" class="modal-main-img">` : ""}

    <h2 class="modal-title">${p.title}</h2>

    <p class="modal-desc">${p.description || ""}</p>

    <div class="modal-space">
      <h4 class="modal-section-label">Domain</h4>
      <p class="modal-domain-text">${p.domain || ""}</p>
    </div>

    <div class="modal-space">
      <h4 class="modal-section-label">Technologies Used</h4>
      <div class="modal-tech-list">
        ${(p.technologies || []).map(t => `<span class="modal-tech-line">${t}</span>`).join("")}
      </div>
    </div>

    ${p.presentedAt ? `
    <div class="modal-space">
      <h4 class="modal-section-label">Presented At</h4>
      <div class="modal-presented-venue">🏆 ${p.presentedAt}</div>
    </div>` : ""}

    ${p.proofImage ? `
    <div class="modal-space">
      <h4 class="modal-section-label">Proof Image</h4>
      <img src="${getImagePath(p.proofImage)}" class="modal-proof-img">
    </div>` : ""}
  `;

  document.getElementById("modal-overlay").classList.add("open");
}

// TEAM
function renderTeam(members) {
  const grid = document.getElementById("team-grid");

  grid.innerHTML = members.map(m => `
    <div class="team-card">
      ${m.image 
        ? `<img src="${getImagePath(m.image)}" class="team-card-img">` 
        : `<div class="team-card-img-placeholder">👤</div>`
      }
      <div class="team-card-body">
        <h3 class="team-name">${m.name || "No Name"}</h3>
        <p class="team-role">${m.role || ""}</p>
        ${m.linkedin ? `<a href="${m.linkedin}" target="_blank" class="team-linkedin">View Profile</a>` : ""}
      </div>
    </div>
  `).join("");
}

// INIT
async function init() {
  hideSplash();
  initNavbar();

  const projects = await fetchProjects();
  allProjects = projects;
  filteredProjects = projects;

  buildFilterButtons(projects);
  renderProjects(projects);

  const team = await fetchTeam();
  renderTeam(team);

  // MODAL FIX (IMPORTANT)
  const closeBtn = document.getElementById("modal-close");
  const overlay = document.getElementById("modal-overlay");

  if (closeBtn) {
    closeBtn.onclick = () => overlay.classList.remove("open");
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") {
        overlay.classList.remove("open");
      }
    });
  }

  // CONTACT FORM HANDLER
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector('input[type="text"]').value;
      const email = form.querySelector('input[type="email"]').value;
      const message = form.querySelector('textarea').value;

      const subject = encodeURIComponent(`Query from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      
      const mailtoUrl = `mailto:kstarkominnovation@gmail.com?subject=${subject}&body=${body}`;
      
      // Open the mail client
      window.location.href = mailtoUrl;

      // Show success status
      const status = document.getElementById("form-status");
      if (status) {
        status.textContent = "Opening your email client to send the query...";
        status.className = "form-status success";
        // Reset form
        form.reset();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", init);