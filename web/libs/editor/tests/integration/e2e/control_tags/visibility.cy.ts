import { useChoices, LabelStudio, Textarea, ImageView, Sidebar, Choices } from "@humansignal/frontend-test/helpers/LSF";
import {
  multipleChainedViewsVisibilityConfig,
  perRegionVisibilityConfig,
  perRegionVisibilityResult,
  simpleVisibleWhenVisibilityConfig,
  textareaVisibilityConfig,
  visibilityImageData,
  visibilityTextData,
} from "../../data/control_tags/visibility";

const checkVisibility = (visibleIndexes: number[], totalIndexes: number) => {
  Array.from({ length: totalIndexes }).forEach((_, i) => {
    cy.get(`.lsf-choices:eq(${i})`).should(visibleIndexes.includes(i) ? "be.visible" : "not.be.visible");
  });
};

describe("Visibility", () => {
  it("Ensure correct visibility of conditionally selected choices", () => {
    LabelStudio.params().config(simpleVisibleWhenVisibilityConfig).data(visibilityTextData).withResult([]).init();

    const l1Choice = useChoices("&:eq(0)");
    const l2Choice = useChoices("&:eq(1)");
    const l3Choice = useChoices("&:eq(2)");
    checkVisibility([0], 3);

    l1Choice.findChoice("1A").click();
    checkVisibility([0, 1], 3);

    l2Choice.findChoice("2A").click();
    l3Choice.findChoice("3A").click();
    checkVisibility([0, 1, 2], 3);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(3);
      const expected = [
        { from_name: "level1", value: { choices: ["1A"] } },
        { from_name: "level2", value: { choices: ["2A"] } },
        { from_name: "level3", value: { choices: ["3A"] } },
      ];
      expected.forEach((item, index) => {
        expect(result[index]).to.deep.include(item);
      });
    });

    l1Choice.findChoice("1A").click();
    checkVisibility([0], 3);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(0);
    });

    l1Choice.findChoice("1B").click();
    checkVisibility([0], 3);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.deep.include({ from_name: "level1", value: { choices: ["1B"] } });
    });
  });

  it("Ensure correct visibility of conditionally selected choices with parent visibility restrictions", () => {
    LabelStudio.params().config(multipleChainedViewsVisibilityConfig).data(visibilityTextData).withResult([]).init();

    const l1Choice = useChoices("&:eq(0)");
    const l2Choice = useChoices("&:eq(1)");
    const l3AChoice = useChoices("&:eq(2)");
    checkVisibility([0], 4);

    l1Choice.findChoice("1A").click();
    checkVisibility([0, 1], 4);

    l2Choice.findChoice("2A").click();
    checkVisibility([0, 1, 2], 4);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(2);

      const expected = [
        { from_name: "level1", value: { choices: ["1A"] } },
        { from_name: "level2", value: { choices: ["2A"] } },
      ];

      expected.forEach((item, index) => {
        expect(result[index]).to.deep.include(item);
      });
    });

    l3AChoice.findChoice("3X").click();
    checkVisibility([0, 1, 2], 4);

    l1Choice.findChoice("1A").click();
    checkVisibility([0], 4);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(0);
    });
  });

  it("Ensure correct visibility of conditionally selected and submitted textarea", () => {
    LabelStudio.params().config(textareaVisibilityConfig).data(visibilityTextData).withResult([]).init();

    const l1Choice = useChoices("&:eq(0)");
    checkVisibility([0], 1);

    l1Choice.findChoice("choice1").click();

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.deep.include({ from_name: "author", value: { choices: ["choice1"] } });
    });

    Textarea.type("text1{enter}");

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(2);

      const expected = [
        { from_name: "author", value: { choices: ["choice1"] } },
        { from_name: "new_author", value: { text: ["text1"] } },
      ];

      expected.forEach((item, index) => {
        expect(result[index]).to.deep.include(item);
      });
    });

    l1Choice.findChoice("choice1").click();
    checkVisibility([0], 1);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(0);
    });
  });

  it("Ensure correct visibility and data submission of simple perRegion controls", () => {
    LabelStudio.params()
      .config(perRegionVisibilityConfig)
      .data(visibilityImageData)
      .withResult(perRegionVisibilityResult)
      .init();

    ImageView.waitForImage();

    Sidebar.hasRegions(1);
    Sidebar.toggleRegionSelection(0);
    Sidebar.hasSelectedRegions(1);

    Choices.findChoice("Benign").click();

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(2);

      const expected = [
        { from_name: "label", value: { rectanglelabels: ["Tumor"] } },
        { from_name: "classification", value: { choices: ["Benign"] } },
      ];

      expected.forEach((item, index) => {
        expect(result[index]).to.include({ from_name: item.from_name });
        expect(result[index].value).to.deep.include(item.value);
      });
    });

    ImageView.clickAtRelative(0.5, 0.5);
    Sidebar.hasSelectedRegions(0);

    LabelStudio.serialize().then((result) => {
      expect(result).to.have.lengthOf(2);

      const expected = [
        { from_name: "label", value: { rectanglelabels: ["Tumor"] } },
        { from_name: "classification", value: { choices: ["Benign"] } },
      ];

      expected.forEach((item, index) => {
        expect(result[index]).to.include({ from_name: item.from_name });
        expect(result[index].value).to.deep.include(item.value);
      });
    });
  });
});
