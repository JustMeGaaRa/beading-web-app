export type ShortcutScopes = "global" | "page.starting" | "page.pattern";

export const ShortcutScopeArray: Array<ShortcutScopes> = [
    "global",
    "page.starting",
    "page.pattern",
];

export type ShortcutInfo = {
    scope: ShortcutScopes;
    keys: Array<string>;
    keyString: string;
    description: string;
};

export type ShortcutKeys =
    | "help"
    | "patternCreate"
    | "patternOpen"
    | "patternRename"
    | "patternCenter"
    | "patternUndo"
    | "patternRedo"
    | "patternSave"
    | "toolCursor"
    | "toolMove"
    | "toolPencil"
    | "toolEraser"
    | "toolPicker"
    | "panelToggleAll";

export const ShortcutKeyArray: Array<ShortcutKeys> = [
    "help",
    "patternCreate",
    "patternOpen",
    "patternRename",
    "patternCenter",
    "patternUndo",
    "patternRedo",
    "patternSave",
    "toolCursor",
    "toolMove",
    "toolPencil",
    "toolEraser",
    "toolPicker",
    "panelToggleAll",
];

export type ShortcutsTable = Record<ShortcutKeys, ShortcutInfo>;
