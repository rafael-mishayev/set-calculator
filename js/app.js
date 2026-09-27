(function () {
  const { parseSet, union, intersection, difference, symmetricDifference, cartesianProduct } =
    window.SetOperations;

  const els = {
    setA: document.getElementById("setA"),
    setB: document.getElementById("setB"),
    setAChips: document.getElementById("setAChips"),
    setBChips: document.getElementById("setBChips"),
    opButtons: Array.from(document.querySelectorAll(".op-button")),
    resultTitle: document.getElementById("resultTitle"),
    resultChips: document.getElementById("resultChips"),
    cartesianTable: document.getElementById("cartesianTable"),
    cartesianTableBody: document.getElementById("cartesianTableBody"),
    copyResult: document.getElementById("copyResult"),
    historyList: document.getElementById("historyList"),
    venn: document.getElementById("vennDiagram"),
    themeToggle: document.getElementById("themeToggle"),
  };

  const THEME_KEY = "set-calculator-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    els.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  function initTheme() {
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem(THEME_KEY);
    applyTheme(stored || (preferredDark ? "dark" : "light"));
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  const OPERATIONS = {
    union: { label: "איחוד", symbol: "A ∪ B", run: (a, b) => union(a, b) },
    intersection: { label: "חיתוך", symbol: "A ∩ B", run: (a, b) => intersection(a, b) },
    differenceAB: { label: "הפרש", symbol: "A \\ B", run: (a, b) => difference(a, b) },
    differenceBA: { label: "הפרש", symbol: "B \\ A", run: (a, b) => difference(b, a) },
    symmetricDifference: {
      label: "הפרש סימטרי",
      symbol: "A △ B",
      run: (a, b) => symmetricDifference(a, b),
    },
    cartesianProduct: {
      label: "מכפלה קרטזית",
      symbol: "A × B",
      run: (a, b) => cartesianProduct(a, b),
      isPairs: true,
    },
  };

  const EXAMPLES = {
    a: "1, 2, 3, 4, 5",
    b: "4, 5, 6, 7, 8",
  };

  const history = [];
  let activeOp = null;

  function getSetA() {
    return parseSet(els.setA.value);
  }

  function getSetB() {
    return parseSet(els.setB.value);
  }

  function renderChips(container, values) {
    container.innerHTML = "";
    if (values.length === 0) {
      container.innerHTML = '<span class="chip chip--muted">קבוצה ריקה</span>';
      return;
    }
    values.forEach((value) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = value;
      container.appendChild(chip);
    });
  }

  function formatSet(values) {
    return "{ " + values.join(", ") + " }";
  }

  function formatPairs(pairs) {
    return "{ " + pairs.map(([x, y]) => `(${x}, ${y})`).join(", ") + " }";
  }

  function runOperation(opKey) {
    const op = OPERATIONS[opKey];
    const a = getSetA();
    const b = getSetB();
    const result = op.run(a, b);

    activeOp = opKey;
    els.opButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.op === opKey));

    els.resultTitle.textContent = `${op.symbol} = ${op.isPairs ? formatPairs(result) : formatSet(result)}`;

    if (op.isPairs) {
      els.resultChips.classList.add("hidden");
      els.cartesianTable.classList.remove("hidden");
      renderCartesianTable(result);
    } else {
      els.cartesianTable.classList.add("hidden");
      els.resultChips.classList.remove("hidden");
      renderChips(els.resultChips, result);
    }

    els.copyResult.classList.remove("hidden");
    updateVenn(opKey);
    pushHistory(op, result);
  }

  function renderCartesianTable(pairs) {
    els.cartesianTableBody.innerHTML = "";
    pairs.forEach(([x, y]) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = `(${x}, ${y})`;
      row.appendChild(cell);
      els.cartesianTableBody.appendChild(row);
    });
  }

  function pushHistory(op, result) {
    const entry = {
      text: `${op.symbol} = ${op.isPairs ? formatPairs(result) : formatSet(result)}`,
    };
    history.unshift(entry);
    if (history.length > 15) history.pop();
    renderHistory();
  }

  function renderHistory() {
    els.historyList.innerHTML = "";
    history.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = entry.text;
      els.historyList.appendChild(li);
    });
  }

  function updateVenn(opKey) {
    window.Venn.highlight(els.venn, opKey);
  }

  function copyResultToClipboard() {
    const text = els.resultTitle.textContent;
    navigator.clipboard.writeText(text);
  }

  els.setA.addEventListener("input", () => renderChips(els.setAChips, getSetA()));
  els.setB.addEventListener("input", () => renderChips(els.setBChips, getSetB()));

  document.querySelectorAll("[data-example]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.example === "a" ? els.setA : els.setB;
      target.value = EXAMPLES[btn.dataset.example];
      target.dispatchEvent(new Event("input"));
    });
  });

  els.opButtons.forEach((btn) => {
    btn.addEventListener("click", () => runOperation(btn.dataset.op));
  });

  els.copyResult.addEventListener("click", copyResultToClipboard);
  els.themeToggle.addEventListener("click", toggleTheme);

  initTheme();
  window.Venn.render(els.venn);
  renderChips(els.setAChips, []);
  renderChips(els.setBChips, []);
})();
