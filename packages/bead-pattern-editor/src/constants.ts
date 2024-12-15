import { ONE_SIX_BY_ONE_THREE } from "@repo/bead-grid";
import { PatternOptions } from "./types";

export const DefaultPatternOptions: PatternOptions = {
    layout: {
        type: "brick",
        beadSize: ONE_SIX_BY_ONE_THREE,
        orientation: "vertical",
        height: 16,
        width: 16,
    },
};
