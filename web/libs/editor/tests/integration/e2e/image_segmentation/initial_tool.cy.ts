import { LabelStudio } from "@humansignal/frontend-test/helpers/LSF";
import {
  imageData,
  imageWithBothToolsConfig,
  imageWithBrushConfig,
  imageWithRectanglesConfig,
} from "../../data/image_segmentation/initial_tool";

describe("Image - Initial tool", () => {
  it("should be set from the first avaliable tool in the config - rectangle", () => {
    LabelStudio.params().config(imageWithRectanglesConfig).data(imageData).withResult([]).init();
    LabelStudio.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("RectangleTool");
    });
  });

  it("should be set from the first avaliable tool in the config - brush", () => {
    LabelStudio.params().config(imageWithBrushConfig).data(imageData).withResult([]).init();
    LabelStudio.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("BrushTool");
    });
  });

  it("should select first tool as default", () => {
    LabelStudio.params().config(imageWithBothToolsConfig).data(imageData).withResult([]).init();
    LabelStudio.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("RectangleTool");
    });
  });

  it("should be able to init tool from preserved state", () => {
    LabelStudio.params()
      .config(imageWithBothToolsConfig)
      .data(imageData)
      .withResult([])
      .localStorageItems({
        "selected-tool:image": "BrushTool",
      })
      .init();
    LabelStudio.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("BrushTool");
    });
  });

  it("should ignore preserved state in case if tool do not exist", () => {
    LabelStudio.params()
      .config(imageWithRectanglesConfig)
      .data(imageData)
      .withResult([])
      .localStorageItems({
        "selected-tool:image": "BrushTool",
      })
      .init();
    LabelStudio.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("RectangleTool");
    });
  });
});
