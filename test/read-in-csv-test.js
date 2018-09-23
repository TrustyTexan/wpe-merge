const assert = require('assert');
const path = require('path');
const readInCSV = require('../read-in-csv');

describe('readInCSV', function () {
    it('should throw proper error message if file DNE', async () => {
        try {
            await readInCSV('adsfasdf', ',');
            assert(false);
        } catch (e) {
            assert.equal(e.message, 'The input file you specified does not exist.');
        }
    });

    it('should throw proper error if input file doesn\'t have 4 columns', async () => {
        try {
            await readInCSV(path.join(__dirname, './mockFiles/not-enough-columns.csv'), ',');
            assert(false);
        } catch (e) {
            assert.equal(e.message, 'Rows must have 4 columns.');
        }
    });

    it('should throw when data is malformed', async () => {
        try {
            await readInCSV(path.join(__dirname, './mockFiles/malformed.csv'), ',');
            assert(false);
        } catch (e) {
            assert(true);
        }
    });

    it('should return good data', async () => {
        const rowData = await readInCSV(path.join(__dirname, './mockFiles/good-data.csv'), ',');
        assert.deepEqual(rowData, [
            ['Account ID', 'Account Name', 'First Name', 'Created On'],
            ['314159', 'superman', 'Ka-el', '1/12/13'],
            ['271', 'batman', 'Bruce', '11/19/16'],
            ['8675309', 'hulk', 'Bruce', '2/22/99'],
            ['99999', 'batgirl', 'Yvonne', '3/5/13']
        ]);
    });
});
