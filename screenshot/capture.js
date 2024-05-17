if (!window.html2canvas) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('libs/html2canvas.min.js');
  script.onload = initializeCapture;
  document.head.appendChild(script);
} else {
  initializeCapture();
}

function captureEntirePage() {
  const html = document.documentElement;
  const width = html.offsetWidth;
  const height = html.offsetHeight;

  html2canvas(document.body, { width: width, height: height }).then((canvas) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'screenshot.png';
    link.click();
  });
}

function captureVisiblePart(image) {
  const link = document.createElement('a');
  link.href = image;
  link.download = 'screenshot.png';
  link.click();
}

function initializeCapture() {
  chrome.runtime.onMessage.addListener((request) => {
    if (request.message === 'capture-entire') {
      captureEntirePage();
    } else if (request.message === 'capture-visible') {
      captureVisiblePart(request.image);
    }
  });
}
