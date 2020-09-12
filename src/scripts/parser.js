function parseEntries(entries, isItemAmount) {
    // https://stackoverflow.com/questions/21711768/split-string-in-javascript-and-detect-line-break
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    // TODO: allow for entering unit, e.g. 1 [tbsp] honey
    // TODO: add check to warn about inconsistent item-amount placement
    // TODO: warn about foods not found in favorites
    // TODO: GUI - entries not found should be marked in display (live update)
    // TODO: potato and sweet potato are matched together

    const entriesParsed = [];
    const lines = entries.match(/^.*$/gm);
    if (lines) {
        if (!isItemAmount) {
            // amount followed by item
            for (const line of lines) {
                const matches = line.match(/^ *[0-9]+ (?=(.*$))/m); // global flag removed to be able to access capturing groups
                // const matches = line.match(/(^ *[0-9]+|.*$)/gm);
                if (matches)
                    matches[1] ? entriesParsed.push({ amount: removeWrappingSpaces(matches[0]), item: removeWrappingSpaces(matches[1]) })
                        : entriesParsed.push({ amount: removeWrappingSpaces(matches[0]), item: null });
            }
        }
        else {
            // item followed by amount
            for (const line of lines) {
                const matches = line.match(/^.* (?=([0-9]+ *$))/m);
                // const matches = line.match(/^.* |[0-9]+ *$/gm);
                if (matches)
                    matches[1] ? entriesParsed.push({ amount: removeWrappingSpaces(matches[1]), item: removeWrappingSpaces(matches[0]) })
                        : entriesParsed.push({ amount: null, item: removeWrappingSpaces(matches[0]) });
            }
        }
    }

    // console.log(entriesParsed);
    return entriesParsed;
}

// Removes spaces surrrounding a string
function removeWrappingSpaces(literal) {
    return literal.replace(/ +$/m, "").replace(/^ +/m, "");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg == "User Input") {
        const parsedEntries = parseEntries(request.data, request.isItemAmount);
        sendResponse({ sender: "parser.js", data: parsedEntries });
    }
})