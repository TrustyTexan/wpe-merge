const assert = require('assert');
const requestRowData = require('../src/request-row-data');
const nock = require('nock');
const http = require('http');

describe('requestRowData', () => {
    const response = {
        account_id: 314159,
        status: "good",
        created_on: "2012-01-12"
    };

    it('should resolve with the correct response', async () => {
        nock('http://interview.wpengine.io')
            .get('/v1/accounts/3')
            .reply(200, response);

        const resp = await requestRowData('3');
        assert.deepEqual(resp, response);
    });

    it('should throw proper error if there was no data for the id specific', async () => {
        nock('http://interview.wpengine.io')
            .get('/v1/accounts/3')
            .reply(200, { detail: 'Not found.' });

        try {
            const resp = await requestRowData('3');
        } catch(e) {
            assert.equal(e.message, 'There was no status data found for 3');
        }
    });
});
