const assert = require('assert');
const generateNewDataRows = require('../generate-new-data-rows');

describe('generateNewDataRows', function () {
    const fileInputData = [
        ['Account ID', 'Account Name', 'First Name', 'Created On'],
        ['314159', 'superman', 'Ka-el', '1/12/13'],
        ['271', 'batman', 'Bruce', '11/19/16'],
        ['8675309', 'hulk', 'Bruce', '2/22/99'],
        ['99999', 'batgirl', 'Yvonne', '3/5/13']
    ];

    const requestedDataRows = [
        0,
        { account_id: 314159, status: 'good', created_on: '2012-01-12' },
        { account_id: 271, status: 'good', created_on: '2011-03-22' },
        {
            account_id: 8675309,
            status: 'closed',
            created_on: '2014-12-21'
        },
        { account_id: 99999, status: 'fraud', created_on: '2014-09-17' }
    ];

    it('should properly combine file data and requested data', () => {
        const newDataRows = generateNewDataRows(fileInputData, requestedDataRows);
        assert.deepEqual(newDataRows, [
            ['Account ID', 'First Name', 'Created On', 'Status', 'Status Set On'],
            ['314159', 'Ka-el', '1/12/13', 'good', '2012-01-12'],
            ['271', 'Bruce', '11/19/16', 'good', '2011-03-22'],
            ['8675309', 'Bruce', '2/22/99', 'closed', '2014-12-21'],
            ['99999', 'Yvonne', '3/5/13', 'fraud', '2014-09-17']
        ]);
    });

    it('should throw proper error if fileInputData contains arrays that are not of length 4', () => {
        try {
            const newDataRows = generateNewDataRows(
                [...fileInputData, ['a']],
                requestedDataRows
            );
            assert(false);
        }
        catch(e) {
            assert.equal(e.message, 'File input data arrays should have a length of 4.');
        }
    });
});
