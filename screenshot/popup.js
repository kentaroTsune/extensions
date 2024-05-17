document.getElementById('capture-entire').addEventListener('click', () => {
  chrome.runtime.sendMessage({ message: 'capture-entire' });
});

document.getElementById('capture-visible').addEventListener('click', () => {
  chrome.runtime.sendMessage({ message: 'capture-visible' });
});
