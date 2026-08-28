const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const uploadDir = 'C:/Users/abuba/.gemini/antigravity-ide/brain/f6aecfca-50c0-43b0-856f-71a2534cea4f/.user_uploaded';
const assetsDir = path.resolve('src/assets');
const publicDir = path.resolve('public/assets');

// 1. Process Pizza: Cutout the circular pizza perfectly and make transparent background
function processPizza() {
  const pizzaJpg = path.join(uploadDir, 'media_1787941727101.jpg');
  const raw = jpeg.decode(fs.readFileSync(pizzaJpg), { useTArray: true });
  const { width, height, data } = raw;

  const cx = 512.5;
  const cy = 288.5;
  const radius = 254; // Exact Radius of the circular pizza

  const outSize = 512;
  const png = new PNG({ width: outSize, height: outSize });

  for (let outY = 0; outY < outSize; outY++) {
    for (let outX = 0; outX < outSize; outX++) {
      const inX = Math.round(cx - radius + (outX / outSize) * (2 * radius));
      const inY = Math.round(cy - radius + (outY / outSize) * (2 * radius));

      const outIdx = (outY * outSize + outX) * 4;

      if (inX >= 0 && inX < width && inY >= 0 && inY < height) {
        const inIdx = (inY * width + inX) * 4;
        const r = data[inIdx];
        const g = data[inIdx + 1];
        const b = data[inIdx + 2];

        const dx = outX - outSize / 2;
        const dy = outY - outSize / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxR = outSize / 2 - 2;

        let alpha = 255;
        if (dist > maxR) {
          alpha = 0;
        } else if (dist > maxR - 2.5) {
          alpha = Math.round(255 * (maxR - dist) / 2.5);
        }

        // Checkerboard elimination
        if (r < 45 && g < 45 && b < 45 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && dist > maxR - 18) {
          alpha = 0;
        }

        png.data[outIdx] = r;
        png.data[outIdx + 1] = g;
        png.data[outIdx + 2] = b;
        png.data[outIdx + 3] = alpha;
      } else {
        png.data[outIdx + 3] = 0;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(assetsDir, 'onboarding-pizza.png'), buffer);
  fs.writeFileSync(path.join(publicDir, 'onboarding-pizza.png'), buffer);
  fs.writeFileSync(path.join(publicDir, 'hero-pizza.png'), buffer);
  console.log(`✅ Processed Pizza (${outSize}x${outSize}) -> transparent PNG saved!`);
}

// 2. Process Burger & Delivery with 100% Zero-Edge Vignette / Alpha Fade
function processSmoothAsset(inputFilename, outPngName) {
  const inputJpg = path.join(uploadDir, inputFilename);
  const raw = jpeg.decode(fs.readFileSync(inputJpg), { useTArray: true });
  const { width, height, data } = raw;

  const png = new PNG({ width, height });

  const corners = [
    [0, 0], [width - 1, 0],
    [0, height - 1], [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
    [Math.floor(width / 2), height - 1]
  ];

  let avgR = 0, avgG = 0, avgB = 0;
  for (const [x, y] of corners) {
    const idx = (y * width + x) * 4;
    avgR += data[idx];
    avgG += data[idx + 1];
    avgB += data[idx + 2];
  }
  avgR /= corners.length;
  avgG /= corners.length;
  avgB /= corners.length;

  const marginX = 80;
  const marginY = 60;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const dr = r - avgR;
      const dg = g - avgG;
      const db = b - avgB;
      const dist = Math.sqrt(dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11);

      // Edge distances normalized 0..1
      const dX = Math.min(x, width - 1 - x);
      const dY = Math.min(y, height - 1 - y);

      let edgeFactor = 1;
      if (dX < marginX) edgeFactor *= (dX / marginX);
      if (dY < marginY) edgeFactor *= (dY / marginY);
      edgeFactor = Math.max(0, Math.min(1, edgeFactor));

      let alpha = 255;
      if (dist < 18) {
        alpha = Math.round(255 * (dist / 18) * edgeFactor);
      } else if (dist < 32) {
        const t = (dist - 18) / 14;
        alpha = Math.round(255 * (0.3 + 0.7 * t) * edgeFactor);
      } else {
        alpha = Math.round(255 * edgeFactor);
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = alpha;
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(assetsDir, outPngName), buffer);
  fs.writeFileSync(path.join(publicDir, outPngName), buffer);
  console.log(`✅ Saved ${outPngName} (${width}x${height}) with zero edge borders!`);
}

processPizza();
processSmoothAsset('media_1787941727197.jpg', 'onboarding-burger.png');
processSmoothAsset('media_1787941727243.jpg', 'onboarding-delivery.png');
