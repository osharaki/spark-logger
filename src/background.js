// Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        console.log('removed rules');
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { urlMatches: '.*sparkpeople.com/myspark/nutrition.asp' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }], () => console.log('added rules'));
    });
});

// Receiving a message from popup.js (content script) when 'log entries' button is clicked
// This message needs to be forwarded to crawler.js (content script)
// A background script has to act as a middle man since content scripts can't communicate directly
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg == "Log Entries") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // console.log(tabs);
            // console.log(`sending message to ${tabs[0].title}`);
            chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
                if (response) {
                    if (response.data) {
                        sendResponse({ sender: "background.js", data: response.data });
                    }
                }
            });
        });
    }
    return true; // Required to keep message port open
});

// TODO: remove console logs
// TODO: navigate automatically to Favourites