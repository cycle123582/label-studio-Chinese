// web/src/pages/Projects/Config/Config.js (已汉化修改)

import React, { useEffect, useMemo, useState } from "react";
import CM from "codemirror";
import { Button, cnm } from "@humansignal/ui";
import { IconTrash } from "@humansignal/icons";
import { ToggleItems } from "../../../components";
import { Form, Input } from "../../../components/Form";
import { useAPI } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";
import { Palette } from "../../../utils/colors";
import { FF_UNSAVED_CHANGES, isFF } from "../../../utils/feature-flags";
import { colorNames } from "./colors";
import "./Config.scss";
import { Preview } from "./Preview";
import { DEFAULT_COLUMN, EMPTY_CONFIG, isEmptyConfig, Template } from "./Template";
import { TemplatesList } from "./TemplatesList";

import tags from "@humansignal/core/lib/utils/schema/tags.json";
import { UnsavedChanges } from "./UnsavedChanges";
import { Checkbox, CodeEditor, Select } from "@humansignal/ui";
import snakeCase from "lodash/snakeCase";
import { useTranslation } from "react-i18next"; // <-- 已添加: 导入 i18next Hook

const wizardClass = cn("wizard");
const configClass = cn("configure");

const EmptyConfigPlaceholder = () => {
  const { t } = useTranslation(); // <-- 已添加
  return (
    <div className={configClass.elem("empty-config")}>
      <p>{t("pages.create_project.config.empty_config_1")}</p>
      <p>
        {t("pages.create_project.config.empty_config_2")}{" "}
        <a href="https://labelstud.io/tags/" target="_blank" rel="noreferrer">
          {t("pages.create_project.config.empty_config_3")}
        </a>
        .
      </p>
    </div>
  );
};

const Label = ({ label, template, color }) => {
  const { t } = useTranslation(); // <-- 已添加
  const value = label.getAttribute("value");

  return (
    <li
      className={cnm(
        configClass
          .elem("label")
          .mod({ choice: label.tagName === "Choice" })
          .toClassName(),
        "group",
      )}
    >
      <span className={cnm(configClass.elem("label-text").toClassName(), "flex")}>
        <label style={{ background: color }}>
          <Input
            type="color"
            className={configClass.elem("label-color")}
            value={colorNames[color] || color}
            onChange={(e) => template.changeLabel(label, { background: e.target.value })}
          />
        </label>
        <span>{value}</span>
      </span>
      <Button
        type="button"
        look="string"
        size="smaller"
        variant="negative"
        onClick={() => template.removeLabel(label)}
        aria-label={t("delete_label", "delete label")} // <-- 已修改
        className="hidden !p-0 z-10 absolute right-0 [&_span]:!p-0 group-hover:inline-flex"
        leading={<IconTrash className="w-4 h-4 fill-[currentColor]" />}
      />
    </li>
  );
};

const ConfigureControl = ({ control, template }) => {
  const { t } = useTranslation(); // <-- 已添加
  const refLabels = React.useRef();
  const tagname = control.tagName;

  if (tagname !== "Choices" && !tagname.endsWith("Labels")) return null;
  const palette = Palette();

  const onAddLabels = () => {
    if (!refLabels.current) return;
    template.addLabels(control, refLabels.current.value);
    refLabels.current.value = "";
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onAddLabels();
    }
  };

  const isChoices = tagname === "Choices";
  return (
    <div className={configClass.elem("labels")}>
      <form className={configClass.elem("add-labels")} action="">
        <h4>{isChoices ? t("pages.create_project.config.add_choices") : t("pages.create_project.config.add_label_names")}</h4>
        <span>{t("pages.create_project.config.add_labels_hint")}</span>
        <textarea
          name="labels"
          id=""
          cols="50"
          rows="5"
          ref={refLabels}
          onKeyPress={onKeyPress}
          className="lsf-textarea-ls p-2 px-3"
        />
        <Button
          type="button"
          size="small"
          look="outlined"
          onClick={onAddLabels}
          aria-label={t("pages.create_project.config.add")}
        >
          {t("pages.create_project.config.add")}
        </Button>
      </form>
      <div className={configClass.elem("current-labels")}>
        <h3>
          {isChoices ? t("pages.create_project.config.choices") : t("pages.create_project.config.labels")} (
          {control.children.length})
        </h3>
        <ul>
          {Array.from(control.children).map((label) => (
            <Label
              label={label}
              template={template}
              key={label.getAttribute("value")}
              color={label.getAttribute("background") || palette.next().value}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const ConfigureSettings = ({ template }) => {
  const { t } = useTranslation(); // <-- 已添加
  const { settings } = template;
  if (!settings) return null;
  const keys = Object.keys(settings);
  const items = keys.map((key) => {
    const options = settings[key];
    const type = Array.isArray(options.type) ? Array : options.type;
    const $object = options.object;
    const $tag = options.control ? options.control : $object;
    if (!$tag) return null;
    if (options.when && !options.when($tag)) return;
    let value = false;
    if (options.value) value = options.value($tag);
    else if (typeof options.param === "string") value = $tag.getAttribute(options.param);
    if (value === "true") value = true;
    if (value === "false") value = false;
    let onChange;
    let size;
    switch (type) {
      case Array:
        onChange = (val) => {
          if (typeof options.param === "function") options.param($tag, val);
          else $object.setAttribute(options.param, val);
          template.render();
        };
        return (
          <li key={key}>
            <Select
              triggerClassName="border"
              value={value}
              onChange={onChange}
              options={options.type}
              label={options.title}
              isInline={true}
              dataTestid={`select-trigger-${options.title.replace(/\s+/g, "-").replace(":", "").toLowerCase()}-${value}`}
            />
          </li>
        );
      case Boolean:
        onChange = (e) => {
          if (typeof options.param === "function") options.param($tag, e.target.checked);
          else $object.setAttribute(options.param, e.target.checked ? "true" : "false");
          template.render();
        };
        return (
          <li key={key}>
            <Checkbox checked={value} onChange={onChange}>
              {options.title}
            </Checkbox>
          </li>
        );
      case String:
      case Number:
        size = options.type === Number ? 5 : undefined;
        onChange = (e) => {
          if (typeof options.param === "function") options.param($tag, e.target.value);
          else $object.setAttribute(options.param, e.target.value);
          template.render();
        };
        return (
          <li key={key}>
            <label>
              {options.title} <Input type="text" onInput={onChange} value={value} size={size} />
            </label>
          </li>
        );
    }
  });
  if (!items.filter(Boolean).length) return null;
  return (
    <ul className={configClass.elem("settings")}>
      <li>
        <h4>{t("pages.create_project.config.configure_settings")}</h4>
        <ul className={configClass.elem("object-settings")}>{items}</ul>
      </li>
    </ul>
  );
};

const ConfigureColumn = ({ template, obj, columns }) => {
  const { t } = useTranslation(); // <-- 已添加
  const valueAttr = obj.hasAttribute("valueList") ? "valueList" : "value";
  const value = obj.getAttribute(valueAttr)?.replace(/^\$/, "");
  const [isManual, setIsManual] = useState(!!value && !columns?.includes(value));
  const [newValue, setNewValue] = useState(`$${value}`);
  useEffect(() => setNewValue(`$${value}`), [value]);
  const updateValue = (value) => {
    const newValue = value.replace(/^\$/, "");
    obj.setAttribute(valueAttr, `$${newValue}`);
    template.render();
  };
  const selectValue = (value) => {
    if (value === "-") {
      setIsManual(true);
      return;
    }
    if (isManual) setIsManual(false);
    updateValue(value);
  };
  const handleChange = (e) => {
    const newValue = e.target.value.replace(/^\$/, "");
    setNewValue(`$${newValue}`);
  };
  const handleBlur = () => updateValue(newValue);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateValue(e.target.value);
    }
  };
  const columnsList = useMemo(() => {
    const cols = (columns ?? []).map((col) => {
      return {
        value: col,
        label: col === DEFAULT_COLUMN ? t("pages.create_project.config.imported_file") : `$${col}`,
      };
    });
    if (!columns?.length) cols.push({ value, label: t("pages.create_project.config.imported_file") });
    cols.push({ value: "-", label: t("pages.create_project.config.set_manually") });
    return cols;
  }, [columns, DEFAULT_COLUMN, value, t]);
  const objectName = obj.tagName.toLowerCase();
  const labelTextKey = columns?.length > 0 && columns[0] !== DEFAULT_COLUMN ? "use_from_field" : "use_from";
  return (
    <>
      <Select
        onChange={selectValue}
        value={isManual ? "-" : value}
        options={columnsList}
        isInline={true}
        label={
          <>
            {t(`pages.create_project.config.${labelTextKey}`, { object: objectName })}
            {template.objects > 1 && ` for ${obj.getAttribute("name")}`}
          </>
        }
        labelProps={{ className: "inline-flex" }}
        dataTestid={`select-trigger-use-image-from-field-${isManual ? "-" : value}`}
      />
      {isManual && <Input value={newValue} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} />}
    </>
  );
};

const ConfigureColumns = ({ columns, template }) => {
  const { t } = useTranslation(); // <-- 已添加
  if (!template.objects.length) return null;
  return (
    <div className={configClass.elem("object")}>
      <h4>{t("pages.create_project.config.configure_data")}</h4>
      {template.objects.length > 1 && columns?.length > 0 && columns.length < template.objects.length && (
        <p className={configClass.elem("object-error")}>{t("pages.create_project.config.template_requires_more_data")}</p>
      )}
      {columns?.length === 0 && (
        <p className={configClass.elem("object-error")}>{t("pages.create_project.config.select_fields_hint")}</p>
      )}
      {template.objects.map((obj) => (
        <ConfigureColumn key={obj.getAttribute("name")} {...{ obj, template, columns }} />
      ))}
    </div>
  );
};

const Configurator = ({
  columns,
  config,
  project,
  template,
  setTemplate,
  onBrowse,
  onSaveClick,
  onValidate,
  disableSaveButton,
  warning,
  hasChanges,
}) => {
  const { t } = useTranslation(); // <-- 已添加
  const [configure, setConfigure] = React.useState(isEmptyConfig(config) ? "code" : "visual");
  const [visualLoaded, loadVisual] = React.useState(configure === "visual");
  const [waiting, setWaiting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [configToCheck, setConfigToCheck] = React.useState();
  const [error, setError] = React.useState();
  const [parserError, setParserError] = React.useState();
  const [data, setData] = React.useState();
  const [loading, setLoading] = useState(false);
  const [configToDisplay, setConfigToDisplay] = React.useState(config);
  const debounceTimer = React.useRef();
  const api = useAPI();
  React.useEffect(() => {
    debounceTimer.current = window.setTimeout(() => setConfigToCheck(config), configToCheck ? 500 : 30);
    return () => window.clearTimeout(debounceTimer.current);
  }, [config]);
  React.useEffect(() => {
    const validate = async () => {
      if (!configToCheck) return;
      setLoading(true);
      const validation = await api.callApi("validateConfig", {
        params: { pk: project.id },
        body: { label_config: configToCheck },
        errorFilter: () => true,
      });
      if (validation?.error) {
        setError(validation.response);
        setLoading(false);
        return;
      }
      setError(null);
      onValidate?.(validation);
      const sample = await api.callApi("createSampleTask", {
        params: { pk: project.id },
        body: { label_config: configToCheck },
        errorFilter: () => true,
      });
      setLoading(false);
      if (sample && !sample.error) {
        setData(sample.sample_task);
        setConfigToDisplay(configToCheck);
      } else {
        setError(sample?.response);
      }
    };
    validate();
  }, [configToCheck]);
  const onSelect = (value) => {
    setConfigure(value);
    if (value === "visual") loadVisual(true);
  };
  const onChange = React.useCallback(
    (config) => {
      try {
        setParserError(null);
        setTemplate(config);
      } catch (e) {
        setParserError({
          detail: "Parser error",
          validation_errors: [e.message],
        });
      }
    },
    [setTemplate],
  );
  const onSave = async () => {
    setError(null);
    setWaiting(true);
    const res = await onSaveClick();
    setWaiting(false);
    if (res === true) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } else {
      setError(res);
    }
    return res;
  };
  function completeAfter(cm, pred) {
    if (!pred || pred()) {
      setTimeout(() => {
        if (!cm.state.completionActive) cm.showHint({ completeSingle: false });
      }, 100);
    }
    return CM.Pass;
  }
  function completeIfInTag(cm) {
    return completeAfter(cm, () => {
      const token = cm.getTokenAt(cm.getCursor());
      if (token.type === "string" && (!/['"]$/.test(token.string) || token.string.length === 1)) return false;
      const inner = CM.innerMode(cm.getMode(), token.state).state;
      return inner.tagName;
    });
  }
  const extra = (
    <p className={configClass.elem("tags-link")}>
      {t("pages.create_project.config.tags_description_1")}
      <br />
      <a href="https://labelstud.io/tags/" target="_blank" rel="noreferrer">
        {t("pages.create_project.config.tags_description_2")}
      </a>
      .
    </p>
  );

  return (
    <div className={configClass}>
      <div className={configClass.elem("container")}>
        <h1>
          {t("pages.create_project.config.title")}
          {hasChanges ? " *" : ""}
        </h1>
        <header>
          <Button
            type="button"
            data-leave={true}
            onClick={onBrowse}
            size="small"
            look="outlined"
            aria-label={t("pages.create_project.config.browse_templates")}
          >
            {t("pages.create_project.config.browse_templates")}
          </Button>
          <ToggleItems
            items={{
              code: t("pages.create_project.config.code"),
              visual: t("pages.create_project.config.visual"),
            }}
            active={configure}
            onSelect={onSelect}
          />
        </header>
        <div className={configClass.elem("editor")}>
          {configure === "code" && (
            <div className={configClass.elem("code")} style={{ display: configure === "code" ? undefined : "none" }}>
              <CodeEditor
                name="code"
                id="edit_code"
                value={config}
                autoCloseTags={true}
                smartIndent={true}
                detach
                border
                extensions={["hint", "xml-hint"]}
                options={{
                  mode: "xml",
                  theme: "default",
                  lineNumbers: true,
                  extraKeys: {
                    "'<'": completeAfter,
                    "' '": completeIfInTag,
                    "'='": completeIfInTag,
                    "Ctrl-Space": "autocomplete",
                  },
                  hintOptions: { schemaInfo: tags },
                }}
                onKeyDown={(editor, e) => {
                  if (e.code === "Escape") e.stopPropagation();
                }}
                onChange={(editor, data, value) => onChange(value)}
              />
            </div>
          )}
          {visualLoaded && (
            <div
              className={configClass.elem("visual")}
              style={{ display: configure === "visual" ? undefined : "none" }}
            >
              {isEmptyConfig(config) && <EmptyConfigPlaceholder />}
              <ConfigureColumns columns={columns} project={project} template={template} />
              {template.controls.map((control) => (
                <ConfigureControl control={control} template={template} key={control.getAttribute("name")} />
              ))}
              <ConfigureSettings template={template} />
            </div>
          )}
        </div>
        {disableSaveButton !== true && onSaveClick && (
          <Form.Actions size="small" extra={configure === "code" && extra} valid>
            {saved && (
              <div className={cn("form-indicator").toClassName()}>
                <span className={cn("form-indicator").elem("item").mod({ type: "success" }).toClassName()}>
                  {t("pages.create_project.config.saved")}
                </span>
              </div>
            )}
            <Button size="small" className="w-[120px]" onClick={onSave} waiting={waiting} aria-label={t("save")}>
              {waiting ? t("pages.create_project.config.saving") : t("save")}
            </Button>
            {isFF(FF_UNSAVED_CHANGES) && <UnsavedChanges hasChanges={hasChanges} onSave={onSave} />}
          </Form.Actions>
        )}
      </div>
      <Preview
        config={configToDisplay}
        data={data}
        project={project}
        loading={loading}
        error={parserError || error || (configure === "code" && warning)}
      />
    </div>
  );
};

export const ConfigPage = ({
  config: initialConfig = "",
  columns: externalColumns,
  project,
  onUpdate,
  onSaveClick,
  onValidate,
  disableSaveButton,
  show = true,
  hasChanges,
}) => {
  const [config, _setConfig] = React.useState("");
  const [mode, setMode] = React.useState("list");
  const [selectedGroup, _setSelectedGroup] = React.useState(null);
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [template, setCurrentTemplate] = React.useState(null);
  const api = useAPI();
  const setSelectedGroup = React.useCallback(
    (group) => {
      _setSelectedGroup(group);
      __lsa(`labeling_setup.list.${snakeCase(group)}`);
    },
    [_setSelectedGroup],
  );
  const setConfig = React.useCallback(
    (config) => {
      _setConfig(config);
      onUpdate(config);
    },
    [_setConfig, onUpdate],
  );
  const setTemplate = React.useCallback(
    (config) => {
      const tpl = new Template({ config });
      tpl.onConfigUpdate = setConfig;
      setConfig(config);
      setCurrentTemplate(tpl);
    },
    [setConfig, setCurrentTemplate],
  );
  const [columns, setColumns] = React.useState();
  React.useEffect(() => {
    if (externalColumns?.length) setColumns(externalColumns);
  }, [externalColumns]);
  const [warning, setWarning] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      if (!externalColumns || (project && !columns)) {
        const res = await api.callApi("dataSummary", {
          params: { pk: project.id },
          errorFilter: () => true,
        });
        if (res?.common_data_columns) {
          setColumns(res.common_data_columns);
        }
      }
      fetchData();
    };
  }, [columns, project]);
  const onSelectRecipe = React.useCallback((recipe) => {
    if (!recipe) {
      setSelectedRecipe(null);
      setMode("list");
      __lsa("labeling_setup.view.empty");
    } else {
      setTemplate(recipe.config);
      setSelectedRecipe(recipe);
      setMode("view");
      __lsa(`labeling_setup.view.${snakeCase(recipe.group)}.${snakeCase(recipe.title)}`);
    }
  });
  const onCustomTemplate = React.useCallback(() => {
    setTemplate(EMPTY_CONFIG);
    setMode("view");
    __lsa("labeling_setup.view.custom");
  });
  const onBrowse = React.useCallback(() => {
    setMode("list");
    __lsa("labeling_setup.list.browse");
  }, []);
  React.useEffect(() => {
    if (initialConfig) {
      setTemplate(initialConfig);
      setMode("view");
    }
  }, []);
  if (!show) return null;
  return (
    <div className={wizardClass} data-mode="list" id="config-wizard">
      {mode === "list" && (
        <TemplatesList
          case="list"
          selectedGroup={selectedGroup}
          selectedRecipe={selectedRecipe}
          onSelectGroup={setSelectedGroup}
          onSelectRecipe={onSelectRecipe}
          onCustomTemplate={onCustomTemplate}
        />
      )}
      {mode === "view" && (
        <Configurator
          case="view"
          columns={columns}
          config={config}
          project={project}
          selectedRecipe={selectedRecipe}
          template={template}
          setTemplate={setTemplate}
          onBrowse={onBrowse}
          onValidate={onValidate}
          disableSaveButton={disableSaveButton}
          onSaveClick={onSaveClick}
          warning={warning}
          hasChanges={hasChanges}
        />
      )}
    </div>
  );
};
