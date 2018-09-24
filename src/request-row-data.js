const http = require('http');

module.exports = function (id) {
    return new Promise((resolve, reject) => {
        http.get(`http://interview.wpengine.io/v1/accounts/${id}`, resp => {
            let data = '';
            resp
                .on('data', (chunk) => {
                    data += chunk;
                })
                .on('end', () => {
                    const jsonData = JSON.parse(data);
                    if (jsonData && jsonData.detail === 'Not found.') {
                        reject(new Error(`There was no status data found for ${id}`));
                    }
                    resolve(jsonData);
                });
        }).on('error', e => reject(e));
    });
}
