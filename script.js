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
