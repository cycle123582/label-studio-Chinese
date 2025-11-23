// Get the feature flags from the root feature_flags.json file
import rawFeatureFlags from "../../../../../label_studio/feature_flags.json";

// Embed the feature flags in the playground app
const embedFeatureFlags = () => {
  // @ts-ignore
  window.FEATURE_FLAGS = window.FEATURE_FLAGS ?? {};
  const featureFlags = JSON.parse(JSON.stringify(rawFeatureFlags));

  for (const flag of Object.values(featureFlags.flags)) {
    // @ts-ignore
    window.FEATURE_FLAGS[flag.key] = flag.on;
  }
};

embedFeatureFlags();
