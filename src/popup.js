const div_main = document.getElementById("containerMain");
const textArea = document.getElementById("textarea");
const div_parsedEntries = document.createElement('div');
div_parsedEntries.setAttribute("style", "display: inline-block");
div_main.appendChild(div_parsedEntries);

textArea.oninput = () => {
    div_parsedEntries.innerHTML = '';
    const content = textArea.value;
    console.log(content);
    chrome.runtime.sendMessage({ msg: "User Input", data: content }, (response) => {
        if (response) {
            if (response.data) {
                for (const entry of response.data) {
                    console.log(entry);
                    const p_parsedEntry = document.createElement('p');
                    const p_parsedEntryText = document.createTextNode(`${entry.item} ${entry.amount}`);
                    p_parsedEntry.appendChild(p_parsedEntryText);
                    div_parsedEntries.appendChild(p_parsedEntry);
                }
                // document.body.appendChild(div_parsedEntries);
            }
        }
    });
};