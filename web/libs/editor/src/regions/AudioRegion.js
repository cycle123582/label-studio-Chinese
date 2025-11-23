import { types } from "mobx-state-tree";

import NormalizationMixin from "../mixins/Normalization";
import RegionsMixin from "../mixins/Regions";
import { AreaMixin } from "../mixins/AreaMixin";
import Registry from "../core/Registry";

import { AudioRegionModel as _audioRegionModel } from "./AudioRegion/AudioRegionModel";
import { EditableRegion } from "./EditableRegion";

// this type is used in auto-generated documentation
/**
 * @example
 * {
 *   "original_length": 18,
 *   "value": {
 *     "start": 3.1,
 *     "end": 8.2,
 *     "channel": 0,
 *     "labels": ["Voice"]
 *   }
 * }
 * @typedef {Object} AudioRegionResult
 * @property {number} original_length length of the original audio (seconds)
 * @property {Object} value
 * @property {number} value.start start time of the fragment (seconds)
 * @property {number} value.end end time of the fragment (seconds)
 * @property {number} value.channel channel identifier which was targeted
 */

const EditableAudioModel = types.model("EditableAudioModel", {}).volatile(() => ({
  editableFields: [
    { property: "start", label: "Start" },
    { property: "end", label: "End" },
  ],
}));

const _exportAudioRegion = types.compose(
  "AudioRegionModel",
  RegionsMixin,
  AreaMixin,
  NormalizationMixin,
  EditableRegion,
  EditableAudioModel,
  _audioRegionModel,
);

Registry.addRegionType(_exportAudioRegion, "audioplus");
Registry.addRegionType(_exportAudioRegion, "audio");

export { _exportAudioRegion as AudioRegionModel };
