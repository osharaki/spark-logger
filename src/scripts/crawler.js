function findFavs(entriesRaw) {
    const entries = parseEntries(entriesRaw);
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
    // https://stackoverflow.com/questions/6991494/javascript-getelementbyid-based-on-a-partial-string
    // https://stackoverflow.com/questions/6061760/document-getelementbyid-regex
    // TODO: navigate to favorites tab automatically in the beginning
    const favs = document.querySelectorAll('[id^="fav_line"]');
    for (let fav of favs) {
        const favText = fav.getElementsByClassName("np_tc2")[0].getElementsByTagName("label")[0].innerText;
        const matchingElements = [];
        for (let entry of entries) {
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
                })
                break;
            }
        }
    }
    const searchFavInput = document.getElementsByClassName("tracker_search_fav_input")[0];
    matchingElements.push(searchFavInput);
    return matchingElements;
}

function fillFavs(elements) {
    for (let element of elements) {
        element.checkBox.checked = true;
        for (let option of element.options) {
            let optionText = option.innerText;
            if (optionText.toLowerCase().includes("gram"))
                element.select.value = option.value;
        }
        element.textField.value = entry.amount;
    }
    const searchFavInput = elements[elements.length - 1];
    searchFavInput.value = "gjkdfgksjdg";
    searchFavInput.dispatchEvent(new Event("keyup")); // https://stackoverflow.com/questions/136617/how-do-i-programmatically-force-an-onchange-event-on-an-input
}