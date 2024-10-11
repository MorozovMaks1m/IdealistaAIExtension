// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkIdealista") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.url.includes("idealista.com") && activeTab.url.includes("inmueble")) {
                sendResponse({ isIdealista: true });
            } else {
                sendResponse({ isIdealista: false });
            }
        });
        return true; // Indicates that sendResponse will be called asynchronously
    }
});