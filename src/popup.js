const { crossRefEntries } = require("./scripts/emojiEngine");

chrome.runtime.connect(); // allows subscribing to onConnect/onDisconnect events in background.js to detect when popup is opened/closed

const table_container = document.getElementById("table-container");
const table_parsedEntries = document.getElementById("parsed-entries");

const textArea = document.getElementById("textarea");
textArea.focus();
const logButton = document.getElementsByTagName('button')[0];
logButton.disabled = true; // button is disabled by default
let parsedEntries = []; // Used by button for finally logging the entries
const div_warning = document.getElementById("warning");

textArea.oninput = () => {
    // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
    var heightLimit = 200; /* unit is implicitly px */
    textarea.style.height = ""; /* Reset the height*/
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + 2 + "px"; // the 2 is added to account for the top and bottom borders (1px each)

    parsedEntries = []; // Otherwise, typing out entries (as opposed to copying and pasting them) will register a new entry for each digit in the amount. E.g. speise 250 => [{amount: "2", item: "speise"}, {amount: "25", item: "speise"}, {amount: "250", item: "speise"}] only the first of which (i.e. {amount: "2", item: "speise"}) will actually be found in favs.
    logButton.disabled = true; // button is disabled by default
    table_parsedEntries.innerHTML = '';
    const content = textArea.value;
    chrome.storage.local.set({ textareaContent: content }); // store textarea content

    div_warning.className = ""; // reset warnings

    chrome.runtime.sendMessage({ msg: "User Input", data: content }, (response) => {
        let parseError = false;
        if (response) {
            if (response.data) {
                chrome.storage.local.get(['favNames'], (result) => {
                    if (result) {
                        console.log(result.favNames)
                        if (result.favNames) {
                            const matchCount = crossRefEntries(result.favNames, response.data);
                            for (const [entryIndex, entry] of response.data.entries()) {
                                if (!entry) { // a null element in parser.js's response indicates that one or more entries did not match the formatting rules
                                    parseError = true;
                                    logButton.disabled = true;
                                    continue;
                                }
                                parsedEntries = response.data;

                                logButton.disabled = false; // button enabled as soon as there's a valid entry
                                const tr_parsedEntry = document.createElement('tr');
                                const td_emoji = document.createElement('td');
                                const td_parsedItem = document.createElement('td');
                                const td_parsedAmount = document.createElement('td');
                                if (matchCount[entryIndex] == 0) // entry not in favs
                                    td_emoji.innerHTML = '&#x2753';
                                else if (matchCount[entryIndex] > 1) // entry has multiple matches in favs
                                    td_emoji.innerHTML = '&#x2757';
                                else { // entry is fine, find appropriate emoji
                                    // call emoji engine
                                    td_emoji.innerHTML = '&#x2705';
                                }
                                td_parsedItem.appendChild(document.createTextNode(`${entry.item}`));
                                td_parsedAmount.appendChild(document.createTextNode(`${entry.amount}`));
                                tr_parsedEntry.appendChild(td_emoji);
                                tr_parsedEntry.appendChild(td_parsedItem);
                                tr_parsedEntry.appendChild(td_parsedAmount);
                                table_parsedEntries.appendChild(tr_parsedEntry);
                            }

                            if (parseError) {// Check if all entries were successfully parsed and if not, issue warning
                                if ((content.match(/^.*$/gm) || '').length > response.data.length) { // The regex counts the number of lines in the textarea. '' prevents error in case content.match() returns undefined due to no matches.
                                    div_warning.className = "parse-warning";
                                }
                                else {
                                    div_warning.className = "";
                                }
                            }
                            updateWarning();
                        }
                    }
                });
            }
        }
    });
};

logButton.onclick = () => {
    chrome.storage.local.set({ textareaContent: null }); // empty storage when user logs entries
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { msg: "Log Entries", data: parsedEntries }, (response) => {
                const isFavWarning = response.data.includes(null);

                // Has to be inside this callback so as not to undo the fav-warning class assignment. If placed outside, it would execute before the response arrives. This is because chrome.tabs.query, like most other Chrome API methods, is asynchronous (see: https://developer.chrome.com/extensions/overview#sync).
                textArea.value = '';
                textArea.dispatchEvent(textAreaInputEvent);
                if (response) {
                    if (response.data) {
                        if (isFavWarning) {
                            div_warning.className = "fav-warning";
                            updateWarning();
                        }
                    }
                }
            });
        }
    });
}

const textAreaInputEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        switch (request.msg) {
            case "Load textarea content":
                textArea.value = request.data;
                textArea.dispatchEvent(textAreaInputEvent);
                break;
        }
    }
});

function updateWarning() {
    if (div_warning.classList.contains('parse-warning'))
        div_warning.innerText = "Check input!";
    else if (div_warning.classList.contains('fav-warning'))
        div_warning.innerText = "Check favorites!";
    else
        div_warning.innerText = "";
}

const a_githubLink = document.getElementById('github-link');
a_githubLink.onclick = () => {
    chrome.tabs.create({ url: a_githubLink.getAttribute('href') });
}

const a_donationLink = document.getElementById('donation-link');
a_donationLink.onclick = () => {
    chrome.tabs.create({ url: a_donationLink.getAttribute('href') });
}

const a_usageLink = document.getElementById('usage-link');
a_usageLink.onclick = () => {
    chrome.tabs.create({ url: a_usageLink.getAttribute('href') });
}

const i_contactLink = document.getElementById('contact-link');
i_contactLink.onclick = () => {
    chrome.tabs.create({ url: i_contactLink.getAttribute('href') });
} 