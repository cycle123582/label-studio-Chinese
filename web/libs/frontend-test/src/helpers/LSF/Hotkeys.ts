function isMac(win) {
  return win.navigator.platform.toLowerCase().indexOf("mac") >= 0;
}

function pressHotkey(hotkey: string, macHotkey?: string) {
  let key = hotkey;
  cy.window().then((win) => {
    if (macHotkey && isMac(win)) {
      key = macHotkey;
    }
    cy.get("body").type(key);
  });
}

export const Hotkeys = {
  undo() {
    pressHotkey("{ctrl}z", "{command}z");
  },
  redo() {
    pressHotkey("{ctrl}{shift}z", "{command}{shift}z");
  },
  deleteRegion() {
    pressHotkey("{backspace}");
  },
  deleteAllRegions() {
    const alertHandler = (_s) => true;
    cy.once("window:alert", alertHandler);
    pressHotkey("{ctrl}{backspace}", "{command}{backspace}");
  },
  unselectAllRegions() {
    pressHotkey("{esc}");
  },
};
