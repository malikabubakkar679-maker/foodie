const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

const scooterData = jpeg.decode(fs.readFileSync(path.join(__dirname, '../src/assets/onboarding-delivery.jpg')));
const points = [
  [450, 180], [480, 180], [510, 180],
  [450, 220], [480, 220], [510, 220],
  [450, 260], [480, 260], [510, 260],
];

points.forEach(([x, y]) => {
  const idx = (y * scooterData.width + x) * 4;
  const r = scooterData.data[idx], g = scooterData.data[idx+1], b = scooterData.data[idx+2];
  console.log(`(${x}, ${y}): RGB(${r}, ${g}, ${b}) -> diffRG=${r-g}, diffGB=${g-b}`);
});
