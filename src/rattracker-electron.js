const {
  app,
  BrowserWindow
} = require('electron');

const path = require('path');
const url = require('url');
const qs = require('querystring');

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
    fullscreenable: false,
    skipTaskbar: true
  });

  //if (!!process.env.ELECTRON_START_URL) {
  win.toggleDevTools();
  //}

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

  win.webContents.on('will-navigate', function (event, newUrl) {
    console.log(newUrl);
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

    if (newUrl === 'http://localhost:3000/rescues') {

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