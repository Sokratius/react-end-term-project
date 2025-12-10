
self.onmessage = async (e: MessageEvent) => {
  const { file } = e.data;
  
  if (!file) return;

  try {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(300, 300);
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No context');


    const scale = Math.min(300 / bitmap.width, 300 / bitmap.height);
    const width = bitmap.width * scale;
    const height = bitmap.height * scale;
    const x = (300 - width) / 2;
    const y = (300 - height) / 2;

    ctx.drawImage(bitmap, x, y, width, height);

    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: 0.7
    });

    self.postMessage({ blob, success: true });
  } catch (error) {
    self.postMessage({ success: false, error });
  }
};