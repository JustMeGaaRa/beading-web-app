import { vi } from "vitest";

vi.mock("react-konva", () => ({
    default: () => "react-konva",
    namedExport: () => "react-konva",
}));

vi.mock("react-konva-utils", () => ({
    default: () => "react-konva-utils",
    namedExport: () => "react-konva-utils",
}));
