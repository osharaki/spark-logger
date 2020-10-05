function parseEntries(entries, isItemAmount = true) {
    // https://stackoverflow.com/questions/21711768/split-string-in-javascript-and-detect-line-break
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

    const entriesParsed = [];
    const lines = entries.match(/^.*\n/gm); // an entry is only confirmed after pressing enter
    if (lines) {
        if (!isItemAmount) {
            // amount followed by item
            for (const line of lines) {
                const matches = line.match(/^ *[0-9]+(.[0-9]+)? (?=(.*$))/m); // global flag removed to be able to access capturing groups
                if (matches)
                    entriesParsed.push({ amount: removeWrappingSpaces(matches[0]), item: removeWrappingSpaces(matches[2]) })

                /* An alternative that can be used for targeted parse warnings */
                // matches ? entriesParsed.push({ amount: removeWrappingSpaces(matches[0]), item: removeWrappingSpaces(matches[2]) }) : entriesParsed.push(null);
            }
        }
        else {
            // item followed by amount
            for (const line of lines) {
                const matches = line.match(/^.* (?=([0-9]+(.[0-9]+)? *$))/m);
                if (matches)
                    entriesParsed.push({ amount: removeWrappingSpaces(matches[1]), item: removeWrappingSpaces(matches[0]) })

                /* An alternative that can be used for targeted parse warnings */
                // matches ? entriesParsed.push({ amount: removeWrappingSpaces(matches[1]), item: removeWrappingSpaces(matches[0]) }) : entriesParsed.push(null);
            }
        }
        // This null element is used for warning in the UI
        if (lines.length !== entriesParsed.length)
            entriesParsed.push(null);
    }

    return entriesParsed;
}

// Removes spaces surrrounding a string
function removeWrappingSpaces(literal) {
    return literal.replace(/ +$/m, "").replace(/^ +/m, "");
}

export { parseEntries, removeWrappingSpaces };