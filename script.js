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
}

function updateCenter() {
  if (!imgs) return;
  const rect = carousel.getBoundingClientRect();
  imgs.forEach(img => img.classList.remove('center'));
  let closest = null;
  let minDist = Infinity;
  imgs.forEach(img => {
    const imgRect = img.getBoundingClientRect();
    const dx = imgRect.left + imgRect.width/2 - (rect.left + rect.width/2);
    const dist = Math.abs(dx);
    if (dist < minDist) { minDist = dist; closest = img; }
  });
  if (closest) closest.classList.add('center');
}

function initCarousel() {
  if (!carousel) return;
  populateCarousel();
  imgs = Array.from(carousel.querySelectorAll('img'));
  // duplicate images for infinite effect
  imgs.forEach(i => carousel.appendChild(i.cloneNode()));
  imgs = Array.from(carousel.querySelectorAll('img'));
  carousel.addEventListener('animationiteration', updateCenter);
  carousel.addEventListener('mouseover', () => carousel.style.animationPlayState='paused');
  carousel.addEventListener('mouseout', () => carousel.style.animationPlayState='running');
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
