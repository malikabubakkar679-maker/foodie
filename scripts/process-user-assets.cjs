const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function processScooterPureColor(inputPath, outputPath) {
  console.log(`Processing Scooter Pure Color: ${inputPath} -> ${outputPath}`);
  const rawImage = jpeg.decode(fs.readFileSync(inputPath), { useTArray: true });
  const { width, height, data } = rawImage;
  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const [h, s, l] = rgbToHsl(r, g, b);

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;

      const diffRG = r - g;
      const diffGB = g - b;

      // Studio Yellow Background condition:
      // Background has Hue in 39..52, Lightness >= 50, diffRG <= 46, diffGB >= 28
      // While the metallic box has diffGB < 22, the orange body has diffRG >= 55, the seat has diffRG >= 65!
      const isYellowBg = (h >= 38 && h <= 54 && l >= 50 && diffRG <= 46 && diffGB >= 28);
      const isFloorShadow = (l >= 40 && l < 50 && diffRG <= 48 && diffGB >= 20 && (y > 380 || x < 280 || x > 690));

      if (isYellowBg || isFloorShadow) {
        png.data[idx + 3] = 0;
      } else {
        png.data[idx + 3] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved Pure Scooter: ${outputPath}`);
}

const assetsDir = path.join(__dirname, '../src/assets');
const publicDir = path.join(__dirname, '../public/assets');

processScooterPureColor(path.join(assetsDir, 'onboarding-delivery.jpg'), path.join(assetsDir, 'onboarding-delivery.png'));
fs.copyFileSync(path.join(assetsDir, 'onboarding-delivery.png'), path.join(publicDir, 'onboarding-delivery.png'));

console.log('✅ Pure Scooter extraction complete!');
