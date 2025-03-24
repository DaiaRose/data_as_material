const fs = require('fs');
const makerjs = require('makerjs');

// Read and parse CSV
const raw = fs.readFileSync('cumulative_bug_counts.csv', 'utf8');
const lines = raw.trim().split('\n');
const headers = lines[0].split(',');

const data = lines.slice(1).map(line => {
  const values = line.split(',');
  const entry = {};
  headers.forEach((key, i) => {
    entry[key] = isNaN(values[i]) ? values[i] : +values[i];
  });
  return entry;
});

// Setup
const width = 1728;
const height = 1296;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };

const families = [...new Set(data.map(d => d.family))];
const yearExtent = [
  Math.min(...data.map(d => d.year)),
  Math.max(...data.map(d => d.year))
];
const maxCumulative = Math.max(...data.map(d => d.cumulative));

// Scale functions
function scale(value, domain, range) {
  const [dMin, dMax] = domain;
  const [rMin, rMax] = range;
  return ((value - dMin) / (dMax - dMin)) * (rMax - rMin) + rMin;
}

function x(year) {
  return scale(year, yearExtent, [margin.left, width - margin.right]);
}

function y(cumulative) {
  return scale(cumulative, [0, maxCumulative], [height - margin.bottom, margin.top]);
}

// Create paths by drawing lines between points
function polygonFromPoints(points) {
  const paths = {};
  for (let i = 0; i < points.length - 1; i++) {
    paths[`line-${i}`] = new makerjs.paths.Line(points[i], points[i + 1]);
  }
  return { paths };
}

// Build DXF
const masterModel = { models: {} };

let offsetX = 0;
const spacing = 100; // adjust this spacing as needed

families.forEach(family => {
  const familyData = data
    .filter(d => d.family === family)
    .sort((a, b) => a.year - b.year);

  const closedShape = [
    [x(yearExtent[0]), y(0)],
    ...familyData.map(d => [x(d.year), y(d.cumulative)]),
    [x(yearExtent[1]), y(0)],
    [x(yearExtent[0]), y(0)] // close the shape
  ];

  // Shift shape points to the right by offsetX
  const shiftedShape = closedShape.map(([px, py]) => [px + offsetX, py]);

  // Create path model from shifted shape
  const shape = polygonFromPoints(shiftedShape);
  masterModel.models[family] = shape;

  // Find width of this shape and update offset
  const shapeWidth = x(yearExtent[1]) - x(yearExtent[0]);
  offsetX += shapeWidth + spacing;
});


// Export
const dxf = makerjs.exporter.toDXF(masterModel);
fs.writeFileSync('cumulative_bug_shapes.dxf', dxf);
console.log('✅ DXF written: cumulative_bug_shapes.dxf');
