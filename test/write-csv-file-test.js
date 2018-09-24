const assert = require('assert');
const path = require('path');
const writeCSVFile = require('../src/write-csv-file');
const fs = require('fs');

describe('writeCSVFile', function () {
    const TEMP_OUTPUT_FILE = path.join(__dirname, 'test-output.csv')

    try {
        fs.unlinkSync(TEMP_OUTPUT_FILE);
    } catch (e) {}

    const goodData = [
        ['Account ID', 'First Name', 'Created On', 'Status', 'Status Set On'],
        ['314159', 'Ka-el', '1/12/13', 'good', '2012-01-12'],
        ['271', 'Bruce', '11/19/16', 'good', '2011-03-22'],
        ['8675309', 'Bruce', '2/22/99', 'closed', '2014-12-21'],
        ['99999', 'Yvonne', '3/5/13', 'fraud', '2014-09-17']
    ];

    afterEach(() => {
        try {
            fs.unlinkSync(TEMP_OUTPUT_FILE);
        } catch(e) {}
    });

    it('should generate csv file with proper data', async () => {
        const fd = await writeCSVFile(goodData, TEMP_OUTPUT_FILE);
        assert.equal(typeof fd, 'number');

        const fileContents = fs.readFileSync(TEMP_OUTPUT_FILE, { encoding: 'utf-8' });
        assert.equal(
            fileContents,
            // TODO: Use tagged templates to prevent the need to avoid indentation
            `Account ID,First Name,Created On,Status,Status Set On
314159,Ka-el,1/12/13,good,2012-01-12
271,Bruce,11/19/16,good,2011-03-22
8675309,Bruce,2/22/99,closed,2014-12-21
99999,Yvonne,3/5/13,fraud,2014-09-17`
        );
    });

    it('should throw proper error if data provided is not an array', async () => {
        try {
            const fd = await writeCSVFile('blah', TEMP_OUTPUT_FILE);
            assert(false);
        } catch (e) {
            assert.equal(e.message, 'Data input must be a non-empty array.');
        }
    });  
});
