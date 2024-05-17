async function captureEntirePage() {
  const body = document.body;
  const html = document.documentElement;

  const height = Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  );

  const viewportHeight = window.innerHeight;
  let currentPosition = 0;
  const images = [];
  const delay = 1000; // 1000ms の待機時間を設定

  while (currentPosition < height) {
    window.scrollTo(0, currentPosition);
    await new Promise(resolve => setTimeout(resolve, delay)); // 待機時間を増やす
    const image = await captureVisiblePart();
    images.push(image);
    currentPosition += viewportHeight;
  }

  const finalImage = await combineImages(images);
  chrome.runtime.sendMessage({ message: 'download-image', image: finalImage });
}

function captureVisiblePart() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: 'capture-visible-part' }, response => {
      if (response.image) {
        resolve(response.image);
      } else {
        reject('Failed to capture visible part');
      }
    });
  });
}

function combineImages(images) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const imgElements = images.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(imgElements.map(img => new Promise(resolve => {
      img.onload = resolve;
    }))).then(() => {
      const totalHeight = imgElements.reduce((sum, img) => sum + img.height, 0);
      canvas.width = imgElements[0].width;
      canvas.height = totalHeight;

      let y = 0;
      for (const img of imgElements) {
        context.drawImage(img, 0, y);
        y += img.height;
      }

      resolve(canvas.toDataURL('image/png'));
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'capture-entire') {
    captureEntirePage();
  }
});
