import { ConfigurationError } from "../utils/errors";

interface ObjectTag {
  name: string;
}

interface CustomTag<ViewTag = unknown> {
  tag: string;
  isObject?: boolean;
  model: ObjectTag;
  description?: string;
  view: React.ComponentType<ViewTag>;
  detector?: (value: object) => boolean;
  resultName?: string;
  result?: any;
  region?: {
    name: string;
    nodeView: {
      name: string;
      icon: any;
      getContent?: (node: any) => JSX.Element | null;
      fullContent?: (node: any) => JSX.Element | null;
    };
  };
}

/**
 * Class for register View
 */
class _Registry {
  tags: any[] = [];
  customTags: CustomTag[] = [];
  models: Record<string, any> = {};
  views: Record<string, any> = {};
  regions: any[] = [];
  objects: any[] = [];
  // list of available areas per object type
  areas = new Map();

  // Map of models to views (ImageModel => HtxImage)
  views_models: Record<string, any> = {};

  tools: Record<string, any> = {};

  perRegionViews: Record<string, any> = {};

  addTag(tag: string | number, model: { name: string | number }, view: JSX.Element) {
    this.tags.push(tag);
    this.models[tag] = model;
    this.views[tag] = view;
    this.views_models[model.name] = view;
  }

  addRegionType(type: { detectByValue: any }, object: any, detector: any) {
    this.regions.push(type);
    if (detector) type.detectByValue = detector;
    const areas = this.areas.get(object);

    if (areas) areas.push(type);
    else this.areas.set(object, [type]);
  }

  regionTypes() {
    return this.regions;
  }

  addObjectType(type: any) {
    this.objects.push(type);
  }

  objectTypes() {
    return this.objects;
  }

  modelsArr() {
    return Object.values(this.models);
  }

  getViewByModel(modelName: string) {
    const view = this.views_models[modelName];

    if (!view) throw new Error(`No view for model: ${modelName}`);

    return view;
  }

  getViewByTag(tag: string | number) {
    return this.views[tag];
  }

  getAvailableAreas(object: any, value: any) {
    const available = this.areas.get(object);

    if (!available) return [];
    if (value) {
      for (const model of available) {
        if (model.detectByValue && model.detectByValue(value)) return [model];
      }
    }
    return available.filter((a: { detectByValue: any }) => !a.detectByValue);
  }

  getTool(name: string) {
    const model = this.tools[name];

    if (!model) {
      const models = Object.keys(this.tools);

      throw new Error(`No model registered for tool: ${name}\nAvailable models:\n\t${models.join("\n\t")}`);
    }

    return model;
  }

  /**
   * Get model
   * @param {string} tag
   * @return {import("mobx-state-tree").IModelType}
   */
  getModelByTag(tag: string) {
    const model = this.models[tag];

    if (!model) {
      const models = Object.keys(this.models);

      throw new ConfigurationError(`No model registered for tag: ${tag}\nAvailable models:\n\t${models.join("\n\t")}`);
    }

    return model;
  }

  addPerRegionView(tag: string | number, mode: string | number, view: any) {
    const tagViews = this.perRegionViews[tag] || {};

    tagViews[mode] = view;
    this.perRegionViews[tag] = tagViews;
  }

  getPerRegionView(tag: string | number, mode: string | number) {
    return this.perRegionViews[tag]?.[mode];
  }

  addCustomTag<ViewTag = unknown>(tag: string, definition: CustomTag<ViewTag>) {
    this.addTag(tag.toLowerCase(), definition.model, definition.view);
    if (definition.isObject) {
      this.addObjectType(definition.model);
    }
    if (definition.region) {
      this.addRegionType(definition.region, definition.model.name, definition.detector);
    }
    this.customTags.push(definition);
  }
}

const Registry = new _Registry();

Registry.getTool = Registry.getTool.bind(Registry);
Registry.getModelByTag = Registry.getModelByTag.bind(Registry);

export default Registry;
