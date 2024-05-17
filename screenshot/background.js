chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'capture-entire') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['capture.js']
      }, () => {
        if (!chrome.runtime.lastError) {
          chrome.tabs.sendMessage(tabs[0].id, { message: request.message });
        } else {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  } else if (request.message === 'capture-visible') {
    chrome.tabs.captureVisibleTab(null, {}, (image) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['capture.js']
        }, () => {
          if (!chrome.runtime.lastError) {
            chrome.tabs.sendMessage(tabs[0].id, { message: request.message, image });
          } else {
            console.error(chrome.runtime.lastError);
          }
        });
      });
    });
  }
  return true;
});
