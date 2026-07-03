

const { app, BrowserWindow } = require('electron');
const path = require('path');

// 🔥🔥🔥 核心修改：加入这行代码，允许自动播放声音 🔥🔥🔥
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const isDev = process.env.npm_lifecycle_event === "start";
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "超级精灵",
    icon: path.join(__dirname, "assets/icon.png"),
    fullscreen: !isDev,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true // 隐藏菜单栏，更像游戏
  });

  // 开发环境加载 localhost，生产环境加载打包文件
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;
  
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(startUrl);
    win.setFullScreen(true);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
