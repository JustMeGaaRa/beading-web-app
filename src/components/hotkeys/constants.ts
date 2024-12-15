import { ShortcutsTable } from "./types";

export const Shortcuts: ShortcutsTable = {
  help: {
    scope: "global",
    keys: ["f1"],
    keyString: "F1",
    description: "Peek shortcuts",
  },
  patternCreate: {
    scope: "page.starting",
    keys: ["ctrl", "shift", "n"],
    keyString: "Ctrl + Shift + N",
    description: "Create a new pattern",
  },
  patternOpen: {
    scope: "page.starting",
    keys: ["ctrl", "o"],
    keyString: "Ctrl + O",
    description: "Open a pattern",
  },
  patternRename: {
    scope: "page.pattern",
    keys: ["f2"],
    keyString: "F2",
    description: "Rename the pattern",
  },
  patternCenter: {
    scope: "page.pattern",
    keys: ["ctrl", "."],
    keyString: "Ctrl + .",
    description: "Center the pattern",
  },
  patternUndo: {
    scope: "page.pattern",
    keys: ["ctrl", "z"],
    keyString: "Ctrl + Z",
    description: "Undo last action",
  },
  patternRedo: {
    scope: "page.pattern",
    keys: ["ctrl", "shift", "z"],
    keyString: "Ctrl + shift + Z",
    description: "Redo last action",
  },
  patternSave: {
    scope: "page.pattern",
    keys: ["ctrl", "s"],
    keyString: "Ctrl + S",
    description: "Backup the pattern",
  },
  toolCursor: {
    scope: "page.pattern",
    keys: ["ctrl", "1"],
    keyString: "Ctrl + 1",
    description: "Use cursor tool",
  },
  toolPencil: {
    scope: "page.pattern",
    keys: ["ctrl", "2"],
    keyString: "Ctrl + 2",
    description: "Use pencil tool",
  },
  toolEraser: {
    scope: "page.pattern",
    keys: ["ctrl", "3"],
    keyString: "Ctrl + 3",
    description: "Use eraser tool",
  },
  toolPicker: {
    scope: "page.pattern",
    keys: ["ctrl", "4"],
    keyString: "Ctrl + 4",
    description: "Use color picker tool",
  },
  panelToggleAll: {
    scope: "page.pattern",
    keys: ["ctrl", "shift", "t"],
    keyString: "Ctrl + Shift + T",
    description: "Toggle all panels",
  },
};
