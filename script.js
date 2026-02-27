const yearNode = document.getElementById("year");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const toast = document.getElementById("toast");
const email = "jyan9758@gmail.com";

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
