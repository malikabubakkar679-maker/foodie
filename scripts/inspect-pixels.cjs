const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

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
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

const assetsDir = path.join(__dirname, '../src/assets');
const burgerData = jpeg.decode(fs.readFileSync(path.join(assetsDir, 'onboarding-burger.jpg')));
const scooterData = jpeg.decode(fs.readFileSync(path.join(assetsDir, 'onboarding-delivery.jpg')));

console.log('--- BURGER SAMPLES ---');
[[10, 10], [100, 100], [500, 30], [200, 450], [512, 180], [512, 280], [512, 400]].forEach(([x, y]) => {
  const idx = (y * burgerData.width + x) * 4;
  const r = burgerData.data[idx], g = burgerData.data[idx+1], b = burgerData.data[idx+2];
  console.log(`(${x}, ${y}): RGB(${r}, ${g}, ${b}) -> HSL(${rgbToHsl(r, g, b).join(', ')})`);
});

console.log('--- SCOOTER SAMPLES ---');
[[10, 10], [100, 100], [500, 30], [200, 450], [512, 180], [512, 280], [512, 400]].forEach(([x, y]) => {
  const idx = (y * scooterData.width + x) * 4;
  const r = scooterData.data[idx], g = scooterData.data[idx+1], b = scooterData.data[idx+2];
  console.log(`(${x}, ${y}): RGB(${r}, ${g}, ${b}) -> HSL(${rgbToHsl(r, g, b).join(', ')})`);
});
