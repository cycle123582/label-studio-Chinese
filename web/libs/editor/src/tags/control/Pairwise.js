import { types } from "mobx-state-tree";

import InfoModal from "../../components/Infomodal/Infomodal";
import Registry from "../../core/Registry";
import Tree from "../../core/Tree";
import { AnnotationMixin } from "../../mixins/AnnotationMixin";
import ControlBase from "./Base";

/**
 * The `Pairwise` tag is used to compare two different objects and select one item from the list. If you want annotators to compare two objects and determine whether they are similar or not, use the `Choices` tag.
 *
 * Use with the following data types: audio, image, HTML, paragraphs, text, time series, video.
 * @example
 * <!--Basic labeling configuration to compare two passages of text -->
 * <View>
 *   <Header value="Select the more accurate summary"/>
 *   <Pairwise name="pairwise" leftClass="text1" rightClass="text2" toName="txt-1,txt-2"></Pairwise>
 *   <Text name="txt-1" value="Text 1" />
 *   <Text name="txt-2" value="Text 2" />
 * </View>
 * @example
 * <!-- You can also style the appearance using the View tag: -->
 * <View>
 *   <Pairwise name="pw" toName="txt-1,txt-2"></Pairwise>
 *   <View style="display: flex;">
 *     <View style="margin-right: 1em;"><Text name="txt-1" value="$text1" /></View>
 *     <View><Text name="txt-2" value="$text2" /></View>
 *   </View>
 * </View>
 * @name Pairwise
 * @meta_title Pairwise Tag to Compare Objects
 * @meta_description Customize Label Studio with the Pairwise tag for object comparison tasks for machine learning and data science projects.
 * @param {string} name               - Name of the element
 * @param {string} toName             - Comma-separated names of the elements you want to compare
 * @param {string} [selectionStyle]   - Style for the selection
 * @params {string} [leftClass=left]  - Class name of the left object
 * @params {string} [rightClass=left] - Class name of the right object
 */
const TagAttrs = types.model({
  toname: types.maybeNull(types.string),
  selectionstyle: types.maybeNull(types.string),
  leftclass: types.maybeNull(types.string),
  rightclass: types.maybeNull(types.string),
});

const Model = types
  .model({
    type: "pairwise",
    selected: types.maybeNull(types.enumeration(["left", "right", "none"])),
  })
  .views((self) => ({
    get names() {
      return self.toname.split(",");
    },

    get left() {
      if (!self.annotation || !self.annotation.names) return undefined;
      return self.annotation.names.get(self.names[0]);
    },

    get right() {
      if (!self.annotation || !self.annotation.names) return undefined;
      return self.annotation.names.get(self.names[1]);
    },

    get valueType() {
      return "selected";
    },
  }))
  .actions((self) => ({
    updateResult() {
      const { result, selected } = self;

      if (selected === "none") {
        if (result) result.area.removeResult(result);
      } else {
        if (result) result.setValue(selected);
        else {
          self.annotation.createResult({}, { selected }, self, self.name);
        }
      }
    },

    setResult(dir = "none") {
      self.selected = dir;
      if (!self.left || !self.right) {
        // eslint-disable-next-line no-console
        console.warn("Pairwise: left or right object reference is missing. Check toName and config.", {
          left: self.left,
          right: self.right,
        });
        return;
      }
      // Common interactive classes
      const interactive = "cursor-pointer hover:bg-primary-emphasis-subtle transition-colors rounded-sm";
      if (self._selectionType === "className") {
        self.left.addProp(
          "className",
          dir === "left" ? `${interactive} ${self._selection}` : `${interactive} border border-transparent`,
        );
        self.right.addProp(
          "className",
          dir === "right" ? `${interactive} ${self._selection}` : `${interactive} border border-transparent`,
        );
        self.left.addProp("style", {});
        self.right.addProp("style", {});
      } else {
        self.left.addProp(
          "style",
          dir === "left" ? self._selection : { border: "1px solid transparent", borderRadius: "0.125rem" },
        );
        self.right.addProp(
          "style",
          dir === "right" ? self._selection : { border: "1px solid transparent", borderRadius: "0.125rem" },
        );
        self.left.addProp("className", interactive);
        self.right.addProp("className", interactive);
      }
    },

    selectLeft() {
      self.setResult(self.selected === "left" ? "none" : "left");
      self.updateResult();
    },

    selectRight() {
      self.setResult(self.selected === "right" ? "none" : "right");
      self.updateResult();
    },

    afterCreate() {
      if (self.names.length !== 2 || self.names[0] === self.names[1]) {
        InfoModal.error("Incorrect toName parameter on Pairwise, must be two names separated by a comma: name1,name2");
      }

      // If selectionstyle is provided, use inline style for backward compatibility.
      // Otherwise, use Tailwind semantic classes for selection via className.
      let selection;
      if (self.selectionstyle) {
        const s = Tree.cssConverter(self.selectionstyle);
        selection = {};
        for (const key in s) {
          selection[key] = s[key];
        }
        self._selectionType = "style";
      } else {
        // Use semantic Tailwind classes for primary/selected state
        // See: label-studio/web/libs/ui/src/tokens/tokens.js
        selection = "bg-primary-background border border-primary-border-subtle rounded-sm";
        self._selectionType = "className";
      }
      self._selection = selection;
    },

    needsUpdate() {
      if (self.result) self.setResult(self.result.value.selected);
      else self.setResult();
    },

    annotationAttached() {
      // @todo annotation attached in a weird way, so do that next tick, with fixed tree
      setTimeout(() => {
        if (!self.left || !self.right) return;
        self.left.addProp("onClick", self.selectLeft);
        self.right.addProp("onClick", self.selectRight);
        self.setResult(self.result?.value.selected);
      });
    },
  }));

const PairwiseModel = types.compose("PairwiseModel", ControlBase, TagAttrs, Model, AnnotationMixin);

const HtxPairwise = () => {
  return null;
};

Registry.addTag("pairwise", PairwiseModel, HtxPairwise);
Registry.addObjectType(PairwiseModel);

export { HtxPairwise, PairwiseModel };
