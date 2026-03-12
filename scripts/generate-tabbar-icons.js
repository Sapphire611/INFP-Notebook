/**
 * 生成 TabBar 图标
 * 运行此脚本需要安装 canvas 包: npm install canvas
 */

const fs = require('fs');
const path = require('path');

// 目标目录
const targetDir = path.join(__dirname, '../src/static/tabbar');

// 确保目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 简单的 SVG 转 PNG 方案
// 由于需要 canvas 依赖，这里提供一个简单的说明

console.log(`
========================================
TabBar 图标生成说明
========================================

方法 1: 使用在线工具
------------------------------
1. 访问 https://www.iconfont.cn/
2. 搜索"首页"和"我的"图标
3. 下载 PNG 格式，尺寸 81x81
4. 分别保存为:
   - home.png (灰色 #999999)
   - home-active.png (绿色 #66bb6a)
   - profile.png (灰色 #999999)
   - profile-active.png (绿色 #66bb6a)

方�� 2: 使用已有 SVG 转换
------------------------------
项目中已有 SVG 文件:
- src/static/tabbar/home.svg
- src/static/tabbar/home-active.svg
- src/static/tabbar/profile.svg
- src/static/tabbar/profile-active.svg

可以使用以下在线工具转换为 PNG:
https://cloudconvert.com/svg-to-png

方法 3: 使用 HTML Canvas 生成
------------------------------
运行 generate-tabbar-png.html 文件:
1. 在浏览器中打开 generate-tabbar-png.html
2. 右键点击生成的图标，选择"图片另存为"
3. 保存到 src/static/tabbar/ 目录

========================================
`);

// 创建一个简单的 HTML 文件提示
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>右键另存为图标</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f5f5f5; }
    .icon-container { display: flex; gap: 20px; flex-wrap: wrap; }
    .icon-item { text-align: center; background: white; padding: 20px; border-radius: 8px; }
    canvas { border: 1px solid #ddd; margin: 10px 0; }
    h3 { margin: 0 0 10px 0; color: #333; }
    p { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <h1>右键另存为 TabBar 图标</h1>
  <div class="icon-container">
    <div class="icon-item">
      <h3>home.png</h3>
      <canvas id="home" width="81" height="81"></canvas>
      <p>右键点击 → 图片另存为 → home.png</p>
    </div>
    <div class="icon-item">
      <h3>home-active.png</h3>
      <canvas id="home-active" width="81" height="81"></canvas>
      <p>右键点击 → 图片另存为 → home-active.png</p>
    </div>
    <div class="icon-item">
      <h3>profile.png</h3>
      <canvas id="profile" width="81" height="81"></canvas>
      <p>右键点击 → 图片另存为 → profile.png</p>
    </div>
    <div class="icon-item">
      <h3>profile-active.png</h3>
      <canvas id="profile-active" width="81" height="81"></canvas>
      <p>右键点击 → 图片另存为 → profile-active.png</p>
    </div>
  </div>

  <script>
    function drawHome(ctx, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(20, 45);
      ctx.lineTo(40.5, 25);
      ctx.lineTo(61, 45);
      ctx.lineTo(61, 60);
      ctx.lineTo(20, 60);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(35, 45, 11, 15);
      ctx.stroke();
    }

    function drawProfile(ctx, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.arc(40.5, 30, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(40.5, 65, 18, Math.PI, 0);
      ctx.stroke();
    }

    function drawIcon(id, color, drawFn) {
      const canvas = document.getElementById(id);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 81, 81);
      drawFn(ctx, color);
    }

    drawIcon('home', '#999999', drawHome);
    drawIcon('home-active', '#66bb6a', drawHome);
    drawIcon('profile', '#999999', drawProfile);
    drawIcon('profile-active', '#66bb6a', drawProfile);
  </script>
</body>
</html>`;

fs.writeFileSync(
  path.join(__dirname, '../save-tabbar-icons.html'),
  htmlContent,
  'utf8'
);

console.log('已生成 save-tabbar-icons.html 文件');
console.log('请在浏览器中打开该文件，然后右键保存图标');
