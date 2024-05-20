chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'capture-entire') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['capture.js']
        }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { message: 'capture-entire' });
        });
      } else {
        console.error('Error: No active tab found');
      }
    });
  } else if (request.message === 'capture-visible-part') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (image) => {
      sendResponse({ image });
    });
    return true;
  } else if (request.message === 'download-image') {
    chrome.downloads.download({
      url: request.image,
      filename: 'entire_page_screenshot.png'
    });
  }
});
