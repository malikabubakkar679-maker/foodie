const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function processImage(inputPath, outputPath, tolerance = 42, feather = 20) {
  console.log(`Processing: ${inputPath} -> ${outputPath}`);
  const jpegData = fs.readFileSync(inputPath);
  const rawImage = jpeg.decode(jpegData, { useTArray: true });
  const { width, height, data } = rawImage;

  const png = new PNG({ width, height });

  // Sample corner background colors (top-left, top-right, bottom-left, bottom-right, middle edges)
  const samplePoints = [
    [4, 4],
    [width - 5, 4],
    [4, height - 5],
    [width - 5, height - 5],
    [Math.floor(width / 2), 4],
    [Math.floor(width / 2), height - 5],
    [4, Math.floor(height / 2)],
    [width - 5, Math.floor(height / 2)],
  ];

  const bgColors = samplePoints.map(([x, y]) => {
    const idx = (y * width + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      let minDistance = 999999;
      for (const [bgR, bgG, bgB] of bgColors) {
        const d = colorDistance(r, g, b, bgR, bgG, bgB);
        if (d < minDistance) minDistance = d;
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;

      if (minDistance < tolerance) {
        // Transparent background
        png.data[idx + 3] = 0;
      } else if (minDistance < tolerance + feather) {
        // Feathered edge for smooth transition
        const alphaFraction = (minDistance - tolerance) / feather;
        png.data[idx + 3] = Math.round(alphaFraction * 255);
      } else {
        // Fully opaque foreground
        png.data[idx + 3] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved transparent PNG: ${outputPath} (${buffer.length} bytes)`);
}

const assetsDir = path.join(__dirname, '../src/assets');
const publicDir = path.join(__dirname, '../public/assets');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Process Pizza
processImage(
  path.join(assetsDir, 'onboarding-pizza.jpg'),
  path.join(assetsDir, 'onboarding-pizza.png'),
  38,
  18
);
fs.copyFileSync(path.join(assetsDir, 'onboarding-pizza.png'), path.join(publicDir, 'onboarding-pizza.png'));

// Process Burger
processImage(
  path.join(assetsDir, 'onboarding-burger.jpg'),
  path.join(assetsDir, 'onboarding-burger.png'),
  32,
  16
);
fs.copyFileSync(path.join(assetsDir, 'onboarding-burger.png'), path.join(publicDir, 'onboarding-burger.png'));

// Process Delivery Scooter
processImage(
  path.join(assetsDir, 'onboarding-delivery.jpg'),
  path.join(assetsDir, 'onboarding-delivery.png'),
  35,
  18
);
fs.copyFileSync(path.join(assetsDir, 'onboarding-delivery.png'), path.join(publicDir, 'onboarding-delivery.png'));

console.log('✅ All 3 onboarding images successfully converted to transparent PNGs!');
