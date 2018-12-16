const fileReader = require('./EDFileReader');
const edData = require('./EDData');

/**
 * @typedef {import('./EDData.js')} EDData
 */

module.exports = {
    FileReader: fileReader,
    /**
     * @returns EDData
     */
    Data() {
        return this.FileReader.getData();
    }
};