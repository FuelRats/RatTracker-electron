const {
  app,
  BrowserWindow
} = require("electron");

const log = require("electron-log");

const startupDate = new Date()
  .toISOString()
  .replace(/\:/g, "-")
  .replace(/\./g, "-");

log.transports.file.level = "debug";
let logPath = log.transports.file
  .findLogPath()
  .replace("log.log", `log-${startupDate}.log`);
console.log(logPath);
log.transports.file.file = logPath;
log.transports.console.level = "debug";

log.info("Application started");

process.on("uncaughtException", e => {
  log.error(e);
  app.exit(1);
});

const {
  autoUpdater
} = require("electron-updater");
autoUpdater.checkForUpdatesAndNotify();

const path = require("path");
const url = require("url");
const qs = require("querystring");

const journalReader = require("./Lib/Journal/JournalReader");

const files = journalReader.FileReader.loadLogFiles();
journalReader.FileReader.monitorChanges(files);

global.JournalReader = journalReader;
global.Logger = log;

let win;

let edOverlay;

let ratAuth = {
  req: null,
  res: null
};

function createWindow() {
  win = new BrowserWindow({
    alwaysOnTop: false,
    height: 768,
    "node-integration": true,
    "web-security": false,
    width: 1440
  });

  edOverlay = new BrowserWindow({
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    "node-integration": true,
    frame: false,
    width: 400,
    height: 200,
    fullscreenable: false,
    skipTaskbar: true,
    show: false
  });

  const rtURL =
    process.env.ELECTRON_START_URL ||
    url.format({
      nodeIntegration: true,
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true
    });

  const overlayURL = process.env.ELECTRON_START_URL ?
    "http://localhost:3000/#/Overlay" :
    url.format({
      nodeIntegration: true,
      pathname: path.join(__dirname, "/../build/index.html"),
      hash: "/Overlay",
      protocol: "file:",
      slashes: true
    });

  win.loadURL(rtURL);
  edOverlay.loadURL(overlayURL);

  if (!!process.env.ELECTRON_START_URL) {
    win.openDevTools({
      //  mode: 'detach'
    });
    edOverlay.openDevTools({
      mode: "detach"
    });
  }
  /*
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
    });*/

  win.webContents.on("will-navigate", function (event, newUrl) {
    if (newUrl.indexOf("https://fuelrats.com/authorize") >= 0) {
      ratAuth.req = qs.parse(newUrl.split("?")[1]);
    }

    if (newUrl.indexOf("http://rattracker/auth") >= 0) {
      event.preventDefault();
      win.webContents.stop();
      ratAuth.res = qs.parse(newUrl.split("#")[1]);
      if (ratAuth.req.state == ratAuth.res.state) {
        if ("undefined" !== typeof ratAuth.res.error) {
          win.loadURL(
            url.format({
              nodeIntegration: false,
              pathname: path.join(__dirname, "login_denied.html"),
              protocol: "file:",
              slashes: true
            })
          );
        } else {
          if (process.env.ELECTRON_START_URL) {
            win.loadURL(
              process.env.ELECTRON_START_URL +
              "/#/?access_token=" +
              ratAuth.res.access_token
            );
          } else {
            win.loadURL(
              url.format({
                nodeIntegration: true,
                pathname: path.join(
                  __dirname,
                  "/../build/index.html"
                ),
                protocol: "file:",
                hash: "/?access_token=" +
                  ratAuth.res.access_token,
                slashes: true
              })
            );
          }
        }
      }
    }
  });

  win.on("closed", () => {
    log.info("Closing main window");
    edOverlay.close();
    win = null;
  });

  edOverlay.on("closed", () => {
    log.info("Closing overlay window");
    edOverlay = null;
  });
}

setInterval(() => {
  var d = journalReader.Data();
  if (edOverlay == null) return;
  if (
    d.Online &&
    typeof d.Status.GuiFocus != "undefined" &&
    d.Status.GuiFocus == 0
  ) {
    if (!edOverlay.isVisible()) {
      log.info("Showing overlay");
      log.debug(d);
      edOverlay.show();
    }
  } else {
    if (edOverlay.isVisible()) {
      log.info("Hiding overlay");
      log.debug(d);
      edOverlay.hide();
    }
  }
}, 1000);

app.on("ready", createWindow);

app.on("before-quit", () => {
  log.info("Preparing to quit application");
  win.close();
  edOverlay.close();
});

app.on("window-all-closed", () => {
  log.info("Application exited");
  if (process.platform !== "darwin") {
    app.quit();
  }
});
