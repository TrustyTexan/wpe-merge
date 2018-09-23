const path = require('path');
const generateNewDataRows = require('./generate-new-data-rows');
const readInCSV = require('./read-in-csv');
const requestRowData = require('./request-row-data');
const writeCSVFile = require('./write-csv-file');

const NODE_VERSION = 9;
const CSV_DELIMITER = ',';

async function run(inputFile, outputFile) {
    // Read in csv data
    const inputFilePath = path.isAbsolute(inputFile) ? inputFile : path.join(__dirname, inputFile);
    let fileDataRows = await readInCSV(inputFilePath, CSV_DELIMITER);

    // Request and receive status data for all read-in rows
    const requestedDataRows = await Promise.all(
        // Only request on non-header rows
        fileDataRows.map((row, index) => index && requestRowData(row[0]))
    );

    // Combine the file data rows and requested data rows 
    const newDataRows = generateNewDataRows(fileDataRows, requestedDataRows);;

    // Generate new csv file with combined data set
    await writeCSVFile(newDataRows, outputFile, CSV_DELIMITER);
}

module.exports = async function main() {
    const major = process.version.split('.')[0][1];
    if (major < NODE_VERSION) {
        throw Error(`Please install node version ${NODE_VERSION} or higher.`);
    }

    const [_, __, inputFile, outputFile] = process.argv;

    if (!inputFile) {
        throw Error('Please specify input file.');
    }
    if (!outputFile) {
        throw Error('Please specify output file path.');
    }

    if (path.dirname(outputFile) !== '.') {
        throw Error('Please specify a output file name with no path.')
    }

    await run(inputFile, outputFile);
}
