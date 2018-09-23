const fs = require('fs');
const parse = require('csv-parse');

module.exports = function (inputFilePath, delimiter) {
    const csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath, { encoding: 'utf-8' })
            .on('error', err => {
                if (err.code === 'ENOENT') {
                    reject(new Error('The input file you specified does not exist.'));
                }
                reject(err);
            })
            .pipe(parse({ delimiter }))
            .on('error', e => reject(e))

            // TODO: consider using async transform -- need to determine how to detect first row
            // .pipe(transform(async (data, cb) => {
            //     const blah = await requestRowData(data[0]);
            //     cb(null, blah.account_id);
            // }))

            .on('data', csvrow => {
                if (csvrow.length !== 4) {
                    reject(new Error('Rows must have 4 columns.'));
                }
                csvData.push(csvrow);
            })
            .on('end', () => {
                resolve(csvData);
            });
    });
}
