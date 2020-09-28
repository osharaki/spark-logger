import levenshtein from "js-levenshtein";

function crossRefEntries(favNames, entries) {
    const matchingElements = [];
    const matchCount = Array(entries.length).fill(0);
    for (let favName of favNames) {
        let minDist = Infinity;
        let mostSimilarElement = null;
        let mostSimilarElementIndex = null;

        for (const [i, entry] of entries.entries()) {
            if (entry) {
                if (entry.item && favName.toLowerCase().includes(entry.item.toLowerCase())) {
                    const dist = levenshtein(entry.item, favName); // choosing most similar match
                    if (dist < minDist) {
                        minDist = dist;
                        mostSimilarElement = favName
                        mostSimilarElementIndex = i;
                    }
                }
            }
        }
        if (mostSimilarElement) {
            matchingElements.push(mostSimilarElement);
            matchCount[mostSimilarElementIndex]++;
        }
    }
    return matchCount
}

export { crossRefEntries }