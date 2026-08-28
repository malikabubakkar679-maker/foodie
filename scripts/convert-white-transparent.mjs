import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

function whiteToTransparent(jpgPath, outPngPath, whiteThreshold = 248, featherRange = 25) {
  const jpegData = fs.readFileSync(jpgPath);
  const rawData = jpeg.decode(jpegData, { useTArray: true });
  const { width, height, data } = rawData;

  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Minimum channel brightness
      const minChan = Math.min(r, g, b);
      const avgChan = (r + g + b) / 3;

      let alpha = 255;
      if (avgChan >= whiteThreshold && minChan > 230) {
        // Pure background
        alpha = 0;
      } else if (avgChan > whiteThreshold - featherRange && minChan > 210) {
        // Feather zone
        const t = (whiteThreshold - avgChan) / featherRange;
        alpha = Math.round(255 * Math.max(0, Math.min(1, t)));
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = alpha;
    }
  }

  // Flood fill from borders to remove only outer white, preserving inside bright reflections
  const isOuter = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    if (png.data[(0 * width + x) * 4 + 3] === 0) {
      isOuter[0 * width + x] = 1;
      queue.push(x, 0);
    }
    if (png.data[((height - 1) * width + x) * 4 + 3] === 0) {
      isOuter[(height - 1) * width + x] = 1;
      queue.push(x, height - 1);
    }
  }
  for (let y = 0; y < height; y++) {
    if (png.data[(y * width + 0) * 4 + 3] === 0) {
      isOuter[y * width + 0] = 1;
      queue.push(0, y);
    }
    if (png.data[(y * width + (width - 1)) * 4 + 3] === 0) {
      isOuter[y * width + (width - 1)] = 1;
      queue.push(width - 1, y);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isOuter[nIdx] && png.data[nIdx * 4 + 3] < 200) {
          isOuter[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Restore any accidental interior transparency
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!isOuter[idx]) {
        png.data[idx * 4 + 3] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outPngPath, buffer);
  console.log(`Saved transparent PNG -> ${outPngPath}`);
}

const brainDir = 'C:/Users/abuba/.gemini/antigravity-ide/brain/bb9178bb-02b4-4655-bfe8-8df53c586b60';
const assetsDir = path.resolve('src/assets');
const publicAssetsDir = path.resolve('public/assets');

const burgerJpg = path.join(brainDir, 'onboarding_burger_clean_1787938032623.jpg');
const deliveryJpg = path.join(brainDir, 'onboarding_delivery_clean_1787938076517.jpg');
const pizzaJpg = path.join(brainDir, 'onboarding_pizza_clean_1787938183404.jpg');

whiteToTransparent(burgerJpg, path.join(assetsDir, 'onboarding-burger.png'), 248, 20);
whiteToTransparent(burgerJpg, path.join(publicAssetsDir, 'onboarding-burger.png'), 248, 20);

whiteToTransparent(deliveryJpg, path.join(assetsDir, 'onboarding-delivery.png'), 248, 20);
whiteToTransparent(deliveryJpg, path.join(publicAssetsDir, 'onboarding-delivery.png'), 248, 20);

whiteToTransparent(pizzaJpg, path.join(assetsDir, 'onboarding-pizza.png'), 248, 20);
whiteToTransparent(pizzaJpg, path.join(publicAssetsDir, 'onboarding-pizza.png'), 248, 20);
whiteToTransparent(pizzaJpg, path.join(publicAssetsDir, 'hero-pizza.png'), 248, 20);
