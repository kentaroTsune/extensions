const keysPressed = {};

const handleKeyDown = function(event) {
  keysPressed[event.key] = true;
  if (isCopyShortcutPressed()) {
    copySelectedTextAsMarkdown();
  }
};

const handleKeyUp = function(event) {
  delete keysPressed[event.key];
};

const isCopyShortcutPressed = function() {
  return (keysPressed['Meta'] || keysPressed['Control']) && keysPressed['Shift'] && keysPressed['x'];
};

const getSelectedTextAndUrl = function() {
  const selectedText = window.getSelection().toString();
  const url = window.location.href;
  return { selectedText, url };
};

const copyAsMarkdown = function({ selectedText, url }) {
  const markdownLink = `${selectedText}\n${url}`;
  navigator.clipboard.writeText(markdownLink);
};

const copySelectedTextAsMarkdown = function() {
  const selection = getSelectedTextAndUrl();
  copyAsMarkdown(selection);
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
