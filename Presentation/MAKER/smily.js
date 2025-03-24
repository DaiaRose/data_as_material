const fs = require('fs');
const makerjs = require('makerjs');

// Define a model object
const smiley = {
  models: {},
  paths: {
    head: new makerjs.paths.Circle([0, 0], 90),
    eye: new makerjs.paths.Circle([25, 25], 10),
    mouth: new makerjs.paths.Arc([0, 0], 50, 225, 315),
    wink: new makerjs.paths.Line([-35, 20], [-15, 20])
  }
};

// Export to DXF
const dxf = makerjs.exporter.toDXF(smiley);
fs.writeFileSync('smiley.dxf', dxf);
console.log('✅ DXF file written: smiley.dxf');

