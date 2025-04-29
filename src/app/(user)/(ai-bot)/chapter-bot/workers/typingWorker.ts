// Web Worker for handling typing animation
self.onmessage = (e: MessageEvent) => {
  const { content, typingSpeed } = e.data;
  let currentIndex = 0;

  const typeNextChar = () => {
    if (currentIndex < content.length) {
      // Send the next character
      self.postMessage({
        type: 'UPDATE',
        content: content.charAt(currentIndex),
        index: currentIndex
      });
      currentIndex++;
      setTimeout(typeNextChar, typingSpeed);
    } else {
      self.postMessage({ type: 'COMPLETE' });
    }
  };

  typeNextChar();
};
