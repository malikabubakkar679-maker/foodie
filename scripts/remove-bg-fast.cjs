const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

function colorDist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
}

function processAsset(inputJpgPath, outputPngPaths, { maxTolerance = 42, whiteMin = 225 } = {}) {
  console.log(`Processing: ${inputJpgPath}`);
  const jpegData = fs.readFileSync(inputJpgPath);
  const raw = jpeg.decode(jpegData, { useTArray: true });
  const { width, height, data } = raw;

  const png = new PNG({ width, height });

  // Sample 8 outer background references
  const samples = [
    [0, 0], [width - 1, 0],
    [0, height - 1], [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
    [Math.floor(width / 2), height - 1],
  ];

  const bgColors = [];
  for (const [x, y] of samples) {
    const idx = (y * width + x) * 4;
    bgColors.push([data[idx], data[idx + 1], data[idx + 2]]);
  }

  const isBg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  function isBackgroundMatch(r, g, b) {
    if (r >= whiteMin && g >= whiteMin && b >= whiteMin) return true;
    for (let i = 0; i < bgColors.length; i++) {
      if (colorDist(r, g, b, bgColors[i][0], bgColors[i][1], bgColors[i][2]) < maxTolerance) {
        return true;
      }
    }
    return false;
  }

  // Seed boundary
  for (let x = 0; x < width; x++) {
    const top = x;
    const btm = (height - 1) * width + x;
    if (isBackgroundMatch(data[top * 4], data[top * 4 + 1], data[top * 4 + 2])) {
      isBg[top] = 1; queue[tail++] = top;
    }
    if (isBackgroundMatch(data[btm * 4], data[btm * 4 + 1], data[btm * 4 + 2])) {
      isBg[btm] = 1; queue[tail++] = btm;
    }
  }
  for (let y = 0; y < height; y++) {
    const left = y * width;
    const right = y * width + (width - 1);
    if (!isBg[left] && isBackgroundMatch(data[left * 4], data[left * 4 + 1], data[left * 4 + 2])) {
      isBg[left] = 1; queue[tail++] = left;
    }
    if (!isBg[right] && isBackgroundMatch(data[right * 4], data[right * 4 + 1], data[right * 4 + 2])) {
      isBg[right] = 1; queue[tail++] = right;
    }
  }

  // BFS
  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (const nIdx of neighbors) {
      if (nIdx !== -1 && isBg[nIdx] === 0) {
        const dIdx = nIdx * 4;
        if (isBackgroundMatch(data[dIdx], data[dIdx + 1], data[dIdx + 2])) {
          isBg[nIdx] = 1;
          queue[tail++] = nIdx;
        }
      }
    }
  }

  // Write PNG with antialiased edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;

      png.data[pIdx] = data[pIdx];
      png.data[pIdx + 1] = data[pIdx + 1];
      png.data[pIdx + 2] = data[pIdx + 2];

      if (isBg[idx] === 1) {
        png.data[pIdx + 3] = 0;
      } else {
        let bgCount = 0;
        if (x > 0 && isBg[idx - 1]) bgCount++;
        if (x < width - 1 && isBg[idx + 1]) bgCount++;
        if (y > 0 && isBg[idx - width]) bgCount++;
        if (y < height - 1 && isBg[idx + width]) bgCount++;

        png.data[pIdx + 3] = bgCount > 0 ? Math.round(255 * (1 - bgCount * 0.22)) : 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  for (const p of outputPngPaths) {
    fs.writeFileSync(p, buffer);
    console.log(`Saved: ${p} (${buffer.length} bytes)`);
  }
}

const assetsDir = path.join(__dirname, '../src/assets');
const publicDir = path.join(__dirname, '../public/assets');

processAsset(
  path.join(assetsDir, 'onboarding-pizza.jpg'),
  [
    path.join(assetsDir, 'onboarding-pizza.png'),
    path.join(publicDir, 'onboarding-pizza.png'),
    path.join(publicDir, 'hero-pizza.png'),
  ],
  { maxTolerance: 45, whiteMin: 228 }
);

processAsset(
  path.join(assetsDir, 'onboarding-burger.jpg'),
  [
    path.join(assetsDir, 'onboarding-burger.png'),
    path.join(publicDir, 'onboarding-burger.png'),
  ],
  { maxTolerance: 40, whiteMin: 225 }
);

processAsset(
  path.join(assetsDir, 'onboarding-delivery.jpg'),
  [
    path.join(assetsDir, 'onboarding-delivery.png'),
    path.join(publicDir, 'onboarding-delivery.png'),
  ],
  { maxTolerance: 40, whiteMin: 225 }
);

console.log('✅ Background removal complete for all assets!');
