// Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color: '#3aa757' },
        () => console.log("The color is green"));
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        console.log('removed rules');
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostContains: 'sparkpeople.com' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }], () => console.log('added rules'));
    });
});
// TODO: remove console logs