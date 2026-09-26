/**
 * Draws a two-circle Venn diagram and highlights the region(s) that
 * correspond to the selected set operation. The three regions (A-only,
 * B-only and the intersection lens) are built as separate SVG paths so
 * each one can be colored independently instead of just dimming a whole
 * circle.
 */
(function () {
  const CX_A = 140;
  const CX_B = 260;
  const CY = 150;
  const R = 100;

  // Half the distance between centers, and the resulting intersection
  // points, from the standard two-equal-circles vesica construction.
  const HALF_D = (CX_B - CX_A) / 2;
  const HALF_CHORD = Math.sqrt(R * R - HALF_D * HALF_D);
  const IX = CX_A + HALF_D;
  const IY_TOP = CY - HALF_CHORD;
  const IY_BOTTOM = CY + HALF_CHORD;

  function fullCirclePath(cx, cy, r) {
    return `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`;
  }

  const CIRCLE_A_PATH = fullCirclePath(CX_A, CY, R);
  const CIRCLE_B_PATH = fullCirclePath(CX_B, CY, R);

  // The lens (A ∩ B) as the two arcs joining the intersection points.
  const LENS_PATH =
    `M${IX},${IY_TOP} A${R},${R} 0 0,0 ${IX},${IY_BOTTOM} ` +
    `A${R},${R} 0 0,0 ${IX},${IY_TOP} Z`;

  const REGIONS = {
    leftOnly: { path: `${CIRCLE_A_PATH} ${LENS_PATH}`, fillRule: "evenodd" },
    rightOnly: { path: `${CIRCLE_B_PATH} ${LENS_PATH}`, fillRule: "evenodd" },
    lens: { path: LENS_PATH, fillRule: "nonzero" },
  };

  // Which regions light up for each operation.
  const HIGHLIGHTS = {
    union: ["leftOnly", "rightOnly", "lens"],
    intersection: ["lens"],
    differenceAB: ["leftOnly"],
    differenceBA: ["rightOnly"],
    symmetricDifference: ["leftOnly", "rightOnly"],
    cartesianProduct: [],
  };

  function render(svg) {
    svg.innerHTML = "";
    svg.setAttribute("viewBox", "0 0 400 300");

    Object.entries(REGIONS).forEach(([name, region]) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", region.path);
      path.setAttribute("fill-rule", region.fillRule);
      path.setAttribute("class", "venn-region");
      path.dataset.region = name;
      svg.appendChild(path);
    });

    const outlineA = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outlineA.setAttribute("cx", CX_A);
    outlineA.setAttribute("cy", CY);
    outlineA.setAttribute("r", R);
    outlineA.setAttribute("class", "venn-outline venn-outline--a");
    svg.appendChild(outlineA);

    const outlineB = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outlineB.setAttribute("cx", CX_B);
    outlineB.setAttribute("cy", CY);
    outlineB.setAttribute("r", R);
    outlineB.setAttribute("class", "venn-outline venn-outline--b");
    svg.appendChild(outlineB);

    [
      [CX_A - 60, 70, "A"],
      [CX_B + 40, 70, "B"],
    ].forEach(([x, y, label]) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("class", "venn-label");
      text.textContent = label;
      svg.appendChild(text);
    });
  }

  function highlight(svg, opKey) {
    const active = new Set(HIGHLIGHTS[opKey] || []);
    svg.querySelectorAll(".venn-region").forEach((path) => {
      path.classList.toggle("is-active", active.has(path.dataset.region));
    });
  }

  window.Venn = { render, highlight };
})();
