// mind.exe — browser media helpers.
// Pure client-side image processing; no profile persistence or Firestore writes.

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("image encode failed"));
    reader.readAsDataURL(blob);
  });
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image encode failed")), "image/jpeg", quality);
  });
}

async function decodeImage(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw(ctx, w, h) { ctx.drawImage(bitmap, 0, 0, w, h); },
        close() { try { bitmap.close(); } catch {} }
      };
    } catch {
      // Safari/iOS versions differ in supported createImageBitmap options; use the stable fallback.
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        draw(ctx, w, h) { ctx.drawImage(img, 0, 0, w, h); },
        close() {}
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image decode failed"));
    };
    img.src = url;
  });
}

export async function compressImageFile(file, maxDim = 1280, quality = 0.72) {
  if (!(file instanceof Blob) || file.size === 0) throw new Error("image file empty");
  const decoded = await decodeImage(file);
  try {
    const scale = Math.min(1, maxDim / Math.max(decoded.width, decoded.height));
    const w = Math.max(1, Math.round(decoded.width * scale));
    const h = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("image canvas unavailable");
    decoded.draw(ctx, w, h);
    // toBlob is asynchronous, unlike toDataURL, so encoding a large screenshot does not block
    // the UI thread for one long synchronous string conversion.
    const blob = await canvasToJpegBlob(canvas, quality);
    return await blobToDataUrl(blob);
  } finally {
    decoded.close();
  }
}
