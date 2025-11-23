import { LabelStudio } from "@humansignal/frontend-test/helpers/LSF/LabelStudio";
import { FF_DEV_3873 } from "../../../../editor/src/utils/feature-flags";

export const ToolBar = {
  _controlsSelector: ".lsf-controls",

  get sectionOne() {
    return cy.get(".lsf-topbar").find(".lsf-topbar__group").eq(0);
  },

  get sectionTwo() {
    return LabelStudio.getFeatureFlag(FF_DEV_3873).then((isFFDEV3873) => {
      if (isFFDEV3873) {
        return cy.get(".lsf-bottombar");
      }

      return cy.get(".lsf-topbar");
    });
  },

  get controls() {
    return this.sectionTwo.find(this._controlsSelector);
  },

  get controlButtons() {
    return this.controls.find("button");
  },

  get viewAllBtn() {
    return this.sectionOne.find('[aria-label="Compare all annotations"]');
  },

  get submitBtn() {
    return this.sectionTwo.find('[aria-label="Submit current annotation"]');
  },

  get updateBtn() {
    return this.sectionTwo.find('[aria-label="Update current annotation"]');
  },

  get annotationDropdownTrigger() {
    return this.sectionOne.find(".lsf-annotation-button__trigger");
  },

  get dropdownMenu() {
    return cy.get(".lsf-dropdown");
  },

  clickCopyAnnotationBtn() {
    return LabelStudio.getFeatureFlag(FF_DEV_3873).then((isFFDEV3873) => {
      if (isFFDEV3873) {
        this.annotationDropdownTrigger.click();
        this.dropdownMenu.find('[class*="option--"]').contains("Duplicate Annotation").click();
        return void 0;
      }

      this.sectionOne.find('[aria-label="Copy Annotation"]').click();
    });
  },
};
