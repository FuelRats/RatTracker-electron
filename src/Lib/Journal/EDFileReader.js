const fs = require('fs');
const Tail = require('tail').Tail;
const logParser = require('./EDJournalLogParser');

module.exports = {
  profileDir: null,
  selDir: null,
  lastFile: null,
  lastLine: 0,
  lastStatusLine: null,
  currentLogTail: null,
  currentStatusTail: null,
  getData() {
    return logParser.localData;
  },
  checkFiles(evt) {
    this.selDir = evt.target.files;
    this.monitorChanges(this.selDir);
  },
  monitorChanges(_selDir) {
    if (_selDir === null)
      return;

    const _files = _selDir;
    const _fileCount = _files.length;
    let i = 0;
    while (i < _fileCount) {
      if (_files[i].match(/Journal\.\d+\.\d+\.log/gi)) {
        if (this.lastFile === null || _files[i] !== this.lastFile) {
          this.lastFile = _files[i];
        }
      }
      i++;
    }
    if (this.lastFile !== null) {
      fs.readFile(`${this.profileDir}${this.lastFile}`, {
        encoding: 'UTF-8'
      }, (err, str) => {
        if (err !== null) {}
        if (typeof str !== 'undefined') {
          this.logfileOnLoad(str);
        }
      });

      this.tailLogFile(`${this.profileDir}${this.lastFile}`);
    }

    fs.readFile(`${this.profileDir}status.json`, {
      encoding: 'UTF-8'
    }, (err, str) => {
      if (err !== null) {}
      if (typeof str !== 'undefined') {
        this.statusfileOnLoad(str);
      }
    });
    this.readStatusFile(`${this.profileDir}status.json`);

    let that = this;

    setTimeout(function () {
      _selDir = that.loadLogFiles();
      that.monitorChanges(_selDir);
    }, 1000);
  },
  statusfileOnLoad(fileContent) {
    if (this.lastStatusLine !== fileContent) {
      logParser.parseStatusFile(fileContent);
    }

    this.lastStatusLine = fileContent;
    //edjGui.updateGui();
  },
  logfileOnLoad(fileContent) {
    const lines = fileContent.split('\n');
    let l = this.lastLine;
    while (l < lines.length) {
      if (this.lastLine !== lines[l]) {
        logParser.parseLogLine(lines[l]);
      }
      l++;
    }
    this.lastLine = l;
    //edjGui.updateGui();
  },
  loadLogFiles() {
    const userProfile = (typeof process.env.HOME !== 'undefined' ? process.env.HOME : process.env.USERPROFILE);
    const journalFolder = `${userProfile}\\Saved Games\\Frontier Developments\\Elite Dangerous\\`;
    this.profileDir = journalFolder;
    this.selDir = fs.readdirSync(journalFolder);
    return this.selDir;
  },
  readStatusFile(fileName) {
    if (fileName === 'null')
      return;
    if (fileName == this.currentStatusTail) {
      return;
    }

    console.log('tailing file ' + fileName);
    const logTail = new Tail(fileName);

    logTail.on('line', line => {
      logParser.parseStatusFile(line);
    });

    logTail.on('error', error => {
      console.error(error);
    });

    this.currentStatusTail = fileName;
  },
  tailLogFile(fileName) {
    if (fileName === 'null')
      return;
    if (fileName == this.currentLogTail) {
      return;
    }
    console.log('tailing file ' + fileName);

    const logTail = new Tail(fileName);

    logTail.on('line', line => {
      logParser.parseLogLine(line);
    });

    logTail.on('error', error => {
      console.error(error);
    });
    this.currentLogTail = fileName;
  },
};