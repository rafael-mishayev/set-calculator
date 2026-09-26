const assert = require("assert");
const {
  parseSet,
  union,
  intersection,
  difference,
  symmetricDifference,
  cartesianProduct,
} = require("../js/setOperations");

let passed = 0;

function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  ok - ${name}`);
}

console.log("parseSet");
test("trims whitespace and drops empty tokens", () => {
  assert.deepStrictEqual(parseSet(" 1, 2 ,  ,3"), [1, 2, 3]);
});
test("removes duplicates while keeping first occurrence order", () => {
  assert.deepStrictEqual(parseSet("a,b,a,c,b"), ["a", "b", "c"]);
});
test("treats numeric-looking tokens as numbers", () => {
  assert.deepStrictEqual(parseSet("2,2.0,x"), [2, "x"]);
});
test("returns an empty array for empty input", () => {
  assert.deepStrictEqual(parseSet(""), []);
});

console.log("union");
test("combines two sets without duplicates", () => {
  assert.deepStrictEqual(union([1, 2], [2, 3]), [1, 2, 3]);
});

console.log("intersection");
test("keeps only shared elements, in A's order", () => {
  assert.deepStrictEqual(intersection([1, 2, 3], [3, 1, 5]), [1, 3]);
});
test("is empty when sets are disjoint", () => {
  assert.deepStrictEqual(intersection([1, 2], [3, 4]), []);
});

console.log("difference");
test("A \\ B removes B's elements from A", () => {
  assert.deepStrictEqual(difference([1, 2, 3], [2]), [1, 3]);
});
test("is not commutative", () => {
  assert.deepStrictEqual(difference([1, 2], [1, 2, 3]), []);
});

console.log("symmetricDifference");
test("combines both one-sided differences", () => {
  assert.deepStrictEqual(symmetricDifference([1, 2, 3], [3, 4]), [1, 2, 4]);
});

console.log("cartesianProduct");
test("pairs every element of A with every element of B", () => {
  assert.deepStrictEqual(cartesianProduct([1, 2], ["a", "b"]), [
    [1, "a"],
    [1, "b"],
    [2, "a"],
    [2, "b"],
  ]);
});
test("is empty when either set is empty", () => {
  assert.deepStrictEqual(cartesianProduct([], [1]), []);
  assert.deepStrictEqual(cartesianProduct([1], []), []);
});

console.log(`\n${passed} tests passed`);
