import { DefaultGridStyles } from "@repo/bead-grid";
import { PatternLayoutOptions } from "./PatternLayoutOptions";

export type PatternOptions = {
    layout: PatternLayoutOptions;
};

export const DefaultPatternOptions: PatternOptions = {
    layout: {
        type: "brick",
        orientation: "vertical",
        beadSize: DefaultGridStyles.bead,
        height: 16,
        width: 16,
    },
};
