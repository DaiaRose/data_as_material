// app.js: drive the Circus Vector Viewer interactions

const container = document.getElementById('pan-container');
const tooltip   = document.getElementById('tooltip');
const toast     = document.getElementById('toast');
let panzoomInstance;
let currentMaxZ = 1; // global z-index tracker

const MAX_ZOOM   = 20;
const DBL_FACTOR = 4;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1000);
}

function showTooltip(msg, x, y) {
  tooltip.textContent = msg;
  tooltip.style.left = `${x}px`;
  tooltip.style.top  = `${y}px`;
  tooltip.classList.add('show');
}

function hideTooltip() {
  tooltip.classList.remove('show');
}

// Load the vector results CSV and render images
fetch('vector_results.csv')
  .then(r => r.text())
  .then(text => {
    const rows = Papa.parse(text, { header: true, skipEmptyLines: true }).data
                      .filter(d => d.filename && d.x != null && d.y != null);
    const xs = rows.map(r => +r.x), ys = rows.map(r => +r.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const pad = 50;
    const contentW = container.clientWidth - 2 * pad;
    const contentH = container.clientHeight - 2 * pad;

    rows.forEach(d => {
      const xNorm = (+d.x - minX) / (maxX - minX);
      const yNorm = (+d.y - minY) / (maxY - minY);
      const img = document.createElement('img');
      img.src = `../CircusImages/${d.filename}`;
      img.alt = d.filename;
      img.style.left = `${pad + contentW * xNorm}px`;
      img.style.top  = `${pad + contentH * yNorm}px`;

      // img.addEventListener('mouseover', e => showTooltip(d.filename, e.pageX + 5, e.pageY + 5));
      // img.addEventListener('mouseout', hideTooltip);
      img.addEventListener('click', () => {
        currentMaxZ += 1;           // bring clicked image to front
        img.style.zIndex = currentMaxZ;
        navigator.clipboard.writeText(d.filename)
          // .then(() => showToast(`Copied: ${d.filename}`));
      });
      container.appendChild(img);
    });

    // Initialize Panzoom
    panzoomInstance = panzoom(container, {
      maxZoom: MAX_ZOOM,
      minZoom: 1,
      contain: 'invert',
      zoomDoubleClickSpeed: 1,
      onDoubleClick: () => false
    });
    container.addEventListener('wheel', panzoomInstance.zoomWithWheel);

    // Custom double-click: fixed factor zoom + center
    container.addEventListener('dblclick', e => {
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      panzoomInstance.zoomAbs(cx, cy, DBL_FACTOR);
      panzoomInstance.moveTo(
        rect.width  / 2 - cx * DBL_FACTOR,
        rect.height / 2 - cy * DBL_FACTOR
      );
    });

    // Build a single controls panel
    const controls = document.createElement('div');
    controls.className = 'zoom-controls';

   // Pull the Home logo into the panel
    const homeBtn = document.getElementById('resetButton');
    homeBtn.classList.add('home-button');

    // Re-bind the reset behavior now that we’ve moved it
    homeBtn.addEventListener('click', () => {
      panzoomInstance.moveTo(0, 0);
      panzoomInstance.zoomAbs(0, 0, 1);
    });

    controls.appendChild(homeBtn);

    // Then add zoom buttons below it
    const zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.title = 'Zoom In';
    zoomInBtn.addEventListener('click', () => {
      const { scale } = panzoomInstance.getTransform();
      const newScale = Math.min(scale * 1.2, MAX_ZOOM);
      panzoomInstance.zoomTo(container.clientWidth/2, container.clientHeight/2, newScale);
    });

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '−';
    zoomOutBtn.title = 'Zoom Out';
    zoomOutBtn.addEventListener('click', () => {
      const { scale } = panzoomInstance.getTransform();
      const newScale = Math.max(scale / 1.2, 1);
      panzoomInstance.zoomAbs(container.clientWidth/2, container.clientHeight/2, newScale);
    });

    controls.appendChild(zoomInBtn);
    controls.appendChild(zoomOutBtn);

    // Finally, add the whole panel to the document
    document.body.appendChild(controls);

        // --- NEW: Top‑left "book" button ---
    const topLeft = document.createElement('div');
    topLeft.className = 'top-left-controls';

    const bookBtn = document.createElement('img');
    bookBtn.id = 'bookButton';
    bookBtn.src = 'bookLogoBlack.png';
    bookBtn.alt = 'Book';
    bookBtn.classList.add('home-button'); // reuse that styling

    const panel = document.getElementById('annotationsPanel');
    panel.addEventListener('wheel', e => {
      e.stopPropagation();
    }, { passive: false });


    bookBtn.addEventListener('click', () => {
      panel.classList.toggle('visible');
    });

    topLeft.appendChild(bookBtn);
    document.body.appendChild(topLeft);



  })
  .catch(console.error);

