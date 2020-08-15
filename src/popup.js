const table_parsedEntries = document.getElementById("parsedEntries");
const tr_headers = document.createElement('tr');
const th_item = document.createElement('th');
th_item.appendChild(document.createTextNode('Item'));
const th_amount = document.createElement('th');
th_amount.appendChild(document.createTextNode('Amount'));
tr_headers.appendChild(th_item);
tr_headers.appendChild(th_amount);

const textArea = document.getElementById("textarea");

textArea.oninput = () => {
    table_parsedEntries.innerHTML = '';
    table_parsedEntries.appendChild(tr_headers);
    const content = textArea.value;
    console.log(content);
    chrome.runtime.sendMessage({ msg: "User Input", data: content }, (response) => {
        if (response) {
            if (response.data) {
                for (const entry of response.data) {
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
    });
};