import { htmlEscape } from "./html";
// 引入 i18n 实例，路径取决于你的项目结构，通常是 'i18next' 或 '../../i18n'
import i18n from "i18next";

const URL_CORS_DOCS = "https://labelstud.io/guide/storage.html#Troubleshoot-CORS-and-access-problems";
const URL_TAGS_DOCS = "https://labelstud.io/tags";

export default {
  // 对于静态属性，使用 getter 可以确保在访问时才翻译，避免加载时语言包未准备好
  get DONE() { return i18n.t("messages.done", "Done!"); },
  get NO_COMP_LEFT() { return i18n.t("messages.no_comp_left", "No more annotations"); },
  get NO_NEXT_TASK() { return i18n.t("messages.no_next_task", "No More Tasks Left in Queue"); },
  get NO_ACCESS() { return i18n.t("messages.no_access", "You don't have access to this task"); },

  get CONFIRM_TO_DELETE_ALL_REGIONS() { return i18n.t("messages.confirm_delete_all_regions", "Please confirm you want to delete all labeled regions"); },

  // Tree validation messages
  ERR_REQUIRED: ({ modelName, field }) => {
    return i18n.t("messages.err_required", {
      modelName,
      field,
      defaultValue: `Attribute <b>${field}</b> is required for <b>${modelName}</b>`
    });
  },

  ERR_UNKNOWN_TAG: ({ modelName, field, value }) => {
    return i18n.t("messages.err_unknown_tag", {
      modelName,
      field,
      value,
      defaultValue: `Tag with name <b>${value}</b> is not registered. Referenced by <b>${modelName}#${field}</b>.`
    });
  },

  ERR_TAG_NOT_FOUND: ({ modelName, field, value }) => {
    return i18n.t("messages.err_tag_not_found", {
      modelName,
      field,
      value,
      defaultValue: `Tag with name <b>${value}</b> does not exist in the config. Referenced by <b>${modelName}#${field}</b>.`
    });
  },

  ERR_TAG_UNSUPPORTED: ({ modelName, field, value, validType }) => {
    const validTypes = [].concat(validType).join(", ");
    return i18n.t("messages.err_tag_unsupported", {
      modelName,
      field,
      value,
      validTypes,
      defaultValue: `Invalid attribute <b>${field}</b> for <b>${modelName}</b>: referenced tag is <b>${value}</b>, but <b>${modelName}</b> can only control <b>${validTypes}</b>`
    });
  },

  ERR_PARENT_TAG_UNEXPECTED: ({ validType, value }) => {
    const validTypes = [].concat(validType).join(", ");
    return i18n.t("messages.err_parent_tag_unexpected", {
      value,
      validTypes,
      defaultValue: `Tag <b>${value}</b> must be a child of one of the tags <b>${validTypes}</b>.`
    });
  },

  ERR_BAD_TYPE: ({ modelName, field, validType }) => {
    return i18n.t("messages.err_bad_type", {
      modelName,
      field,
      validType,
      defaultValue: `Attribute <b>${field}</b> of tag <b>${modelName}</b> has invalid type. Valid types are: <b>${validType}</b>.`
    });
  },

  ERR_INTERNAL: ({ value }) => {
    return i18n.t("messages.err_internal", {
      value,
      defaultValue: `Internal error. See browser console for more info. Try again or contact developers.<br/>${value}`
    });
  },

  ERR_GENERAL: ({ value }) => {
    return value;
  },

  // Object loading errors
  URL_CORS_DOCS,
  URL_TAGS_DOCS,

  ERR_LOADING_AUDIO({ attr, url, error }) {
    // 这里返回的是 JSX，所以直接在 JSX 里调用 t()
    return (
      <div data-testid="error:audio">
        <p>
          {i18n.t("messages.loading_audio_error", { attr, defaultValue: `Error while loading audio. Check <code>${attr}</code> field in task.` })}
        </p>
        <p>{i18n.t("messages.technical_description", { error, defaultValue: `Technical description: ${error}` })}</p>
        <p>URL: {htmlEscape(url)}</p>
      </div>
    );
  },

  // 注意：以下函数原本返回的是 HTML 字符串。
  // 为了保持兼容性，我们在 JSON 中包含了 HTML 标签，并使用 interpolate 返回字符串。
  ERR_LOADING_S3({ attr, url }) {
    return i18n.t("messages.loading_s3_error", {
      attr,
      url: encodeURI(url),
      urlText: htmlEscape(url),
      interpolation: { escapeValue: false } // 允许返回 HTML
    });
  },

  ERR_LOADING_CORS({ attr, url }) {
    return i18n.t("messages.loading_cors_error", {
      attr,
      docLink: URL_CORS_DOCS,
      url: encodeURI(url),
      urlText: htmlEscape(url),
      interpolation: { escapeValue: false }
    });
  },

  // 这是一个比较复杂的 HTML 拼接，为了翻译方便，拆解一下
  ERR_LOADING_HTTP({ attr, url, error }) {
    const p1 = i18n.t("messages.loading_http_error_p1", { attr, defaultValue: `There was an issue loading URL from <code>${attr}</code> value` });
    const thingsToLookOut = i18n.t("messages.loading_http_error_list", { docLink: URL_CORS_DOCS, interpolation: { escapeValue: false } });

    return `
    <div data-testid="error:http">
      <p>${p1}</p>
      <p>
        ${i18n.t("messages.things_to_look_out", "Things to look out for:")}
        ${thingsToLookOut}
      </p>
      <p>
        ${i18n.t("messages.technical_description", { error })}
        <br />
        URL: <code><a href="${encodeURI(url)}" target="_blank" rel="noreferrer">${htmlEscape(url)}</a></code>
      </p>
    </div>`;
  },
};
