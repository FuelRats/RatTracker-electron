const {
  app,
  BrowserWindow
} = require('electron');

const {
  autoUpdater
} = require("electron-updater");
autoUpdater.checkForUpdatesAndNotify();

const path = require('path');
const url = require('url');
const qs = require('querystring');

const journalReader = require('./Lib/Journal/JournalReader');

const files = journalReader.FileReader.loadLogFiles();
journalReader.FileReader.monitorChanges(files);

global.JournalReader = journalReader;

let win;

let edOverlay;

let ratAuth = {
  req: null,
  res: null,
};

function createWindow() {
  win = new BrowserWindow({
    alwaysOnTop: false,
    height: 768,
    'node-integration': true,
    'web-security': false,
    width: 1440,
  });

  edOverlay = new BrowserWindow({
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    'node-integration': true,
    frame: false,
    width: 400,
    height: 300,
    fullscreenable: true,
    skipTaskbar: true,
    show: false
  });
  edOverlay.setFullScreen(true);

  const rtURL = process.env.ELECTRON_START_URL || url.format({
    nodeIntegration: true,
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const overlayURL = process.env.ELECTRON_START_URL ? 'http://localhost:3000/#/Overlay' : url.format({
    nodeIntegration: true,
    pathname: path.join(__dirname, '/../build/index.html'),
    hash: '/Overlay',
    protocol: 'file:',
    slashes: true,
  });

  win.loadURL(rtURL);

  edOverlay.loadURL(overlayURL);

  if (!!process.env.ELECTRON_START_URL) {
    win.openDevTools({});
    edOverlay.openDevTools({
      mode: 'detach'
    });
  }

  let reloadOnce = false;

  edOverlay.webContents.on('did-finish-load', function () {
    if (!reloadOnce) {
      edOverlay.setIgnoreMouseEvents(true, {
        forward: true
      });
      edOverlay.setIgnoreMouseEvents(false, {
        forward: true
      });
      edOverlay.reload();
      reloadOnce = true;

      edOverlay.show();
    }
  });

  win.webContents.on('will-navigate', function (event, newUrl) {
    if (newUrl.indexOf('https://fuelrats.com/authorize') >= 0) {
      ratAuth.req = qs.parse(newUrl.split('?')[1]);
    }

    if (newUrl.indexOf('http://rattracker/auth') >= 0) {
      event.preventDefault();
      win.webContents.stop();
      ratAuth.res = qs.parse(newUrl.split('#')[1]);

      if (ratAuth.req.state === ratAuth.res.state) {
        if ('undefined' !== typeof (ratAuth.res.error)) {
          win.loadURL(url.format({
            nodeIntegration: false,
            pathname: path.join(__dirname, 'login_denied.html'),
            protocol: 'file:',
            slashes: true,
          }));
        } else {
          win.loadURL(rtURL + '#' + ratAuth.res.access_token);
        }
      }
    }
  });

  win.on('closed', () => {
    edOverlay.close();
    win = null;
  });

  edOverlay.on('closed', () => {
    edOverlay = null;
  })
}

app.on('ready', createWindow);

app.on('before-quit', () => {
  win.close();
  edOverlay.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});