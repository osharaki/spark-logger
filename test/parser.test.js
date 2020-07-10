import parseEntries from "../src/scripts/parser";

test("Entry parsing", () => {
    let result = parseEntries("banana 50");
    expect(result).toStrictEqual([{ amount: "50", item: "banana" }]);
});