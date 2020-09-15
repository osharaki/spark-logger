// TODO: texarea should preserve its content

const table_parsedEntries = document.getElementById("parsedEntries");
const tr_headers = document.createElement('tr');
const th_item = document.createElement('th');
th_item.appendChild(document.createTextNode('Item'));
const th_amount = document.createElement('th');
th_amount.appendChild(document.createTextNode('Amount'));
tr_headers.appendChild(th_item);
tr_headers.appendChild(th_amount);

const textArea = document.getElementById("textarea");
const entryOrderSwitch = document.getElementById('checkbox')
textarea.placeholder = entryOrderSwitch.checked ? "Amount 1    Item 1\nAmount 2    Item 2\nAmount 3    Item 3\n..." : "Item 1    Amount 1\nItem 2    Amount 2\nItem 3    Amount 3\n...";
const logButton = document.getElementsByTagName('button')[0];
logButton.disabled = true; // button is disabled by default
let parsedEntries = []; // Used by button for finally logging the entries
const div_warning = document.getElementById("warning");

textArea.oninput = () => {
    // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
    var heightLimit = 300; /* unit is implicitly px */
    textarea.style.height = ""; /* Reset the height*/
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + 2 + "px"; // the 2 is added to account for the top and bottom borders (1px each)

    parsedEntries = []; // Otherwise, typing out entries (as opposed to copying and pasting them) will register a new entry for each digit in the amount. E.g. speise 250 => [{amount: "2", item: "speise"}, {amount: "25", item: "speise"}, {amount: "250", item: "speise"}] only the first of which (i.e. {amount: "2", item: "speise"}) will actually be found in favs.
    logButton.disabled = true; // button is disabled by default
    table_parsedEntries.innerHTML = '';
    table_parsedEntries.appendChild(tr_headers);
    const content = textArea.value;

    div_warning.className = "";

    chrome.runtime.sendMessage({ msg: "User Input", data: content, isItemAmount: !entryOrderSwitch.checked }, (response) => {
        if (response) {
            if (response.data) {
                for (const entry of response.data) {
                    parsedEntries = response.data;

                    logButton.disabled = false; // button enabled as soon as there's a valid entry
                    const tr_parsedEntry = document.createElement('tr');
                    const td_parsedItem = document.createElement('td');
                    td_parsedItem.appendChild(document.createTextNode(`${entry.item}`));
                    const td_parsedAmount = document.createElement('td');
                    td_parsedAmount.appendChild(document.createTextNode(`${entry.amount}`));
                    tr_parsedEntry.appendChild(td_parsedItem);
                    tr_parsedEntry.appendChild(td_parsedAmount);
                    table_parsedEntries.appendChild(tr_parsedEntry);
                }

                // Check if all entries were successfully parsed and if not, issue warning
                if ((content.match(/\n/g) || '').length + 1 > response.data.length) { // The regex counts the number of lines in the textarea. ' ' ensures that this number is always greater than 0.
                    console.log('warn user about unparsed entries');
                    div_warning.className = "parse-warning";
                }
                else {
                    div_warning.className = "";
                }
                updateWarning();
            }
        }
    });
};

logButton.onclick = () => {
    console.log(parsedEntries);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log(parsedEntries);
        chrome.tabs.sendMessage(tabs[0].id, { msg: "Log Entries", data: parsedEntries }, (response) => {
            if (response) {
                if (response.data) {
                    if (response.data.length !== parsedEntries.length) {
                        console.log('warn user about unfound favs');
                        div_warning.className = "fav-warning";
                        updateWarning();
                    }
                }
            }
        });
        // Has to be inside this callback to guarantee that it gets exectutes after sendMessage is called. If placed outside the callback, it doesn't wait for chrome.tabs.query to finish and executes before sendMessage is called, in the process clearing parsedEntries and so an empty array is sent to crawler.js. My guess is that this is because chrome.tabs.query is asynchronous (although this isn't stated in the docs). One way to make these two lines independant of the callback is to find a way to make the call to chrome.tabs.query blocking.
        textArea.value = '';
        textArea.dispatchEvent(textAreaInputEvent);
    });
}

const textAreaInputEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
})

entryOrderSwitch.onclick = () => {
    textarea.placeholder = entryOrderSwitch.checked ? "Amount 1    Item 1\nAmount 2    Item 2\nAmount 3    Item 3\n..." : "Item 1    Amount 1\nItem 2    Amount 2\nItem 3    Amount 3\n...";
    textArea.dispatchEvent(textAreaInputEvent); // Triggers a "fake" input event whenever the switch is toggled
}

function updateWarning() {
    if (div_warning.classList.contains('parse-warning'))
        div_warning.innerText = "parse warning";
    else if (div_warning.classList.contains('fav-warning'))
        div_warning.innerText = "fav warning";
    else
        div_warning.innerText = "";
}
