module.exports = function (fileDataRows, requestedDataRows) {
    return fileDataRows.map((row, i) => {
        if (row.length !== 4) {
            throw Error('File input data arrays should have a length of 4.')
        }
        if (i === 0) {
            return ['Account ID', 'First Name', 'Created On', 'Status', 'Status Set On'];
        }
        return [
            row[0],
            row[2],
            row[3],
            requestedDataRows[i].status || '',
            requestedDataRows[i].created_on || ''
        ];
    })
}
