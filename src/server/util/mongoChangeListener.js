
function sleep(ms) {
    return new Promise((resolve => {
        setTimeout(resolve, ms);
    }))
}

async function monitorModelCollection(model, callback, currentSum = false) {
    model.collection.stats(async (err, results) => {
        if (!err) {
            const checkSum = results.size
                + results.storageSize
                + results.count
                + results.avgObjSize
                + results.storageSize
                + results.totalIndexSize;

            if (currentSum && checkSum && currentSum !== checkSum) {
                callback();
            }

            await sleep(100);
            await monitorModelCollection(model, callback, checkSum);
        }
    });
}

export {
    monitorModelCollection,
}
