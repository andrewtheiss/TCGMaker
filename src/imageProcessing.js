// Image processing helpers for client-side editing (crop / fit / rotate / flip)
// Outputs a baked PNG dataURL suitable for direct <img src="..."> usage.

const DEFAULT_TARGET = { width: 1500, height: 2100 };

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    // Needed for remote images; harmless for object URLs.
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

function drawContain(ctx, srcWidth, srcHeight, destWidth, destHeight) {
  const scale = Math.min(destWidth / srcWidth, destHeight / srcHeight);
  const drawWidth = srcWidth * scale;
  const drawHeight = srcHeight * scale;
  const dx = (destWidth - drawWidth) / 2;
  const dy = (destHeight - drawHeight) / 2;
  return { dx, dy, drawWidth, drawHeight };
}

function drawCover(ctx, srcWidth, srcHeight, destWidth, destHeight) {
  const scale = Math.max(destWidth / srcWidth, destHeight / srcHeight);
  const drawWidth = srcWidth * scale;
  const drawHeight = srcHeight * scale;
  const dx = (destWidth - drawWidth) / 2;
  const dy = (destHeight - drawHeight) / 2;
  return { dx, dy, drawWidth, drawHeight };
}

async function getTransformedSourceCanvas(imageSrc, rotation = 0, flip = { x: false, y: false }) {
  const image = await createImage(imageSrc);
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bBoxWidth);
  canvas.height = Math.round(bBoxHeight);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.x ? -1 : 1, flip.y ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  return canvas;
}

function cropCanvas(sourceCanvas, pixelCrop) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.drawImage(
    sourceCanvas,
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height),
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas;
}

/**
 * Bake an edited image into a PNG dataURL.
 *
 * Modes:
 * - crop: uses pixelCrop (from react-easy-crop onCropComplete) and then fits into target
 * - shrink_to_fit: ignores pixelCrop; contains whole transformed image into target (preserves aspect)
 */
export async function bakeEditedImageToPngDataUrl({
  imageSrc,
  mode = 'crop', // 'crop' | 'shrink_to_fit'
  pixelCrop = null,
  rotation = 0,
  flipX = false,
  flipY = false,
  targetWidth = DEFAULT_TARGET.width,
  targetHeight = DEFAULT_TARGET.height,
  fit = 'cover', // 'cover' | 'contain' (applies after crop)
} = {}) {
  if (!imageSrc) throw new Error('imageSrc is required');
  if (mode === 'crop' && !pixelCrop) throw new Error('pixelCrop is required for crop mode');

  const sourceCanvas = await getTransformedSourceCanvas(imageSrc, rotation, { x: flipX, y: flipY });

  let workingCanvas = sourceCanvas;
  let workingWidth = sourceCanvas.width;
  let workingHeight = sourceCanvas.height;

  if (mode === 'crop') {
    workingCanvas = cropCanvas(sourceCanvas, pixelCrop);
    workingWidth = workingCanvas.width;
    workingHeight = workingCanvas.height;
  }

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = targetWidth;
  outputCanvas.height = targetHeight;
  const outCtx = outputCanvas.getContext('2d');
  if (!outCtx) throw new Error('Canvas 2D context not available');

  outCtx.clearRect(0, 0, targetWidth, targetHeight);

  const placement =
    mode === 'shrink_to_fit'
      ? drawContain(outCtx, workingWidth, workingHeight, targetWidth, targetHeight)
      : fit === 'contain'
        ? drawContain(outCtx, workingWidth, workingHeight, targetWidth, targetHeight)
        : drawCover(outCtx, workingWidth, workingHeight, targetWidth, targetHeight);

  outCtx.drawImage(
    workingCanvas,
    0,
    0,
    workingWidth,
    workingHeight,
    placement.dx,
    placement.dy,
    placement.drawWidth,
    placement.drawHeight
  );

  return outputCanvas.toDataURL('image/png');
}


