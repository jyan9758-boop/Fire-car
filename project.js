// project.js — render a single project's page using localStorage same schema as script.js
const STORAGE_KEY = 'jy_projects_v1';
let projects = [];
let currentProject = null;
let currentEditingEntryId = null;

function loadProjects() {
  try { projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { projects = []; }
}

function saveProjects() { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); }

function findProject(id) { return projects.find(p => p.id === id); }

function uid(prefix='') { return prefix + Math.random().toString(36).slice(2,9); }

function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderProject() {
  if (!currentProject) return;
  document.getElementById('projTitle').textContent = currentProject.title || '未命名项目';
  document.getElementById('projDesc').textContent = currentProject.description || '';
  const cover = document.getElementById('projCover');
  if (currentProject.cover) { cover.src = currentProject.cover; cover.hidden = false; } else { cover.hidden = true; }
  renderEntries();
}

function renderEntries() {
  const container = document.getElementById('entriesList');
  if (!container) return;
  container.innerHTML = '';
  if (!currentProject.entries || currentProject.entries.length === 0) {
    const p = document.createElement('p'); p.className = 'muted'; p.textContent = '还没有日记，点击上方 + 创建今日条目。'; container.appendChild(p); return;
  }
  currentProject.entries.slice().reverse().forEach(entry => {
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
  if (!currentProject) return;
  const today = new Date().toISOString().slice(0,10);
  const entry = { id: uid('entry_'), date: today, learned: '今天学了：\n', problem: '遇到的问题：\n', tomorrow: '明天计划：\n' };
  currentProject.entries.push(entry);
  saveProjects(); renderEntries(); editEntry(entry.id);
}

function editEntry(id) {
  if (!currentProject) return;
  const entry = currentProject.entries.find(e => e.id === id); if (!entry) return;
  currentEditingEntryId = id;
  document.getElementById('entryEditor').hidden = false;
  document.getElementById('entryDate').textContent = entry.date;
  document.getElementById('entryLearn').value = entry.learned || '';
  document.getElementById('entryProblem').value = entry.problem || '';
  document.getElementById('entryTomorrow').value = entry.tomorrow || '';
}

function saveEntry() {
  if (!currentProject || !currentEditingEntryId) return;
  const entry = currentProject.entries.find(e => e.id === currentEditingEntryId); if (!entry) return;
  entry.learned = document.getElementById('entryLearn').value;
  entry.problem = document.getElementById('entryProblem').value;
  entry.tomorrow = document.getElementById('entryTomorrow').value;
  saveProjects(); renderEntries(); document.getElementById('entryEditor').hidden = true; currentEditingEntryId = null;
}

function cancelEditEntry() { document.getElementById('entryEditor').hidden = true; currentEditingEntryId = null; }

function deleteEntry(id) {
  if (!currentProject) return;
  currentProject.entries = currentProject.entries.filter(e => e.id !== id);
  saveProjects(); renderEntries();
}

function editProjectMeta() {
  if (!currentProject) return;
  const newTitle = prompt('修改项目标题：', currentProject.title) || currentProject.title;
  const newDesc = prompt('修改项目简介：', currentProject.description) || currentProject.description;
  const cover = prompt('设置封面图片 URL（可留空）：', currentProject.cover || '');
  currentProject.title = newTitle; currentProject.description = newDesc; if (cover) currentProject.cover = cover;
  saveProjects(); renderProject();
}

// init
window.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  const id = getQueryId();
  if (!id) { alert('未提供项目 id'); return; }
  currentProject = findProject(id);
  if (!currentProject) { alert('未找到该项目'); return; }
  renderProject();

  document.getElementById('addDiaryBtn').addEventListener('click', addDiaryForToday);
  document.getElementById('saveEntryBtn').addEventListener('click', saveEntry);
  document.getElementById('cancelEntryBtn').addEventListener('click', cancelEditEntry);
  document.getElementById('editMetaBtn').addEventListener('click', editProjectMeta);
});
