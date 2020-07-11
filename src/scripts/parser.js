function parseEntries(entries) {
    // https://stackoverflow.com/questions/21711768/split-string-in-javascript-and-detect-line-break
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    // TODO: allow for entering unit, e.g. 1 [tbsp] honey
    // TODO: allow for multiple words inside parentheses, e.g. 100 napa (chinese cabbage)
    // TODO: allow for other separators, e.g. puten-minifilet registers as 2 words
    const matches = entries.match(/[0-9]+|(([a-zA-Z]|ü|ä|ö)+ *(\(?([a-zA-Z]|ü|ä|ö)+\)?|\([0-9]+\.?[0-9]+\)?))/g); // equivalent to [\w]
    const entriesParsed = [];
    if (matches) {
        if (!matches[0].match(/[a-zA-Z]/)) {
            // amounts at even positions
            // https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
            for (let i = 0; i < matches.length; i++) {
                if (!(i % 2))
                    entriesParsed.push({ amount: matches[i], item: null });
                else
                    entriesParsed[Math.floor(i / 2)].item = matches[i];
            }
        }
        else {
            // amounts at odd positions
            for (let i = 0; i < matches.length; i++) {
                if (!(i % 2))
                    entriesParsed.push({ amount: null, item: matches[i] });
                else
                    entriesParsed[Math.floor(i / 2)].amount = matches[i];
            }
        }
    }
    // TODO: add check to warn about inconsistent item-amount placement
    // TODO: warn about foods not found in favorites
    // TODO: GUI - display parsed entries neatly and allow user to make changes
    // TODO: GUI - entries not found should be marked in display (live update)
    // TODO: potato and sweet potato are matched together
    console.log(entriesParsed);
    return entriesParsed;
}

export default parseEntries;