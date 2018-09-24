const main = require('./src/main');

function handleError(e) {
    // TODO: Add logging
    // TODO: Offer --dev option to throw error for stack trace
    // throw e;
    console.log(e.message);
}

main()
    .then(() => console.log('New file generated.'))
    .catch(e => {
        handleError(e);
    });
