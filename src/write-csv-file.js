const fs = require('fs');
const csv = require('fast-csv');

module.exports = function (data, outputFile, delimiter) {
    if (!Array.isArray(data) || !data.length) {
        throw Error('Data input must be a non-empty array.');
    }
    return new Promise((resolve, reject) => {
        const fd = fs.openSync(outputFile, 'w');

        function handleAsyncError(e) {
            try {
                fs.closeSync(fd);
            } catch (e) {};
            reject(e);
        }

        csv
            .writeToStream(
                fs.createWriteStream(null, { fd })
                    .on('error', e => handleAsyncError(e))
                    .on('finish', (d) => {
                        resolve(fd);
                    }),
                data,
                { headers: true, delimiter }
            )
            .on('error', e => handleAsyncError(e))
    });
}
