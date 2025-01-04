import { expect, test } from "vitest";
import { Square3x3GridWithCells, Square10x10EmptyGrid } from "../constants";
import { copy, paste } from "../../src";

test.each([
    {
        area: { topLeft: { columnIndex: 0, rowIndex: 0 }, width: 1, height: 1 },
        length: 1,
    },
    {
        area: { topLeft: { columnIndex: 0, rowIndex: 0 }, width: 2, height: 2 },
        length: 2,
    },
    {
        area: { topLeft: { columnIndex: 1, rowIndex: 1 }, width: 1, height: 1 },
        length: 1,
    },
    {
        area: { topLeft: { columnIndex: 1, rowIndex: 0 }, width: 1, height: 3 },
        length: 1,
    },
    {
        area: { topLeft: { columnIndex: 1, rowIndex: 1 }, width: 3, height: 3 },
        length: 2,
    },
])(
    "should return ($length) cells within given area ($area.columnIndex, $area.rowIndex, $area.height, $area.width)",
    ({ area, length }) => {
        const copiedSection = copy(Square3x3GridWithCells, area);

        expect(copiedSection).toBeDefined();
        expect(copiedSection.cells).toBeDefined();
        expect(copiedSection.cells).toHaveLength(length);
    }
);

test.each([
    {
        grid: Square10x10EmptyGrid,
        section: {
            cells: [{ offset: { columnIndex: 0, rowIndex: 0 }, color: "blue" }],
            topLeft: { columnIndex: 0, rowIndex: 0 },
            height: 1,
            width: 1,
        },
        offset: { columnIndex: 0, rowIndex: 0 },
    },
    {
        grid: Square10x10EmptyGrid,
        section: {
            cells: [{ offset: { columnIndex: 1, rowIndex: 1 }, color: "blue" }],
            topLeft: { columnIndex: 1, rowIndex: 1 },
            height: 1,
            width: 1,
        },
        offset: { columnIndex: 0, rowIndex: 0 },
    },
    {
        grid: Square10x10EmptyGrid,
        section: {
            cells: [
                { offset: { columnIndex: 0, rowIndex: 0 }, color: "blue" },
                { offset: { columnIndex: 0, rowIndex: 1 }, color: "green" },
                { offset: { columnIndex: 1, rowIndex: 0 }, color: "red" },
            ],
            topLeft: { columnIndex: 0, rowIndex: 0 },
            height: 2,
            width: 2,
        },
        offset: { columnIndex: 0, rowIndex: 0 },
    },
    {
        grid: Square10x10EmptyGrid,
        section: {
            cells: [
                { offset: { columnIndex: 2, rowIndex: 3 }, color: "blue" },
                { offset: { columnIndex: 2, rowIndex: 4 }, color: "green" },
                { offset: { columnIndex: 3, rowIndex: 3 }, color: "red" },
            ],
            topLeft: { columnIndex: 2, rowIndex: 3 },
            height: 2,
            width: 2,
        },
        offset: { columnIndex: 5, rowIndex: 1 },
    },
])(
    "should have sections cells ($section.cells.length) copied to exact offset in the grid",
    ({ grid, section, offset }) => {
        const modifiedGrid = paste(grid, section, offset);

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.cells).toBeDefined();
        expect(modifiedGrid.cells).toHaveLength(section.cells.length);
        expect(
            modifiedGrid.cells.every((gridCell) =>
                section.cells.some(
                    (sectionCell) =>
                        gridCell.offset.columnIndex ===
                            sectionCell.offset.columnIndex +
                                offset.columnIndex -
                                section.topLeft.columnIndex &&
                        gridCell.offset.rowIndex ===
                            sectionCell.offset.rowIndex +
                                offset.rowIndex -
                                section.topLeft.rowIndex &&
                        gridCell.color === sectionCell.color
                )
            ),
            "all cells should be copied to the exact offset in the grid"
        ).toBe(true);
    }
);
