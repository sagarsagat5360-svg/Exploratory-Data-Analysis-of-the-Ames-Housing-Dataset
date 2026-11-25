const palette = { teal: "#25877f", orange: "#d77d40", ink: "#182a3d", muted: "#637487", line: "#d8dfdd" };
const priceBands = [
  { label: "<$100k", value: 123 },
  { label: "$100–150k", value: 496 },
  { label: "$150–200k", value: 414 },
  { label: "$200–250k", value: 210 },
  { label: "$250–350k", value: 163 },
  { label: ">$350k", value: 54 },
];
const correlations = [
  { label: "Overall quality", value: 0.791 },
  { label: "Living area above grade", value: 0.709 },
  { label: "Garage capacity", value: 0.640 },
  { label: "Basement area", value: 0.614 },
  { label: "First-floor area", value: 0.606 },
];
const quality = [
  { label: "1", value: 50150, count: 2 }, { label: "2", value: 60000, count: 3 },
  { label: "3", value: 86250, count: 20 }, { label: "4", value: 108000, count: 116 },
  { label: "5", value: 133000, count: 397 }, { label: "6", value: 160000, count: 374 },
  { label: "7", value: 200141, count: 319 }, { label: "8", value: 269750, count: 168 },
  { label: "9", value: 345000, count: 43 }, { label: "10", value: 432390, count: 18 },
];
const neighborhoods = [
  { label: "IDOTRR", value: 103000, count: 37 }, { label: "OldTown", value: 119000, count: 113 },
  { label: "Edwards", value: 121750, count: 100 }, { label: "BrkSide", value: 124300, count: 58 },
  { label: "Sawyer", value: 135000, count: 74 }, { label: "Somerst", value: 225500, count: 86 },
  { label: "Timber", value: 228475, count: 38 }, { label: "StoneBr", value: 278000, count: 25 },
  { label: "NoRidge", value: 301500, count: 41 }, { label: "NridgHt", value: 315000, count: 77 },
];
const missing = [
  { label: "FireplaceQu", value: 47.3 }, { label: "MasVnrType", value: 59.7 },
  { label: "Fence", value: 80.8 }, { label: "Alley", value: 93.8 },
  { label: "MiscFeature", value: 96.3 }, { label: "PoolQC", value: 99.5 },
];

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function horizontalChart(targetId, data, options = {}) {
  const root = document.getElementById(targetId);
  if (!root) return;
  const width = Math.max(360, Math.round(root.getBoundingClientRect().width || 760));
  const rowHeight = options.rowHeight || 42;
  const height = Math.max(170, data.length * rowHeight + 50);
  const left = options.left || (width < 500 ? 125 : 200);
  const right = options.right || 90;
  const top = 14;
  const plotWidth = width - left - right;
  const max = options.max || Math.max(...data.map(d => d.value)) * 1.12;
  const ticks = options.ticks || 4;
  const barHeight = Math.min(21, rowHeight * 0.58);
  const labelSize = width < 500 ? 11 : 13;
  const valueSize = width < 500 ? 11 : 12;
  const fmt = options.format || ((v) => String(v));
  const color = options.color || palette.teal;
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.aria || "Horizontal bar chart"}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<title>${options.aria || "Horizontal bar chart"}</title>`;
  data.forEach((d, i) => {
    const y = top + i * rowHeight + 5;
    const barWidth = Math.max(0, (d.value / max) * plotWidth);
    const highlight = i === data.length - 1 && options.highlightLast;
    svg += `<text x="${left - 10}" y="${y + barHeight * .75}" text-anchor="end" font-size="${labelSize}" fill="${palette.muted}">${d.label}</text>`;
    svg += `<rect x="${left}" y="${y}" width="${plotWidth}" height="${barHeight}" rx="3" fill="#e8eeeb"/>`;
    svg += `<rect x="${left}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="${highlight ? palette.orange : color}"/>`;
    const valueLabel = options.counts ? `${fmt(d.value)} · n=${d.count}` : fmt(d.value);
    svg += `<text x="${Math.min(left + barWidth + 8, width - right + 8)}" y="${y + barHeight * .75}" font-size="${valueSize}" fill="${palette.ink}">${valueLabel}</text>`;
  });
  const axisY = top + data.length * rowHeight + 1;
  svg += `<line x1="${left}" y1="${axisY}" x2="${left + plotWidth}" y2="${axisY}" stroke="${palette.line}" stroke-width="1"/>`;
  for (let i = 0; i <= ticks; i++) {
    const x = left + (plotWidth * i / ticks);
    const tick = max * i / ticks;
    svg += `<line x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 5}" stroke="${palette.line}" stroke-width="1"/>`;
    svg += `<text x="${x}" y="${axisY + 22}" text-anchor="middle" font-size="10" fill="${palette.muted}">${options.tickFormat ? options.tickFormat(tick) : fmt(tick)}</text>`;
  }
  svg += `</svg>`;
  root.innerHTML = svg;
}

function renderAll() {
  horizontalChart("price-chart", priceBands, {
    max: 550, ticks: 5, rowHeight: 38, left: 112, right: 54,
    format: (v) => `${Math.round(v)}`, tickFormat: (v) => `${Math.round(v)}`,
    aria: "Number of homes sold in each sale price band",
  });
  horizontalChart("correlation-chart", correlations.slice().reverse(), {
    max: 0.9, ticks: 3, rowHeight: 43, left: 190, right: 65,
    format: (v) => v.toFixed(3), tickFormat: (v) => v.toFixed(1),
    aria: "Pearson correlation between each numeric attribute and SalePrice",
  });
  horizontalChart("missing-chart", missing, {
    max: 110, ticks: 5, rowHeight: 39, left: 124, right: 60,
    color: palette.orange, format: (v) => `${v.toFixed(1)}%`, tickFormat: (v) => `${Math.round(v)}%`,
    aria: "Percent of rows missing for six selected amenity fields",
  });
  renderGroupChart("quality");
}

function renderGroupChart(view) {
  const data = view === "neighborhood" ? neighborhoods : quality;
  const target = document.getElementById("group-chart");
  const caption = document.getElementById("group-caption");
  const aria = view === "neighborhood" ? "Median sale price by neighborhood, for groups with at least 20 sales" : "Median sale price by overall quality rating";
  horizontalChart("group-chart", data, {
    max: 500000, ticks: 5, rowHeight: 35, left: 120, right: 120,
    format: (v) => money(v), tickFormat: (v) => `$${Math.round(v / 1000)}k`,
    counts: true, highlightLast: true, aria,
  });
  if (target) target.setAttribute("aria-label", aria);
  if (caption) {
    caption.textContent = view === "neighborhood"
      ? "Median SalePrice for neighborhoods with at least 20 sales. Values include sample counts."
      : "Median SalePrice by overall quality score. Endpoint groups are small: quality 1 has 2 sales; quality 10 has 18.";
  }
  document.querySelectorAll(".toggle").forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

document.querySelectorAll(".toggle").forEach(button => {
  button.addEventListener("click", () => renderGroupChart(button.dataset.view));
});
renderAll();
window.addEventListener("resize", renderAll, { passive: true });
