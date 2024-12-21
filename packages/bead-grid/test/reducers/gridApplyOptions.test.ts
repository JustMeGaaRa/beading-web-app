import { expect, test } from "vitest";
import { gridApplyOptions } from "../../src";
import { Square3x3GridWithCells } from "../constants";

test.each([
    [
        {
            options: {
                type: "brick",
                height: 10,
                width: 10,
                fringe: 5,
                drop: 2,
            },
            name: "Brick Grid 1",
        },
    ],
    [
        {
            options: { type: "peyote", height: 20, width: 20 },
            name: "Peyote Grid 1",
        },
    ],
    [
        {
            options: { type: "square", height: 1, width: 1 },
            name: "Square Grid 1",
        },
    ],
])(
    "should have type '$options.type' and have name '$name' and no cells outside of bounds",
    ({ options, name }) => {
        const modifiedGrid = gridApplyOptions(
            Square3x3GridWithCells,
            options as any
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options).toMatchObject(options);
        expect(modifiedGrid.name).toBe(name);
        expect(
            modifiedGrid.cells.filter(
                (cell) =>
                    cell.offset.rowIndex < 0 ||
                    cell.offset.rowIndex >= options.height ||
                    cell.offset.columnIndex < 0 ||
                    cell.offset.columnIndex >= options.width
            ),
            "should have no cells outside of bounds"
        ).toHaveLength(0);
    }
);

test("should return same grid object", () => {
    const modifiedGrid = gridApplyOptions(
        Square3x3GridWithCells,
        Square3x3GridWithCells.options
    );

    expect(modifiedGrid).toBe(Square3x3GridWithCells);
});
