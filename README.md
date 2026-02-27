# JY 个人网站

这是一个纯静态个人网站，放在当前文件夹即可运行。

## 本地预览

方法 1：直接双击 `index.html`。

方法 2（推荐，避免路径问题）：在 VS Code 安装 Live Server 扩展后右键 `index.html`，选择 **Open with Live Server**。

## 修改你自己的信息

你可以在以下文件中替换内容：

- `index.html`：姓名、简介、项目、邮箱
- `style.css`：配色和样式
- `script.js`：复制邮箱逻辑

## 发布到公网（所有人可访问）

### 方案：GitHub Pages（免费）

1. 在 GitHub 新建仓库（例如 `jy-homesite`）。
2. 将本文件夹代码推送到仓库 `main` 分支。
3. 进入仓库 Settings -> Pages，Build and deployment 选择 **GitHub Actions**。
4. 等待仓库 Actions 中 `Deploy static site to GitHub Pages` 运行成功。
5. 访问你的网站地址：

   `https://jyan9758-boop.github.io/Fire-car/`

## 推送示例命令

在当前文件夹打开终端执行：

```bash
git init
git add .
git commit -m "init personal website"
git branch -M main
git remote add origin https://github.com/jyan9758-boop/Fire-car.git
git push -u origin main
```

完成后，网站将会自动部署并对外可访问。
