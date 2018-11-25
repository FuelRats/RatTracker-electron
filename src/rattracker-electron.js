const {
  app,
  BrowserWindow
} = require('electron');

const path = require('path');
const url = require('url');
const qs = require('querystring');

let win;

let ratAuth = {
  req: null,
  res: null,
};

function createWindow() {
  win = new BrowserWindow({
    alwaysOnTop: false,
    height: 768,
    'node-integration': false,
    'web-security': false,
    width: 1440,
  });

  win.toggleDevTools();

  const rtURL = process.env.ELECTRON_START_URL || url.format({
    nodeIntegration: false,
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  win.loadURL(rtURL);

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
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('before-quit', () => {
  win.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
