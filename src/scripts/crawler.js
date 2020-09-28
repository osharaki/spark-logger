import levenshtein from "js-levenshtein";

function findFavs(entries) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
    // https://stackoverflow.com/questions/6991494/javascript-getelementbyid-based-on-a-partial-string
    // https://stackoverflow.com/questions/6061760/document-getelementbyid-regex
    const favs = document.querySelectorAll('[id^="fav_line"]');
    const matchingElements = [];
    let matchCount = Array(entries.length).fill(0);
    for (let fav of favs) {
        const favText = fav.getElementsByClassName("np_tc2")[0].getElementsByTagName("label")[0].innerText;
        let minDist = Infinity;
        let mostSimilarElement = null;
        let mostSimilarElementIndex = null;

        for (const [i, entry] of entries.entries()) {
            if (entry) {
                if (entry.item && favText.toLowerCase().includes(entry.item.toLowerCase())) {
                    const dist = levenshtein(entry.item, favText); // choosing most similar match
                    if (dist < minDist) {
                        minDist = dist;
                        const checkbox = fav.getElementsByClassName("np_tc1")[0].getElementsByTagName("input")[0];
                        const select = fav.getElementsByClassName("np_tc4")[0].getElementsByTagName("select")[0];
                        const options = select.getElementsByTagName("option");
                        const textField = fav.getElementsByClassName("np_tc3")[0].getElementsByTagName("input")[0];
                        mostSimilarElement = {
                            checkbox: checkbox,
                            select: select,
                            options: options,
                            textField: textField,
                            amount: entry.amount
                        };
                        mostSimilarElementIndex = i;
                    }
                }
            }
        }
        if (mostSimilarElement) {
            matchingElements.push(mostSimilarElement);
            matchCount[mostSimilarElementIndex]++;
        }
    }
    const error = matchCount.some((e) => e == 0 || e > 1); // trigger error if any entry is never found or found more than once in favs
    if (error)
        matchingElements.push(null);
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
        if (!foundElement) {
            continue; // skip the null element, which signals a fav warning
        }
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
    if (request.msg == "Log Entries") {
        let foundElements = findFavs(request.data);
        fillFavs(foundElements);
        foundElements = foundElements.filter(value => {
            if (value == null)
                return true;
            else
                return Object.keys(value).length !== 0;
        }); // removing empty objects from foundElements (for some reason findFavs always finds an extra empty object) while keeping the null element if it exists
        sendResponse({ sender: "crawler.js", data: foundElements });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg == "Navigate to favs") {
        const favsTab = document.getElementById('tracker_search_box_favorites_tab');
        if (favsTab.style.display != 'inline') {
            for (const element of favsTab.firstElementChild.children) {
                if (element.innerText == 'Favorites')
                    element.click();
            }
        }
    }
})