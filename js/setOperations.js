/**
 * Core set-theory engine. Framework-free so it can be unit tested with plain
 * Node and reused as-is in the browser (see the UMD export at the bottom).
 */

/**
 * Parses a comma-separated string into an array of unique values.
 * Purely-numeric tokens are converted to numbers so that "2" and "2.0"
 * compare and display consistently; everything else stays a trimmed string.
 * @param {string} input
 * @returns {Array<string|number>}
 */
function parseSet(input) {
  if (!input) return [];

  const seen = new Set();
  const result = [];

  input
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .forEach((token) => {
      const value = isNumeric(token) ? Number(token) : token;
      const key = String(value);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(value);
      }
    });

  return result;
}

function isNumeric(token) {
  return token !== "" && !Number.isNaN(Number(token));
}

function key(value) {
  return typeof value + ":" + String(value);
}

/** A ∪ B */
function union(a, b) {
  const seen = new Set();
  const result = [];
  [...a, ...b].forEach((value) => {
    const k = key(value);
    if (!seen.has(k)) {
      seen.add(k);
      result.push(value);
    }
  });
  return result;
}

/** A ∩ B */
function intersection(a, b) {
  const bKeys = new Set(b.map(key));
  const seen = new Set();
  const result = [];
  a.forEach((value) => {
    const k = key(value);
    if (bKeys.has(k) && !seen.has(k)) {
      seen.add(k);
      result.push(value);
    }
  });
  return result;
}

/** A \ B */
function difference(a, b) {
  const bKeys = new Set(b.map(key));
  return a.filter((value) => !bKeys.has(key(value)));
}

/** A △ B = (A \ B) ∪ (B \ A) */
function symmetricDifference(a, b) {
  return [...difference(a, b), ...difference(b, a)];
}

/** A × B */
function cartesianProduct(a, b) {
  const result = [];
  a.forEach((x) => {
    b.forEach((y) => {
      result.push([x, y]);
    });
  });
  return result;
}

const SetOperations = {
  parseSet,
  union,
  intersection,
  difference,
  symmetricDifference,
  cartesianProduct,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SetOperations;
} else {
  window.SetOperations = SetOperations;
}
