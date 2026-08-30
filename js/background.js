// Dynamic hexagon/sunset background, in the style of
// github.com/eglerean/asc_background_generator — regenerates a fresh
// hexagon cluster layout on every page load, and redraws (debounced) on
// window resize. Renders once against the viewport (not full document
// height) so it behaves like a fixed wallpaper content scrolls over.
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var BASE_STOPS = [
    { pos: 0,    h: 238, s: 60, l: 13 },
    { pos: 0.38, h: 228, s: 52, l: 22 },
    { pos: 0.63, h: 318, s: 28, l: 30 },
    { pos: 0.82, h: 18,  s: 62, l: 40 },
    { pos: 1,    h: 25,  s: 75, l: 48 },
  ];

  // Pointy-top hexagon path around (cx, cy) with circumradius R.
  function hexPath(cx, cy, R) {
    var angles = [-90, -30, 30, 90, 150, 210];
    var pts = angles.map(function (a) {
      var rad = (a * Math.PI) / 180;
      return (cx + R * Math.cos(rad)).toFixed(2) + ',' + (cy + R * Math.sin(rad)).toFixed(2);
    });
    return 'M ' + pts.join(' L ') + ' Z';
  }

  // Axial-hex neighbor directions (pointy-top layout).
  var AXIAL_DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

  function axialToPixel(q, r, R) {
    return [R * Math.sqrt(3) * (q + r / 2), R * 1.5 * r];
  }

  // Grow a small connected patch of `rings` hex rings around the origin cell
  // via BFS over axial coordinates.
  function buildClusterCells(rings) {
    var cells = [[0, 0]];
    var seen = { '0,0': true };
    var frontier = [[0, 0]];

    for (var ring = 0; ring < rings; ring++) {
      var next = [];
      frontier.forEach(function (cell) {
        AXIAL_DIRS.forEach(function (dir) {
          var q = cell[0] + dir[0];
          var r = cell[1] + dir[1];
          var key = q + ',' + r;
          if (!seen[key] && Math.random() > 0.25) {
            seen[key] = true;
            cells.push([q, r]);
            next.push([q, r]);
          }
        });
      });
      frontier = next;
      if (!frontier.length) break;
    }
    return cells;
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function buildGradient(svg, id) {
    var defs = svgEl('defs', {});
    var grad = svgEl('linearGradient', { id: id, x1: '0', y1: '0', x2: '0', y2: '1' });
    BASE_STOPS.forEach(function (s) {
      grad.appendChild(svgEl('stop', {
        offset: (s.pos * 100) + '%',
        'stop-color': 'hsl(' + s.h + ',' + s.s + '%,' + s.l + '%)',
      }));
    });
    defs.appendChild(grad);
    svg.appendChild(defs);
    return id;
  }

  function buildCluster(svg, cx, cy, rings, R) {
    var cells = buildClusterCells(rings);
    cells.forEach(function (cell) {
      var offset = axialToPixel(cell[0], cell[1], R);
      var fillA = (0.08 + Math.random() * 0.10).toFixed(2);
      var strokeA = (0.25 + Math.random() * 0.20).toFixed(2);
      svg.appendChild(svgEl('path', {
        d: hexPath(cx + offset[0], cy + offset[1], R),
        fill: 'rgba(255,255,255,' + fillA + ')',
        stroke: 'rgba(255,255,255,' + strokeA + ')',
        'stroke-width': '1.2',
      }));
    });
  }

  function render(svg, w, h) {
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.innerHTML = '';

    var gradId = buildGradient(svg, 'asc-bg-gradient');
    svg.appendChild(svgEl('rect', { x: 0, y: 0, width: w, height: h, fill: 'url(#' + gradId + ')' }));

    var numClusters = 3 + Math.floor(Math.random() * 5); // 3-7
    var R_SMALL = 30;
    for (var i = 0; i < numClusters; i++) {
      var cx = (0.05 + Math.random() * 0.9) * w;
      var cy = (0.05 + Math.random() * 0.9) * h;
      var rings = 1 + Math.floor(Math.random() * 3); // 1-3
      buildCluster(svg, cx, cy, rings, R_SMALL);
    }
  }

  function init() {
    var svg = document.getElementById('bg-svg');
    if (!svg) return;

    var lastWidth = window.innerWidth;
    var draw = function () {
      lastWidth = window.innerWidth;
      render(svg, window.innerWidth, window.innerHeight);
    };
    draw();

    // Mobile browsers fire `resize` when the address bar shows/hides while
    // scrolling (height-only change). Redrawing on that would make the
    // background visibly shift mid-scroll, so only redraw on a real width
    // change (window resize on desktop, or orientation change on mobile).
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth !== lastWidth) draw();
      }, 200);
    });
  }

  window.ASCBackground = { init: init, hexPath: hexPath };
  document.addEventListener('DOMContentLoaded', init);
})();
