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

function dimensionsFor(decoded, maxDim) {
  const scale = Math.min(1, maxDim / Math.max(decoded.width, decoded.height));
  return {
    width: Math.max(1, Math.round(decoded.width * scale)),
    height: Math.max(1, Math.round(decoded.height * scale))
  };
}

async function encodeAt(decoded, maxDim, quality) {
  const { width, height } = dimensionsFor(decoded, maxDim);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("image canvas unavailable");
  // High quality scaling is especially important for small chart labels/candle edges.
  try { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; } catch (_) {}
  decoded.draw(ctx, width, height);
  const blob = await canvasToJpegBlob(canvas, quality);
  return { blob, dataUrl: await blobToDataUrl(blob), width, height };
}

export async function compressImageFile(file, maxDim = 1280, quality = 0.72, maxDataUrlChars = 240000) {
  if (!(file instanceof Blob) || file.size === 0) throw new Error("image file empty");
  const decoded = await decodeImage(file);
  try {
    const initialDim = Math.max(960, Number(maxDim) || 1280);
    const initialQuality = Math.max(0.58, Math.min(0.94, Number(quality) || 0.72));
    const limit = Math.max(120000, Number(maxDataUrlChars) || 240000);

    // Start at the requested quality. If it is too large, estimate a smaller dimension from the
    // encoded-size ratio instead of repeatedly JPEG-encoding the same huge canvas dozens of times.
    let encoded = await encodeAt(decoded, initialDim, initialQuality);
    if (encoded.dataUrl.length <= limit) return encoded.dataUrl;

    let dim = Math.max(960, Math.min(initialDim - 1, Math.floor(initialDim * Math.sqrt(limit / encoded.dataUrl.length) * 0.95)));
    const qualities = [...new Set([
      initialQuality,
      Math.max(0.62, Number((initialQuality - 0.08).toFixed(2))),
      Math.max(0.58, Number((initialQuality - 0.16).toFixed(2)))
    ])].sort((a, b) => b - a);
    let smallest = encoded;

    for (let pass = 0; pass < 3; pass += 1) {
      for (const q of qualities) {
        encoded = await encodeAt(decoded, dim, q);
        if (encoded.dataUrl.length < smallest.dataUrl.length) smallest = encoded;
        if (encoded.dataUrl.length <= limit) return encoded.dataUrl;
      }
      if (dim <= 960) break;
      dim = Math.max(960, Math.floor(dim * 0.82));
    }
    return smallest.dataUrl;
  } finally {
    decoded.close();
  }
}

// Journal screenshots live in one Firestore document per image, so they can safely keep far more
// chart detail than Strategy Lab screenshots, which are still embedded together in a trade record.
export function compressJournalImageFile(file) {
  return compressImageFile(file, 2560, 0.9, 850000);
}

// Decision Lab stores one chart screenshot in a dedicated Firestore document, so it can keep
// chart labels readable without using the larger Journal target.
export function compressDecisionImageFile(file) {
  return compressImageFile(file, 2200, 0.9, 780000);
}
