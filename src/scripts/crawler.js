function findFavs(entries) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
    // https://stackoverflow.com/questions/6991494/javascript-getelementbyid-based-on-a-partial-string
    // https://stackoverflow.com/questions/6061760/document-getelementbyid-regex
    const favs = document.querySelectorAll('[id^="fav_line"]');
    const matchingElements = [];
    for (let fav of favs) {
        const favText = fav.getElementsByClassName("np_tc2")[0].getElementsByTagName("label")[0].innerText;
        for (let entry of entries) {
            if (entry) {
                if (entry.item && favText.toLowerCase().includes(entry.item.toLowerCase())) {
                    const checkbox = fav.getElementsByClassName("np_tc1")[0].getElementsByTagName("input")[0];
                    const select = fav.getElementsByClassName("np_tc4")[0].getElementsByTagName("select")[0];
                    const options = select.getElementsByTagName("option");
                    const textField = fav.getElementsByClassName("np_tc3")[0].getElementsByTagName("input")[0];
                    matchingElements.push({
                        checkbox: checkbox,
                        select: select,
                        options: options,
                        textField: textField,
                        amount: entry.amount
                    })
                    break;
                }
            }
        }
    }
    const searchFavInput = document.getElementsByClassName("tracker_search_fav_input")[0];
    matchingElements.push(searchFavInput);
    return matchingElements;
}

function fillFavs(foundElements) {
    // Clearing search bar to enable searching for new values
    const searchFavInput = foundElements[foundElements.length - 1];
    searchFavInput.value = "";
    searchFavInput.dispatchEvent(new Event("keyup"));

    for (let foundElement of foundElements.slice(0, -1)) {
        foundElement.checkbox.checked = true;
        for (let option of foundElement.options) {
            let optionText = option.innerText;
            if (optionText.toLowerCase().includes("gram"))
                foundElement.select.value = option.value;
        }
        foundElement.textField.value = foundElement.amount;
    }
    searchFavInput.value = "Feel free to log more items!";
    searchFavInput.dispatchEvent(new Event("keyup")); // https://stackoverflow.com/questions/136617/how-do-i-programmatically-force-an-onchange-event-on-an-input
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.msg == "Log Entries") {
        console.log('Message received by crawler');
        const foundElements = findFavs(request.data);
        fillFavs(foundElements);
        sendResponse({ sender: "crawler.js", data: foundElements });
    }
});