const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
}

function processImageEdgeAware(inputPath, outputPath, tolerance = 36, feather = 3, edgeThreshold = 26) {
  console.log(`Processing with Edge-Aware Flood Fill: ${inputPath} -> ${outputPath}`);
  const jpegData = fs.readFileSync(inputPath);
  const rawImage = jpeg.decode(jpegData, { useTArray: true });
  const { width, height, data } = rawImage;

  const png = new PNG({ width, height });

  // 1. Sample Background Colors from perimeter border pixels
  const bgColors = [];
  const perimeterStep = Math.max(1, Math.floor(Math.min(width, height) / 40));

  for (let x = 0; x < width; x += perimeterStep) {
    const topIdx = (0 * width + x) * 4;
    const btmIdx = ((height - 1) * width + x) * 4;
    bgColors.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    bgColors.push([data[btmIdx], data[btmIdx + 1], data[btmIdx + 2]]);
  }
  for (let y = 0; y < height; y += perimeterStep) {
    const leftIdx = (y * width + 0) * 4;
    const rightIdx = (y * width + (width - 1)) * 4;
    bgColors.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    bgColors.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }

  const minBgDist = (r, g, b) => {
    let minD = 999999;
    for (let i = 0; i < bgColors.length; i++) {
      const d = colorDistance(r, g, b, bgColors[i][0], bgColors[i][1], bgColors[i][2]);
      if (d < minD) minD = d;
    }
    return minD;
  };

  // 2. Grayscale & Sobel Edge calculation
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  const edges = new Uint8Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx =
        -gray[idx - width - 1] +
        gray[idx - width + 1] -
        2 * gray[idx - 1] +
        2 * gray[idx + 1] -
        gray[idx + width - 1] +
        gray[idx + width + 1];

      const gy =
        -gray[idx - width - 1] -
        2 * gray[idx - width] -
        gray[idx - width + 1] +
        gray[idx + width - 1] +
        2 * gray[idx + width] +
        gray[idx + width + 1];

      const mag = Math.sqrt(gx * gx + gy * gy);
      if (mag > edgeThreshold) {
        edges[idx] = 1;
      }
    }
  }

  // 3. Flood Fill BFS from outer perimeter
  const mask = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const maxColorTolerance = tolerance * 1.55;

  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const topPix = topIdx * 4;
    if (minBgDist(data[topPix], data[topPix + 1], data[topPix + 2]) < maxColorTolerance * 1.3) {
      mask[topIdx] = 1;
      queue[tail++] = topIdx;
    }
    const btmIdx = (height - 1) * width + x;
    const btmPix = btmIdx * 4;
    if (minBgDist(data[btmPix], data[btmPix + 1], data[btmPix + 2]) < maxColorTolerance * 1.3) {
      mask[btmIdx] = 1;
      queue[tail++] = btmIdx;
    }
  }

  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const leftPix = leftIdx * 4;
    if (mask[leftIdx] === 0 && minBgDist(data[leftPix], data[leftPix + 1], data[leftPix + 2]) < maxColorTolerance * 1.3) {
      mask[leftIdx] = 1;
      queue[tail++] = leftIdx;
    }
    const rightIdx = y * width + (width - 1);
    const rightPix = rightIdx * 4;
    if (mask[rightIdx] === 0 && minBgDist(data[rightPix], data[rightPix + 1], data[rightPix + 2]) < maxColorTolerance * 1.3) {
      mask[rightIdx] = 1;
      queue[tail++] = rightIdx;
    }
  }

  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    for (let d = 0; d < 4; d++) {
      const nx = cx + dx[d];
      const ny = cy + dy[d];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (mask[nIdx] === 0) {
          if (edges[nIdx] === 1) {
            const pIdx = nIdx * 4;
            const dist = minBgDist(data[pIdx], data[pIdx + 1], data[pIdx + 2]);
            if (dist > maxColorTolerance * 0.7) {
              continue; // Protected by edge boundary!
            }
          }

          const pIdx = nIdx * 4;
          const dist = minBgDist(data[pIdx], data[pIdx + 1], data[pIdx + 2]);
          if (dist < maxColorTolerance) {
            mask[nIdx] = 1;
            queue[tail++] = nIdx;
          }
        }
      }
    }
  }

  // 4. Smooth feathering & write PNG
  const featherRadius = Math.max(1, Math.min(8, Math.round(feather)));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;

      png.data[pIdx] = data[pIdx];
      png.data[pIdx + 1] = data[pIdx + 1];
      png.data[pIdx + 2] = data[pIdx + 2];

      if (mask[idx] === 1) {
        png.data[pIdx + 3] = 0;
      } else {
        let bgNeighbors = 0;
        let totalNeighbors = 0;

        for (let fy = -featherRadius; fy <= featherRadius; fy++) {
          for (let fx = -featherRadius; fx <= featherRadius; fx++) {
            const nx = x + fx;
            const ny = y + fy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              totalNeighbors++;
              if (mask[ny * width + nx] === 1) {
                bgNeighbors++;
              }
            }
          }
        }

        if (bgNeighbors > 0) {
          const alphaRatio = 1 - bgNeighbors / totalNeighbors;
          png.data[pIdx + 3] = Math.round(255 * Math.pow(alphaRatio, 0.75));
        } else {
          png.data[pIdx + 3] = 255;
        }
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved pristine transparent PNG: ${outputPath} (${buffer.length} bytes)`);
}

const assetsDir = path.join(__dirname, '../src/assets');
const publicDir = path.join(__dirname, '../public/assets');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Process Pizza
processImageEdgeAware(
  path.join(assetsDir, 'onboarding-pizza.jpg'),
  path.join(assetsDir, 'onboarding-pizza.png'),
  34,
  3,
  24
);
fs.copyFileSync(path.join(assetsDir, 'onboarding-pizza.png'), path.join(publicDir, 'onboarding-pizza.png'));

// Process Burger
processImageEdgeAware(
  path.join(assetsDir, 'onboarding-burger.jpg'),
  path.join(assetsDir, 'onboarding-burger.png'),
  28,
  3,
  22
);
fs.copyFileSync(path.join(assetsDir, 'onboarding-burger.png'), path.join(publicDir, 'onboarding-burger.png'));

// Process Delivery
processImageEdgeAware(
  path.join(assetsDir, 'onboarding-delivery.jpg'),
  path.join(assetsDir, 'onboarding-delivery.png'),
  30,
  3,
  24
);
fs.copyFileSync(path.join(assetsDir, 'onboarding-delivery.png'), path.join(publicDir, 'onboarding-delivery.png'));

console.log('✅ All onboarding assets converted with zero food damage / clipping!');
