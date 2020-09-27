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

// https://stackoverflow.com/questions/15798516/is-there-an-event-for-when-a-chrome-extension-popup-is-closed
// https://stackoverflow.com/questions/25072940/event-when-chrome-popup-is-closed

/* Load previous textarea content (if any) when user opens popup */
chrome.runtime.onConnect.addListener((port) => {
    console.log('Extension connected!');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { msg: "Navigate to favs" });
    });
    chrome.storage.local.get(['textareaContent'], (result) => {
        console.log(result.textareaContent)
        if (result.textareaContent) {
            chrome.runtime.sendMessage({ msg: "Load textarea content", data: result.textareaContent });
        }
    });

    // https://stackoverflow.com/questions/39730493/chrome-extension-detect-when-popup-window-closes
    port.onDisconnect.addListener(() => {
        // console.log('Extension disconnected!');
    })
});


