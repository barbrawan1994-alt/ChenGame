

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { createSaveStore } = require('./save-store');

app.setName('超级精灵');
const userDataOverride = process.env.CHENGAME_USER_DATA_DIR || process.env.SUPER_SPIRIT_USER_DATA_DIR;
if (userDataOverride) {
  app.setPath('userData', path.resolve(userDataOverride));
}

const saveStore = createSaveStore(app.getPath('userData'));

const registerSaveChannel = (channel, handler) => {
  ipcMain.on(channel, (event, ...args) => {
    try {
      event.returnValue = handler(...args);
    } catch (error) {
      event.returnValue = {
        ok: false,
        error: error instanceof Error ? error.message : 'Desktop save operation failed',
      };
    }
  });
};

registerSaveChannel('save:read', () => saveStore.read());
registerSaveChannel('save:write', raw => saveStore.write(raw));
registerSaveChannel('save:backup', kind => saveStore.backup(kind));
registerSaveChannel('save:remove', () => saveStore.remove());
registerSaveChannel('save:info', () => saveStore.info());

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
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
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
