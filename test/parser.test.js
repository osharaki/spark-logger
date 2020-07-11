import parseEntries from "../src/scripts/parser";

describe('Regex matching', () => {
    test("Entry parsing", () => {
        let result = parseEntries("banana 50");
        expect(result).toStrictEqual([{ amount: "50", item: "banana" }]);

        result = parseEntries("milch (3.5%) 50 milch (3.5%) 50");
        expect(result).toStrictEqual([{ amount: "50", item: "milch (3.5%) 50 milch (3.5%)" }]);

        result = parseEntries("milch 3.5% 50");
        expect(result).toStrictEqual([{ amount: "50", item: "milch 3.5%" }]);

        result = parseEntries("1.5% milch (3.5%) 50");
        expect(result).toStrictEqual([{ amount: "50", item: "milch (3.5%)" }]);

        result = parseEntries("müsli 50");
        expect(result).toStrictEqual([{ amount: "50", item: "müsli" }]);
    });
});
