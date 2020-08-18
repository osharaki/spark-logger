// Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        console.log('removed rules');
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { urlMatches: '.*' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }], () => console.log('added rules'));
    });
});

// TODO: remove console logs
// TODO: navigate automatically to Favourites