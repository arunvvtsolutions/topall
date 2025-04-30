// Cross-tab typing animation worker
const TYPING_INTERVAL = 5; // 5ms between characters - very fast typing speed

self.onmessage = (e: MessageEvent) => {
  const { text, messageId } = e.data;
  let index = 0;

  const type = () => {
    if (index < text.length) {
      self.postMessage({
        type: 'UPDATE',
        messageId,
        char: text[index],
        index
      });
      index++;
      setTimeout(type, TYPING_INTERVAL);
    } else {
      self.postMessage({
        type: 'COMPLETE',
        messageId
      });
    }
  };

  type();
};
