import { parseEntries, removeWrappingSpaces } from "../src/scripts/parser";

describe('Regex matching', () => {
    describe("Single line", () => {
        test("Standard", () => {
            let result = parseEntries("milch (3.5%) 50 milch (3.5%) 50", true);
            expect(result).toStrictEqual([{ amount: "50", item: "milch (3.5%) 50 milch (3.5%)" }]);

            result = parseEntries("müsli milch (3.5%)          50  ", true);
            expect(result).toStrictEqual([{ amount: "50", item: "müsli milch (3.5%)" }]);

            result = parseEntries("50   milch (3.5%) 50 milch (3.5%) ", false);
            expect(result).toStrictEqual([{ amount: "50", item: "milch (3.5%) 50 milch (3.5%)" }]);

            result = parseEntries("50    müsli milch (3.5%)          ", false);
            expect(result).toStrictEqual([{ amount: "50", item: "müsli milch (3.5%)" }]);
        });

        test("Fractions", () => {
            result = parseEntries("    müsli milch (3.5%)          0.5  ", true);
            expect(result).toStrictEqual([{ amount: "0.5", item: "müsli milch (3.5%)" }]);

            let result = parseEntries("0.5    müsli milch (3.5%)          ", false);
            expect(result).toStrictEqual([{ amount: "0.5", item: "müsli milch (3.5%)" }]);
        });
    });

    describe("Multi line", () => {
        test("Standard", () => {
            let result = parseEntries(`banana 50  
            müsli milch (3.5%) 150`
                , true);
            expect(result).toStrictEqual([
                { amount: "50", item: "banana" },
                { amount: "150", item: "müsli milch (3.5%)" }
            ]);

            result = parseEntries(`   50 banana   
            150 müsli milch (3.5%) `
                , false);
            expect(result).toStrictEqual([
                { amount: "50", item: "banana" },
                { amount: "150", item: "müsli milch (3.5%)" }
            ]);
        })

        describe("Inconsistent ordering", () => {
            test("Item amount", () => {
                let result = parseEntries(`   50 banana   
                hard boiled eggs 150`
                    , true);
                expect(result).toStrictEqual([
                    { amount: "150", item: "hard boiled eggs" },
                    null
                ]);
            })

            test("Amount item", () => {
                let result = parseEntries(`   50 banana   
                           hard boiled eggs 150   `
                    , false);
                expect(result).toStrictEqual([
                    { amount: "50", item: "banana" },
                    null
                ]);
            });
        });
    });

    // test("With unit", () => {
    //     let result = parseEntries(`banana [cup] 1
    //     hard boiled eggs 1`);
    //     expect(result).toStrictEqual([{ amount: "1", item: "banana" }]);
    // });
});



test("Wrapping spaces", () => {
    let result = removeWrappingSpaces("       müsli milch (3.5%)    ");
    expect(result).toBe("müsli milch (3.5%)");
});