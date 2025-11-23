import { Collapse, LabelStudio } from "@humansignal/frontend-test/helpers/LSF";
import {
  simpleData,
  basicCollapseConfig,
  nonAccordionCollapseConfig,
  borderedCollapseConfig,
  globalOpenCollapseConfig,
  mixedOpenCollapseConfig,
  globalOpenWithOverridesConfig,
  allParamsCollapseConfig,
} from "../../data/visual_tags/collapse";

describe("Visual Tags - Collapse", () => {
  describe("Basic functionality", () => {
    it("should render Collapse with default settings", () => {
      LabelStudio.params().config(basicCollapseConfig).data(simpleData).withResult([]).init();

      Collapse.root.should("be.visible");
      Collapse.panels.should("have.length", 3);

      // All panels should be collapsed by default
      Collapse.findPanel("Panel 1").should("be.visible");
      Collapse.findPanel("Panel 2").should("be.visible");
      Collapse.findPanel("Panel 3").should("be.visible");

      // Content should not be visible initially
      cy.contains("Content for panel 1").should("not.be.visible");
      cy.contains("Content for panel 2").should("not.be.visible");
      cy.contains("Content for panel 3").should("not.be.visible");
    });

    it("should expand and collapse panels on click", () => {
      LabelStudio.params().config(basicCollapseConfig).data(simpleData).withResult([]).init();

      // Check that no panels are active initially
      cy.get(".ant-collapse-content-active").should("have.length", 0);

      // Click to expand first panel
      Collapse.findTab("Panel 1").click();
      cy.get(".ant-collapse-content-active").should("have.length", 1);
      cy.contains("Content for panel 1").should("be.visible");

      // Click to collapse first panel
      Collapse.findTab("Panel 1").click();

      cy.get(".ant-collapse-content-active").should("have.length", 0);
      cy.contains("Content for panel 1").should("not.be.visible");

      // Click to expand second panel
      Collapse.findTab("Panel 2").click();
      cy.get(".ant-collapse-content-active").should("have.length", 1);
      cy.contains("Content for panel 2").should("be.visible");

      // First panel should still be collapsed (accordion mode)
      cy.contains("Content for panel 1").should("not.be.visible");
    });
  });

  describe("Accordion mode", () => {
    it("should work in accordion mode by default (only one panel open at a time)", () => {
      LabelStudio.params().config(basicCollapseConfig).data(simpleData).withResult([]).init();

      // Open first panel
      Collapse.findPanel("Panel 1").click();
      cy.get(".ant-collapse-content-active").should("have.length", 1);
      cy.contains("Content for panel 1").should("be.visible");
      cy.contains("Content for panel 2").should("not.be.visible");
      cy.contains("Content for panel 3").should("not.be.visible");

      // Open second panel - first should close
      Collapse.findPanel("Panel 2").click();
      cy.get(".ant-collapse-content-active").should("have.length", 1);
      cy.contains("Content for panel 1").should("not.be.visible");
      cy.contains("Content for panel 2").should("be.visible");
      cy.contains("Content for panel 3").should("not.be.visible");

      // Open third panel - second should close
      Collapse.findPanel("Panel 3").click();
      cy.get(".ant-collapse-content-active").should("have.length", 1);
      cy.contains("Content for panel 1").should("not.be.visible");
      cy.contains("Content for panel 2").should("not.be.visible");
      cy.contains("Content for panel 3").should("be.visible");
    });

    it("should allow multiple panels open when accordion=false", () => {
      LabelStudio.params().config(nonAccordionCollapseConfig).data(simpleData).withResult([]).init();

      // Open first panel
      Collapse.findPanel("Panel 1").click();
      cy.get(".ant-collapse-content-active").should("have.length", 1);
      cy.contains("Content for panel 1").should("be.visible");

      // Open second panel - first should remain open
      Collapse.findPanel("Panel 2").click();
      cy.get(".ant-collapse-content-active").should("have.length", 2);
      cy.contains("Content for panel 1").should("be.visible");
      cy.contains("Content for panel 2").should("be.visible");

      // Open third panel - all should be open
      Collapse.findPanel("Panel 3").click();
      cy.get(".ant-collapse-content-active").should("have.length", 3);
      cy.contains("Content for panel 1").should("be.visible");
      cy.contains("Content for panel 2").should("be.visible");
      cy.contains("Content for panel 3").should("be.visible");
    });
  });

  describe("Bordered style", () => {
    it("should show borders when bordered=true", () => {
      LabelStudio.params().config(borderedCollapseConfig).data(simpleData).withResult([]).init();

      // When bordered=true, should have borders (default ant-collapse class has borders)
      Collapse.root.should("not.have.class", "ant-collapse-borderless");
    });

    it("should not show borders by default", () => {
      LabelStudio.params().config(basicCollapseConfig).data(simpleData).withResult([]).init();

      // When bordered=false (default), should have borderless class
      Collapse.root.should("have.class", "ant-collapse-borderless");
    });
  });

  describe("Open parameter behavior", () => {
    it("should open all panels when global open=true", () => {
      LabelStudio.params().config(globalOpenCollapseConfig).data(simpleData).withResult([]).init();

      // Wait for the component to render
      cy.get(".ant-collapse").should("be.visible");

      // Check if panels are open by looking for active class
      cy.get(".ant-collapse-content").should("have.length", 3);
    });

    it("should respect panel-level open overrides", () => {
      LabelStudio.params().config(mixedOpenCollapseConfig).data(simpleData).withResult([]).init();

      // Wait for the component to render
      cy.get(".ant-collapse").should("be.visible");

      // Check if correct panels are open
      cy.get(".ant-collapse-content").should("have.length", 3);
      cy.get(".ant-collapse-content-active").should("have.length", 2);
    });

    it("should allow panels to override global open=true", () => {
      LabelStudio.params().config(globalOpenWithOverridesConfig).data(simpleData).withResult([]).init();

      // Wait for the component to render
      cy.get(".ant-collapse").should("be.visible");

      // Check if correct panels are open
      cy.get(".ant-collapse-content").should("have.length", 3);
      cy.get(".ant-collapse-content-active").should("have.length", 1);
    });
  });

  describe("All parameters combined", () => {
    it("should work with all parameters set together", () => {
      LabelStudio.params().config(allParamsCollapseConfig).data(simpleData).withResult([]).init();

      // Wait for the component to render
      cy.get(".ant-collapse").should("be.visible");

      // Should have bordered style
      Collapse.root.should("not.have.class", "ant-collapse-borderless");

      // Global open=true, but some panels override
      cy.contains("Content for panel 1").should("not.be.visible"); // Panel 1: open=false
      cy.contains("Content for panel 2").should("be.visible"); // Panel 2: no override, uses global
      cy.contains("Content for panel 3").should("not.be.visible"); // Panel 3: open=false

      // Should allow multiple panels open (accordion=false)
      cy.get(".ant-collapse-header").contains("Panel 1").click();
      cy.contains("Content for panel 1").should("be.visible");
      cy.contains("Content for panel 2").should("be.visible"); // Still open

      cy.get(".ant-collapse-header").contains("Panel 3").click();
      cy.contains("Content for panel 3").should("be.visible");
      // All panels should be open now
      cy.contains("Content for panel 1").should("be.visible");
      cy.contains("Content for panel 2").should("be.visible");
      cy.contains("Content for panel 3").should("be.visible");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty panels", () => {
      const emptyPanelConfig = `
        <View>
          <Collapse>
            <Panel value="Empty Panel">
            </Panel>
            <Panel value="Panel with Content">
              <Text name="text" value="Some content" />
            </Panel>
          </Collapse>
        </View>
      `;

      LabelStudio.params().config(emptyPanelConfig).data(simpleData).withResult([]).init();

      Collapse.findPanel("Empty Panel").should("be.visible");
      Collapse.findPanel("Panel with Content").should("be.visible");

      // Empty panel should still be clickable
      Collapse.findPanel("Empty Panel").click();
      // Should not throw errors
    });

    it("should handle panels with only whitespace content", () => {
      const whitespaceConfig = `
        <View>
          <Collapse>
            <Panel value="Whitespace Panel">
              <Text name="text" value="   " />
            </Panel>
          </Collapse>
        </View>
      `;

      LabelStudio.params().config(whitespaceConfig).data(simpleData).withResult([]).init();

      Collapse.findPanel("Whitespace Panel").should("be.visible");
      Collapse.findPanel("Whitespace Panel").click();
      // Should not throw errors
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      LabelStudio.params().config(basicCollapseConfig).data(simpleData).withResult([]).init();

      // Check that collapse headers have proper role
      Collapse.panels.each(($panel) => {
        cy.wrap($panel).find(".ant-collapse-header").should("have.attr", "role", "tab");
      });
    });
  });
});
