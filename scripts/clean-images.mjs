import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

function processImage(jpgPath, outPngPath, tolerance = 38, edgeFeather = 1.8) {
  const jpegData = fs.readFileSync(jpgPath);
  const rawData = jpeg.decode(jpegData, { useTArray: true });
  const { width, height, data } = rawData;

  const png = new PNG({ width, height });

  // Sample corner colors for background reference
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];

  let bgR = 0, bgG = 0, bgB = 0;
  for (const [cx, cy] of corners) {
    const idx = (cy * width + cx) * 4;
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
  }
  bgR /= corners.length;
  bgG /= corners.length;
  bgB /= corners.length;

  console.log(`Processing ${jpgPath}: Detected bg color RGB(${bgR.toFixed(1)}, ${bgG.toFixed(1)}, ${bgB.toFixed(1)})`);

  // Flood fill / BFS from edges to find true background
  const isBg = new Uint8Array(width * height);
  const queue = [];

  // Seed boundary pixels
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
  }

  function colorDist(r1, g1, b1, r2, g2, b2) {
    // Perceptual color distance
    const rmean = (r1 + r2) / 2;
    const r = r1 - r2;
    const g = g1 - g2;
    const b = b1 - b2;
    return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
  }

  // Multi-pass background detection
  const visited = new Uint8Array(width * height);
  for (let i = 0; i < queue.length; i += 2) {
    const qx = queue[i];
    const qy = queue[i + 1];
    const pIdx = qy * width + qx;
    if (!visited[pIdx]) {
      visited[pIdx] = 1;
    }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const pIdx = cy * width + cx;
    const dIdx = pIdx * 4;

    const r = data[dIdx];
    const g = data[dIdx + 1];
    const b = data[dIdx + 2];

    const dist = colorDist(r, g, b, bgR, bgG, bgB);

    // If matches background tone
    if (dist < tolerance * 4.2) {
      isBg[pIdx] = 1;

      // Check neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            const ndIdx = nIdx * 4;
            const nr = data[ndIdx];
            const ng = data[ndIdx + 1];
            const nb = data[ndIdx + 2];
            if (colorDist(nr, ng, nb, bgR, bgG, bgB) < tolerance * 4.2) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }
  }

  // Alpha computation with smooth anti-aliased edge
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dIdx = idx * 4;
      const pIdx = idx * 4;

      const r = data[dIdx];
      const g = data[dIdx + 1];
      const b = data[dIdx + 2];

      const dist = colorDist(r, g, b, bgR, bgG, bgB);

      if (isBg[idx]) {
        // Completely transparent background
        png.data[pIdx] = r;
        png.data[pIdx + 1] = g;
        png.data[pIdx + 2] = b;
        png.data[pIdx + 3] = 0;
      } else {
        // Foreground object
        // Check if on edge for antialiasing
        let bgNeighborCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) bgNeighborCount++;
            }
          }
        }

        let alpha = 255;
        if (bgNeighborCount > 0) {
          const ratio = (9 - bgNeighborCount) / 9;
          alpha = Math.round(255 * Math.min(1, Math.max(0.2, ratio)));
        }

        png.data[pIdx] = r;
        png.data[pIdx + 1] = g;
        png.data[pIdx + 2] = b;
        png.data[pIdx + 3] = alpha;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outPngPath, buffer);
  console.log(`Saved clean transparent PNG to ${outPngPath}`);
}

const assetsDir = path.resolve('src/assets');
const publicAssetsDir = path.resolve('public/assets');

processImage(path.join(assetsDir, 'onboarding-burger.jpg'), path.join(assetsDir, 'onboarding-burger.png'), 35);
processImage(path.join(assetsDir, 'onboarding-burger.jpg'), path.join(publicAssetsDir, 'onboarding-burger.png'), 35);

processImage(path.join(assetsDir, 'onboarding-delivery.jpg'), path.join(assetsDir, 'onboarding-delivery.png'), 35);
processImage(path.join(assetsDir, 'onboarding-delivery.jpg'), path.join(publicAssetsDir, 'onboarding-delivery.png'), 35);

processImage(path.join(assetsDir, 'onboarding-pizza.jpg'), path.join(assetsDir, 'onboarding-pizza.png'), 35);
processImage(path.join(assetsDir, 'onboarding-pizza.jpg'), path.join(publicAssetsDir, 'onboarding-pizza.png'), 35);
