function parseEntries(entries, isItemAmount) {
    // https://stackoverflow.com/questions/21711768/split-string-in-javascript-and-detect-line-break
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

    const entriesParsed = [];
    const lines = entries.match(/^.*\n/gm); // an entry is only confirmed after pressing enter
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
        // This null element is used for warning in the UI
        if (lines.length !== entriesParsed.length)
            entriesParsed.push(null);
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