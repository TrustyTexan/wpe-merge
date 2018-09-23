const assert = require('assert');
const path = require('path');
const fs = require('fs');
const nock = require('nock');
const main = require('../main');

describe('wpe-merge', function () {
    const TEMP_OUTPUT_FILE = 'test-output.csv';
    const TEMP_OUTPUT_FILE_PATH = path.join(__dirname, '../', TEMP_OUTPUT_FILE)

    nock('http://interview.wpengine.io')
        .get('/v1/accounts/314159')
        .reply(200, {
            account_id: 314159,
            status: "good",
            created_on: "2012-01-12"
        });
    
    nock('http://interview.wpengine.io')
        .get('/v1/accounts/271')
        .reply(200, {
            account_id: 271,
            status: "good",
            created_on: "2011-03-22"
        });

    nock('http://interview.wpengine.io')
        .get('/v1/accounts/8675309')
        .reply(200, {
            account_id: 8675309,
            status: "closed",
            created_on: "2014-12-21"
        });

    nock('http://interview.wpengine.io')
        .get('/v1/accounts/99999')
        .reply(200, {
            account_id: 99999,
            status: "fraud",
            created_on: "2014-09-17"
        });

    try {
        fs.unlinkSync(TEMP_OUTPUT_FILE_PATH);
    } catch (e) { }

    afterEach(() => {
        try {
            fs.unlinkSync(TEMP_OUTPUT_FILE_PATH);
        } catch (e) { }
    });

    it('should work!', async () => {
        process.argv = [null, null, 'test/mockFiles/good-data.csv', TEMP_OUTPUT_FILE];
        await main();
        const fileContents = fs.readFileSync(TEMP_OUTPUT_FILE_PATH, { encoding: 'utf-8' });
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
});
