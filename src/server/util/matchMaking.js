

function getPossibleMatches(list) {
    const results = [];

    for (let i=list.shift(); typeof i !== 'undefined'; i=list.shift()) {
        let newList = Array.from(list);
        for (let j=newList.shift();  typeof j !== 'undefined'; j=newList.shift()) {
            results.push(
                {
                    team1: i,
                    team2: j,
                }
            );
        }
    }

    return results;
}

export {
    getPossibleMatches,
}