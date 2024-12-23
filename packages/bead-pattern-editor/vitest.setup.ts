import { vi } from "vitest";

vi.mock("react-konva", () => ({
    default: () => "react-konva",
    namedExport: () => "react-konva",
}));
