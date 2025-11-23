import { types } from "mobx-state-tree";

import Registry from "../../core/Registry";
import ControlBase from "./Base";
import { AnnotationMixin } from "../../mixins/AnnotationMixin";
import SeparatedControlMixin from "../../mixins/SeparatedControlMixin";
import { ToolManagerMixin } from "../../mixins/ToolManagerMixin";

/*
 * The `Bitmask` tag for pixel-wise image segmentation tasks is used in the area where you want to apply a mask or use a brush to draw a region on the image.
 *
 * `Bitmask` operates on pixel level and outputs a Base64 encoded PNG data URL image with black pixels on transparent background.
 *
 * Export data example: `data-url:image/png;[base64-encoded-string]`
 *
 * **Note:** You need to set `smoothing="false"` on the Image tag to be able to work with individual pixels;
 *
 *  <video class="Video astro-OQEP7KKB" loop="" playsinline="" autoplay="" muted="">
 *    <source src="https://cdn.sanity.io/files/mzff2hy8/production/4812f66851a7fd4836e729bc7ccb7e510823af5d.mp4" type="video/mp4" class="astro-OQEP7KKB">
 *  </video>
 *
 * Use with the following data types: image.
 * @example
 * <!--Basic image segmentation labeling configuration:-->
 * <View>
 *   <Bitmask name="labels" toName="image">
 *     <Label value="Person" />
 *     <Label value="Animal" />
 *   </Bitmask>
 *   <Image name="image" value="$image" />
 * </View>
 * @name Bitmask
 * @regions BitmaskRegion
 * @meta_title Bitmask Tag for Image Segmentation Labeling
 * @meta_description Customize Label Studio with bitmask tags for image segmentation labeling for machine learning and data science projects.
 * @param {string} name                      - Name of the element
 * @param {string} toName                    - Name of the image to label
 * @param {single|multiple=} [choice=single] - Configure whether the data labeler can select one or multiple labels
 * @param {number} [maxUsages]               - Maximum number of times a label can be used per task
 * @param {boolean} [showInline=true]        - Show labels in the same visual line
 * @param {boolean} [smart]                  - Show smart tool for interactive pre-annotations
 * @param {boolean} [smartOnly]              - Only show smart tool for interactive pre-annotations
 */

const TagAttrs = types.model({
  toname: types.maybeNull(types.string),
  strokewidth: types.optional(types.string, "15"),
});

const Model = types
  .model({
    type: "bitmask",
    removeDuplicatesNamed: "BitmaskErase",
  })
  .views((self) => ({
    get hasStates() {
      const states = self.states();

      return states && states.length > 0;
    },
  }))
  .volatile(() => ({
    toolNames: ["Bitmask", "BitmaskErase"],
  }));

const BitmaskModel = types.compose(
  "BitmaskModel",
  ControlBase,
  AnnotationMixin,
  SeparatedControlMixin,
  TagAttrs,
  Model,
  ToolManagerMixin,
);

const HtxView = () => {
  return null;
};

Registry.addTag("bitmask", BitmaskModel, HtxView);

export { HtxView, BitmaskModel };
