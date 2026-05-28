/* ═══════════════════════════════════════════
   ADMIN PANEL JS
   ═══════════════════════════════════════════ */

// Ensure data is loaded
initData();

const ADMIN_PASS = 'kreupas2026';

function checkAuth() {
  if (sessionStorage.getItem('kc_admin_auth') === 'true') {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderDashboard();
  } else {
    document.getElementById('adminLogin').style.display = 'grid';
    document.getElementById('adminDashboard').style.display = 'none';
  }
}

function attemptLogin() {
  const pass = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginError');
  
  if (pass === ADMIN_PASS) {
    sessionStorage.setItem('kc_admin_auth', 'true');
    errorMsg.classList.remove('show');
    checkAuth();
  } else {
    errorMsg.classList.add('show');
  }
}

function adminLogout() {
  sessionStorage.removeItem('kc_admin_auth');
  checkAuth();
}

// Check auth on load
window.addEventListener('load', checkAuth);

// Tabs
function switchTab(tabId, element) {
  // Update sidebar active class
  document.querySelectorAll('.admin-sidebar__nav a').forEach(a => a.classList.remove('active'));
  if (element) element.classList.add('active');
  
  // Hide all tabs
  document.getElementById('tab-dashboard').style.display = 'none';
  document.getElementById('tab-projects').style.display = 'none';
  document.getElementById('tab-testimonials').style.display = 'none';
  
  // Show active tab
  document.getElementById(`tab-${tabId}`).style.display = 'block';
  
  // Close mobile sidebar if open
  document.getElementById('adminSidebar').classList.remove('active');
  
  // Render data for specific tab
  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'projects') renderProjectsTab();
  if (tabId === 'testimonials') renderTestimonialsTab();
}

// ── Render Dashboard ──
function renderDashboard() {
  const projects = getProjects();
  const testimonials = getTestimonials();
  
  document.getElementById('statProjects').textContent = projects.length;
  document.getElementById('statTestimonials').textContent = testimonials.length;
  
  // Count unique categories
  const cats = new Set(projects.map(p => p.category));
  document.getElementById('statCategories').textContent = cats.size;
  
  // Recent projects
  const recent = [...projects].reverse().slice(0, 5);
  document.getElementById('recentProjectsTable').innerHTML = recent.map(p => `
    <tr>
      <td><img src="${p.image}" alt=""></td>
      <td style="font-weight:600;">${p.title}</td>
      <td>${formatCategory(p.category)}</td>
    </tr>
  `).join('');
}

// ── Render Projects ──
function renderProjectsTab() {
  const projects = getProjects();
  document.getElementById('projectsTable').innerHTML = projects.map(p => `
    <tr>
      <td><img src="${p.image}" alt=""></td>
      <td style="font-weight:600;">${p.title}</td>
      <td>${formatCategory(p.category)}</td>
      <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.description}</td>
      <td>
        <button class="action-btn" onclick="editProject('${p.id}')">Edit</button>
        <button class="action-btn action-btn--danger" onclick="deleteProject('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── Render Testimonials ──
function renderTestimonialsTab() {
  const testimonials = getTestimonials();
  document.getElementById('testimonialsTable').innerHTML = testimonials.map(t => `
    <tr>
      <td style="font-weight:600;">${t.name}</td>
      <td>${t.location}</td>
      <td style="max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.text}</td>
      <td style="color:var(--gold);">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</td>
      <td>
        <button class="action-btn" onclick="editTestimonial('${t.id}')">Edit</button>
        <button class="action-btn action-btn--danger" onclick="deleteTestimonial('${t.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── Modal Utils ──
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function openProjectModal(id = null) {
  const modal = document.getElementById('projectModal');
  const form = document.getElementById('projectForm');
  const title = document.getElementById('projectModalTitle');
  
  form.reset();
  document.getElementById('projImgPreview').className = 'img-preview';
  
  if (id) {
    const proj = getProjects().find(p => p.id === id);
    if (proj) {
      title.textContent = 'Edit Project';
      document.getElementById('projectId').value = proj.id;
      document.getElementById('projTitle').value = proj.title;
      document.getElementById('projCategory').value = proj.category;
      document.getElementById('projDesc').value = proj.description;
      document.getElementById('projImage').value = proj.image;
      document.getElementById('projLocation').value = proj.location;
      document.getElementById('projYear').value = proj.year;
      previewImage(proj.image, 'projImgPreview');
    }
  } else {
    title.textContent = 'Add New Project';
    document.getElementById('projectId').value = '';
  }
  
  modal.classList.add('active');
}

function openTestimonialModal(id = null) {
  const modal = document.getElementById('testimonialModal');
  const form = document.getElementById('testimonialForm');
  const title = document.getElementById('testimonialModalTitle');
  
  form.reset();
  
  if (id) {
    const test = getTestimonials().find(t => t.id === id);
    if (test) {
      title.textContent = 'Edit Testimonial';
      document.getElementById('testimonialId').value = test.id;
      document.getElementById('testName').value = test.name;
      document.getElementById('testLocation').value = test.location;
      document.getElementById('testText').value = test.text;
      document.getElementById('testRating').value = test.rating;
    }
  } else {
    title.textContent = 'Add New Testimonial';
    document.getElementById('testimonialId').value = '';
  }
  
  modal.classList.add('active');
}

// Image Preview
function previewImage(url, imgId) {
  const img = document.getElementById(imgId);
  if (url) {
    img.src = url;
    img.classList.add('show');
  } else {
    img.classList.remove('show');
  }
}

// ── CRUD Operations ──
function saveProject(e) {
  e.preventDefault();
  
  const id = document.getElementById('projectId').value || 'proj-' + Date.now();
  const newProj = {
    id,
    title: document.getElementById('projTitle').value,
    category: document.getElementById('projCategory').value,
    description: document.getElementById('projDesc').value,
    image: document.getElementById('projImage').value,
    location: document.getElementById('projLocation').value,
    year: document.getElementById('projYear').value
  };
  
  let projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index >= 0) projects[index] = newProj;
  else projects.push(newProj);
  
  saveProjects(projects);
  closeModal('projectModal');
  renderProjectsTab();
}

function deleteProject(id) {
  if(confirm('Are you sure you want to delete this project?')) {
    let projects = getProjects();
    projects = projects.filter(p => p.id !== id);
    saveProjects(projects);
    renderProjectsTab();
  }
}

function editProject(id) { openProjectModal(id); }

function saveTestimonial(e) {
  e.preventDefault();
  
  const id = document.getElementById('testimonialId').value || 'test-' + Date.now();
  const newTest = {
    id,
    name: document.getElementById('testName').value,
    location: document.getElementById('testLocation').value,
    text: document.getElementById('testText').value,
    rating: parseInt(document.getElementById('testRating').value)
  };
  
  let testimonials = getTestimonials();
  const index = testimonials.findIndex(t => t.id === id);
  
  if (index >= 0) testimonials[index] = newTest;
  else testimonials.push(newTest);
  
  saveTestimonials(testimonials);
  closeModal('testimonialModal');
  renderTestimonialsTab();
}

function deleteTestimonial(id) {
  if(confirm('Are you sure you want to delete this testimonial?')) {
    let testimonials = getTestimonials();
    testimonials = testimonials.filter(t => t.id !== id);
    saveTestimonials(testimonials);
    renderTestimonialsTab();
  }
}

function editTestimonial(id) { openTestimonialModal(id); }
