import { LabelStudio } from "@humansignal/frontend-test/helpers/LSF";
import { allLabelsEmptyConfig, allLabelsEmptyData, resultWithNotExistedLabels } from "../../data/config/empty-labels";

describe("Empty labels", () => {
  it("Should retain labels that are not explicitly defined in the configuration", () => {
    LabelStudio.params()
      .config(allLabelsEmptyConfig)
      .data(allLabelsEmptyData)
      .withResult(resultWithNotExistedLabels)
      .init();

    LabelStudio.waitForObjectsReady();

    LabelStudio.serialize().then((results) => {
      const length = results.length;
      expect(length).to.equal(resultWithNotExistedLabels.length);

      for (let i = 0; i < length; i++) {
        const result = results[i];
        const type = result.type;
        expect(result.value[type]).to.deep.equal(resultWithNotExistedLabels[i].value[type]);
      }
    });
  });
});
