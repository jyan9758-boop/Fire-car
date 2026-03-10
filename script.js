const yearNode = document.getElementById("year");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const toast = document.getElementById("toast");
const email = "jyan9758@gmail.com";

// cursor spotlight variables
const root = document.documentElement;
function updateCursor(e) {
  const x = e.clientX + "px";
  const y = e.clientY + "px";
  root.style.setProperty('--cursor-x', x);
  root.style.setProperty('--cursor-y', y);
}

function resetCursor() {
  root.style.setProperty('--cursor-x', '50%');
  root.style.setProperty('--cursor-y', '50%');
}

document.addEventListener('mousemove', updateCursor);
document.addEventListener('mouseleave', resetCursor);

// carousel control
const carousel = document.getElementById('carousel');
let imgs;

// filenames to display (update as needed)
const slideFiles = [
  '屏幕截图 2026-02-27 194220.png',
  '屏幕截图 2026-02-27 194413.png',
  '屏幕截图 2026-02-27 194424.png',
  '屏幕截图 2026-02-27 194546.png'
];

function populateCarousel() {
  if (!carousel) return;
  slideFiles.forEach(fn => {
    const img = document.createElement('img');
    img.src = 'images/' + fn;
    img.alt = fn;
    carousel.appendChild(img);
  });
  createNav();
}

function createNav() {
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  slideFiles.forEach((_, idx) => {
    const span = document.createElement('span');
    if (idx === 0) span.classList.add('active');
    span.addEventListener('click', () => gotoIndex(idx));
    nav.appendChild(span);
  });
  carousel.parentElement.appendChild(nav);
}

let currentIndex = 0;
function gotoIndex(idx) {
  if (!imgs || imgs.length === 0) return;
  currentIndex = idx;
  const imgWidth = imgs[0].getBoundingClientRect().width;
  const overlap = 80; // matches CSS margin
  const offset = -(idx * (imgWidth - overlap));
  // add flip class for short  animation cue
  carousel.classList.add('flipping');
  requestAnimationFrame(() => {
    carousel.style.transform = `translateX(${offset}px)`;
  });
  setTimeout(() => {
    carousel.classList.remove('flipping');
    updateCenter();
  }, 700);
}

function updateProgress(idx) {
  const nav = document.querySelector('.carousel-nav');
  if (!nav) return;
  nav.childNodes.forEach((el,i) => {
    el.classList.toggle('active', i === idx);
  });
}

function updateCenter() {
  if (!imgs) return;
  const rect = carousel.getBoundingClientRect();
  imgs.forEach((img,i) => {
    img.classList.remove('center');
    img.style.zIndex = imgs.length - i; // earlier images on top of later ones
  });
  let closest = null;
  let minDist = Infinity;
  imgs.forEach(img => {
    const imgRect = img.getBoundingClientRect();
    const dx = imgRect.left + imgRect.width/2 - (rect.left + rect.width/2);
    const dist = Math.abs(dx);
    if (dist < minDist) { minDist = dist; closest = img; }
  });
  if (closest) {
    closest.classList.add('center');
    closest.style.zIndex = 999; // bring forward
    const idx = imgs.indexOf(closest);
    // due to overlap, the logical index equals idx
    updateProgress(currentIndex);
  }
}

function initCarousel() {
  if (!carousel) return;
  populateCarousel();
  imgs = Array.from(carousel.querySelectorAll('img'));
  currentIndex = 0;
  updateCenter();
}

window.addEventListener('load', initCarousel);

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      if (toast) {
        toast.textContent = "邮箱已复制到剪贴板";
      }
    } catch {
      if (toast) {
        toast.textContent = "复制失败，请手动复制邮箱";
      }
    }
  });
}

/* --- 项目与学习日记功能（基于 localStorage） --- */
const STORAGE_KEY = 'jy_projects_v1';
let projects = [];
let currentProjectId = null;
let currentEditingEntryId = null;

function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2,9); }

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    projects = raw ? JSON.parse(raw) : [];
  } catch (e) {
    projects = [];
  }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function findProject(id) { return projects.find(p => p.id === id); }

// render project list
function renderProjectsList() {
  const list = document.getElementById('projectsList');
  if (!list) return;
  list.innerHTML = '';
  if (projects.length === 0) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = '还没有项目，点击 "新建项目" 开始记录你的学习。';
    list.appendChild(p);
    return;
  }
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('h3');
    title.textContent = p.title || '未命名项目';
    const desc = document.createElement('p');
    desc.textContent = p.description || '';
    const img = document.createElement('img');
    if (p.cover) { img.src = p.cover; img.style.maxWidth = '100%'; img.style.borderRadius = '6px'; img.style.marginTop = '.5rem'; }
    const btnWrap = document.createElement('div');
    btnWrap.style.marginTop = '.6rem';
    const openBtn = document.createElement('button');
    openBtn.className = 'btn'; openBtn.textContent = '打开';
    openBtn.addEventListener('click', () => openProject(p.id));
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-light'; editBtn.textContent = '编辑';
    editBtn.addEventListener('click', () => editProjectMeta(p.id));
    btnWrap.appendChild(openBtn); btnWrap.appendChild(editBtn);
    card.appendChild(title); card.appendChild(desc);
    if (p.cover) card.appendChild(img);
    card.appendChild(btnWrap);
    list.appendChild(card);
  });
}

function createProject() {
  const title = prompt('输入项目标题：', '新项目');
  if (!title) return;
  const desc = prompt('输入项目简介（可选）：', '');
  const p = { id: uid('proj_'), title, description: desc || '', cover: '', entries: [] };
  projects.unshift(p);
  saveProjects();
  renderProjectsList();
  openProject(p.id);
}

function editProjectMeta(id) {
  const p = findProject(id);
  if (!p) return;
  const newTitle = prompt('修改项目标题：', p.title) || p.title;
  const newDesc = prompt('修改项目简介：', p.description) || p.description;
  const cover = prompt('设置封面图片 URL（留空不修改）：', p.cover || '');
  p.title = newTitle; p.description = newDesc; if (cover) p.cover = cover;
  saveProjects(); renderProjectsList();
}

function openProject(id) {
  const project = findProject(id);
  if (!project) return;
  currentProjectId = id;
  // hide list, show view
  const list = document.getElementById('projectsList');
  const view = document.getElementById('projectView');
  if (list) list.hidden = true;
  if (view) view.hidden = false;
  // fill info
  document.getElementById('projTitle').textContent = project.title;
  document.getElementById('projDesc').textContent = project.description;
  const coverEl = document.getElementById('projCover');
  coverEl.src = project.cover || '';
  coverEl.style.display = project.cover ? 'block' : 'none';
  renderEntries();
}

function backToList() {
  currentProjectId = null; currentEditingEntryId = null;
  const list = document.getElementById('projectsList');
  const view = document.getElementById('projectView');
  if (list) list.hidden = false;
  if (view) view.hidden = true;
}

function renderEntries() {
  const proj = findProject(currentProjectId);
  const container = document.getElementById('entriesList');
  if (!proj || !container) return;
  container.innerHTML = '';
  if (!proj.entries || proj.entries.length === 0) {
    const p = document.createElement('p'); p.className = 'muted'; p.textContent = '还没有日记条目，点击右上角 + 生成今日条目。'; container.appendChild(p); return;
  }
  proj.entries.slice().reverse().forEach(entry => {
    const div = document.createElement('div'); div.className = 'entry-card';
    const d = document.createElement('div'); d.innerHTML = `<strong>${entry.date}</strong> <small class="muted">（点击编辑）</small>`;
    d.style.cursor = 'pointer'; d.addEventListener('click', () => editEntry(entry.id));
    const summary = document.createElement('div'); summary.textContent = entry.learned ? entry.learned.split('\n')[0] : ''; summary.className = 'muted'; summary.style.marginTop = '.4rem';
    const del = document.createElement('button'); del.className = 'btn btn-light'; del.textContent = '删除'; del.style.marginLeft = '.6rem';
    del.addEventListener('click', (e) => { e.stopPropagation(); if (confirm('确认删除此条目？')) { deleteEntry(entry.id); } });
    div.appendChild(d); div.appendChild(summary); div.appendChild(del);
    container.appendChild(div);
  });
}

function addDiaryForToday() {
  const proj = findProject(currentProjectId);
  if (!proj) return;
  const today = new Date().toISOString().slice(0,10);
  const entry = {
    id: uid('entry_'),
    date: today,
    learned: '今天学了：\n',
    problem: '遇到的问题：\n',
    tomorrow: '明天计划：\n'
  };
  proj.entries.push(entry);
  saveProjects(); renderEntries();
  // open editor for new entry
  editEntry(entry.id);
}

function editEntry(entryId) {
  const proj = findProject(currentProjectId); if (!proj) return;
  const entry = proj.entries.find(e => e.id === entryId);
  if (!entry) return;
  currentEditingEntryId = entryId;
  document.getElementById('entryEditor').hidden = false;
  document.getElementById('entryDate').textContent = entry.date;
  document.getElementById('entryLearn').value = entry.learned || '';
  document.getElementById('entryProblem').value = entry.problem || '';
  document.getElementById('entryTomorrow').value = entry.tomorrow || '';
}

function saveEntry() {
  const proj = findProject(currentProjectId); if (!proj || !currentEditingEntryId) return;
  const entry = proj.entries.find(e => e.id === currentEditingEntryId);
  if (!entry) return;
  entry.learned = document.getElementById('entryLearn').value;
  entry.problem = document.getElementById('entryProblem').value;
  entry.tomorrow = document.getElementById('entryTomorrow').value;
  saveProjects(); renderEntries(); document.getElementById('entryEditor').hidden = true; currentEditingEntryId = null;
}

function cancelEditEntry() { document.getElementById('entryEditor').hidden = true; currentEditingEntryId = null; }

function deleteEntry(entryId) {
  const proj = findProject(currentProjectId); if (!proj) return;
  proj.entries = proj.entries.filter(e => e.id !== entryId);
  saveProjects(); renderEntries();
}

// init UI bindings
window.addEventListener('load', () => {
  loadProjects(); renderProjectsList();
  const createBtn = document.getElementById('createProjectBtn'); if (createBtn) createBtn.addEventListener('click', createProject);
  const backBtn = document.getElementById('backToList'); if (backBtn) backBtn.addEventListener('click', backToList);
  const addDiaryBtn = document.getElementById('addDiaryBtn'); if (addDiaryBtn) addDiaryBtn.addEventListener('click', addDiaryForToday);
  const saveEntryBtn = document.getElementById('saveEntryBtn'); if (saveEntryBtn) saveEntryBtn.addEventListener('click', saveEntry);
  const cancelEntryBtn = document.getElementById('cancelEntryBtn'); if (cancelEntryBtn) cancelEntryBtn.addEventListener('click', cancelEditEntry);
});
