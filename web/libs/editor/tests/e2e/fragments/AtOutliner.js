const { centerOfBbox } = require("../tests/helpers");
const { I } = inject();

module.exports = {
  _rootSelector: ".lsf-outliner",
  _regionListSelector: ".lsf-outliner-tree",
  _regionListItemSelector: ".lsf-tree__node:not(.lsf-tree__node_type_footer)",
  _regionListItemSelectedSelector: ".lsf-tree-node-selected",
  _regionListItemIndex: ".lsf-outliner-item__index",
  _regionVesibilityActionButton: ".lsf-outliner-item__control_type_visibility button",
  _incompleteStateIcon: ".lsf-outliner-item__incomplete",
  locateOutliner() {
    return locate(this._rootSelector);
  },
  locate(locator) {
    return locator ? locate(locator).inside(this.locateOutliner()) : this.locateOutliner();
  },
  locateRegionList() {
    return this.locate(this._regionListSelector);
  },
  locateRegionItemList(text) {
    if (text) {
      return locate(this._regionListItemSelector).withText(text).inside(this.locateRegionList());
    }
    return locate(this._regionListItemSelector).inside(this.locateRegionList());
  },
  locateRegionItemIndex(idx) {
    return locate(this._regionListItemIndex).withText(`${idx}`).inside(this.locateRegionItemList());
  },
  locateRegionIndex(idx) {
    return this.locateRegionItemList().withDescendant(
      `${locate(this._regionListItemIndex).toXPath()}[text()='${idx}']`,
    );
  },
  locateSelectedItem(locator) {
    const selectedLocator = locate(this._regionListItemSelectedSelector).inside(this.locateRegionList());

    return locator ? selectedLocator.find(locator) : selectedLocator;
  },
  locateRegion(idxOrText) {
    return typeof idxOrText === "number" ? this.locateRegionItemIndex(idxOrText) : this.locateRegionItemList(idxOrText);
  },
  locateIncompleteStateIcon(idxOrText) {
    if (idxOrText === undefined) {
      return locate(this._incompleteStateIcon).inside(this.locateRegionList());
    }
    return locate(this._incompleteStateIcon).inside(this.locateRegion(idxOrText));
  },
  see(text) {
    I.see(text, this._regionListSelector);
  },
  dontSee(text) {
    I.dontSee(text, this._regionListSelector);
  },
  seeElement(locator) {
    I.seeElement(this.locate(locator));
  },
  seeRegions(count) {
    // Avoid tries to find a region when there are 0 of them
    count && I.seeElement(this.locateRegionItemIndex(count));
    I.dontSeeElement(this.locateRegionItemIndex(count + 1));
  },
  dontSeeRegions(count) {
    count && I.dontSeeElement(this.locateRegionItemList().at(count));
    count === +count && I.dontSeeElement(this.locateRegionItemIndex(count));
    !count && I.see("Labeled regions will appear here");
  },
  clickRegion(idxOrText) {
    I.click(this.locateRegion(idxOrText));
  },
  hoverRegion(idxOrText) {
    I.moveCursorTo(this.locateRegion(idxOrText));
  },
  toggleRegionVisibility(idxOrText) {
    // Hover to see action button
    this.hoverRegion(idxOrText);
    // This button exist only for hovered list item
    I.click(locate(this._regionVesibilityActionButton));
  },
  seeSelectedRegion(text = undefined) {
    I.seeElement(text ? this.locateSelectedItem().withText(text) : this.locateSelectedItem());
  },
  dontSeeSelectedRegion(text = undefined) {
    I.dontSeeElement(text ? this.locateSelectedItem().withText(text) : this.locateSelectedItem());
  },
  /**
   * Verifies that the incomplete state icon is visible in a region list or for the specific region.
   *
   * @param {number|string} [idxOrText] - The index or text reference used to locate the region that should contain incomplete state icon.
   * Otherwise, it tries to find any.
   * @return {void} This method does not return any value.
   */
  seeIncompleteRegion(idxOrText) {
    I.seeElement(this.locateIncompleteStateIcon(idxOrText));
  },
  /**
   * Verifies that the incomplete state icon is not visible in a region list or for the specific region.
   *
   * @param {number|string} [idxOrText] - The index or text reference used to locate the region that should contain incomplete state icon.
   * Otherwise, it tries to find any.
   * @return {void} This method does not return any value.
   */
  dontSeeIncompleteRegion(idxOrText) {
    I.dontSeeElement(this.locateIncompleteStateIcon(idxOrText));
  },
  /**
   * Drag and drop region through the outliner's regions tree
   * @param {number} dragRegionIdx - Index of the dragged region
   * @param {number} dropRegionIdx - Index of the region that will be a drop zone
   * @param {number} [steps=3] - Sends intermediate mousemove events.
   * @returns {Promise<void>}
   */
  async dragAndDropRegion(dragRegionIdx, dropRegionIdx, steps = 3) {
    const fromBbox = await I.grabElementBoundingRect(this.locateRegionItemIndex(dragRegionIdx));
    const toBbox = await I.grabElementBoundingRect(this.locateRegionItemIndex(dropRegionIdx));
    const fromPoint = centerOfBbox(fromBbox);
    const toPoint = {
      x: toBbox.x + toBbox.width / 2,
      y: toBbox.y + (3 * toBbox.height) / 4,
    };

    return await I.dragAndDropMouse(fromPoint, toPoint, "left", steps);
  },
};
