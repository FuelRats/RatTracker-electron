const fileReader = require('./EDFileReader');
const edData = require('./EDData');

module.exports = {
    FileReader: fileReader,
    Data() {
        return this.FileReader.getData();
    }
};