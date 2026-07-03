const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/super-spirit-icon.svg');
const pngPath = path.join(__dirname, '../assets/icon.png');

sharp(svgPath, { density: 300 })
  .resize(1024, 1024)
  .png()
  .toFile(pngPath)
  .then((info) => {
    console.log('Generated', pngPath, info);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
