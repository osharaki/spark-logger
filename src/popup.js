const table_parsedEntries = document.getElementById("parsedEntries");
const tr_headers = document.createElement('tr');
const th_item = document.createElement('th');
th_item.appendChild(document.createTextNode('Item'));
const th_amount = document.createElement('th');
th_amount.appendChild(document.createTextNode('Amount'));
tr_headers.appendChild(th_item);
tr_headers.appendChild(th_amount);

const textArea = document.getElementById("textarea");
import { MDCSwitch } from '@material/switch';
const entryOrderSwitch = document.querySelector('.mdc-switch')
const switchControl = new MDCSwitch(document.querySelector('.mdc-switch'));
textarea.placeholder = switchControl.checked ? "Item 1    Amount 1\nItem 2    Amount 2\nItem 3    Amount 3&#10..." : "Amount 1    Item 1\nAmount 2    Item 2\nAmount 3    Item 3\n...";

textArea.oninput = () => {
    // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
    var heightLimit = 300; /* unit is implicitly px */
    textarea.style.height = ""; /* Reset the height*/
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + 2 + "px"; // the 2 is added to account for the top and bottom borders (1px each)

    table_parsedEntries.innerHTML = '';
    table_parsedEntries.appendChild(tr_headers);
    const content = textArea.value;
    console.log(content);
    chrome.runtime.sendMessage({ msg: "User Input", data: content }, (response) => {
        if (response) {
            if (response.data) {
                for (const entry of response.data) {
                    if (entry) {
                        console.log(entry);
                        const tr_parsedEntry = document.createElement('tr');
                        const td_parsedItem = document.createElement('td');
                        td_parsedItem.appendChild(document.createTextNode(`${entry.item}`));
                        const td_parsedAmount = document.createElement('td');
                        td_parsedAmount.appendChild(document.createTextNode(`${entry.amount}`));
                        tr_parsedEntry.appendChild(td_parsedItem);
                        tr_parsedEntry.appendChild(td_parsedAmount);
                        table_parsedEntries.appendChild(tr_parsedEntry);
                    }
                }
            }
        }
    });
};


entryOrderSwitch.onclick = () => {
    console.log(`Switch on: ${switchControl.checked}`);
    textarea.placeholder = switchControl.checked ? "Item 1    Amount 1\nItem 2    Amount 2\nItem 3    Amount 3\n..." : "Amount 1    Item 1\nAmount 2    Item 2\nAmount 3    Item 3\n...";
}
