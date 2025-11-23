import Registry from "../../../core/Registry";
import { AudioModel } from "./model";
import { Audio as HtxAudio } from "./view";
import { AudioRegionModel } from "../../../regions/AudioRegion";

Registry.addTag("audio", AudioModel, HtxAudio);
// @todo remove this once we have the ability to deprecate the old tag, for now allow the alias
Registry.addTag("audioplus", AudioModel, HtxAudio);
Registry.addObjectType(AudioModel);

export { AudioRegionModel, AudioModel, HtxAudio };
