import { expect, test } from "vitest";
import { createGrid } from "../../src";
import { BeadingGridProperties } from "@beadee/grid-editor";

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
])("should create a new grid with name ($name)", ({ options, name }) => {
    const defaultGrid = createGrid(options as BeadingGridProperties);

    expect(defaultGrid).toBeDefined();
    expect(defaultGrid.options).toBeDefined();
    expect(defaultGrid.options).toEqual(options);
    expect(defaultGrid.name).toBe(name);
    expect(defaultGrid.cells).toBeDefined();
    expect(defaultGrid.cells).toHaveLength(0);
});
