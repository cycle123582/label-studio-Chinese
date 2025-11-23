const AtOutliner = require("./AtOutliner");

const { I } = inject();

module.exports = {
  unselectWithHotkey() {
    // wait is necessary for "Select region after creation" cases because
    // there's delay between region creation and ability to unselect a region
    I.waitTicks(2);
    I.pressKey(["u"]);
    AtOutliner.dontSeeSelectedRegion();
  },

  async getBBoxByRegionIdx(idx) {
    return await I.executeScript(
      ({ idx }) => {
        return window.Htx.annotationStore.selected.regionStore.regions[idx].bboxCoordsCanvas;
      },
      { idx },
    );
  },

  undoLastActionWithHotkey() {
    I.pressKey(["CommandOrControl", "z"]);
  },

  redoLastAction() {
    I.pressKey(["CommandOrControl", "Shift", "z"]);
  },

  //Image tools
  selectMoveTool() {
    I.pressKey("v");
  },
};
