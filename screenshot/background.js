chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'capture-entire') {
    console.log('Received capture-entire message in background.js');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        console.log('Injecting capture.js into tab:', tabs[0].id);
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['capture.js']
        }, () => {
          console.log('capture.js injected, sending message to capture entire page');
          chrome.tabs.sendMessage(tabs[0].id, { message: 'capture-entire' });
        });
      } else {
        console.error('Error: No active tab found');
      }
    });
  } else if (request.message === 'capture-visible-part') {
    console.log('Received capture-visible-part message');
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (image) => {
      console.log('Captured visible part');
      sendResponse({ image });
    });
    return true; // sendResponseを非同期で使用するためにtrueを返す
  } else if (request.message === 'download-image') {
    console.log('Received download-image message');
    chrome.downloads.download({
      url: request.image,
      filename: 'entire_page_screenshot.png'
    });
  }
});
