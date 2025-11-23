// web/src/pages/Projects/Import/Import.js (已汉化修改)

import { SampleDatasetSelect } from "@humansignal/app-common/blocks/SampleDatasetSelect/SampleDatasetSelect";
import { ff, formatFileSize } from "@humansignal/core";
import { IconCode, IconErrorAlt, IconFileUpload, IconInfoOutline, IconTrash, IconUpload } from "@humansignal/icons";
import { Badge } from "@humansignal/shad/components/ui/badge";
import { cn as scn } from "@humansignal/shad/utils";
import { useAtomValue } from "jotai";
import Input from "libs/datamanager/src/components/Common/Input/Input";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useAPI } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";
import { unique } from "../../../utils/helpers";
import { sampleDatasetAtom } from "../utils/atoms";
import "./Import.scss";
import { Button, CodeBlock, SimpleCard, Spinner, Tooltip, Typography } from "@humansignal/ui";
import truncate from "truncate-middle";
import samples from "./samples.json";
import { importFiles } from "./utils";
import { useTranslation } from "react-i18next"; // <-- 已添加: 导入 i18next Hook

const importClass = cn("upload_page");
const dropzoneClass = cn("dropzone");

// ... (此处到 ImportPage 组件之前的所有辅助函数保持不变) ...
// ... (此处省略未修改的辅助函数代码以保持简洁) ...
function flatten(nested) {
  return [].concat(...nested);
}
const supportedExtensions = {
  text: ["txt"],
  audio: ["wav", "mp3", "flac", "m4a", "ogg"],
  video: ["mp4", "webm"],
  image: ["bmp", "gif", "jpg", "jpeg", "png", "svg", "webp"],
  html: ["html", "htm", "xml"],
  pdf: ["pdf"],
  structuredData: ["csv", "tsv", "json"],
};
const allSupportedExtensions = flatten(Object.values(supportedExtensions));
function getFileExtension(fileName) {
  if (!fileName) {
    return fileName;
  }
  return fileName.split(".").pop().toLowerCase();
}
function traverseFileTree(item, path) {
  return new Promise((resolve) => {
    path = path || "";
    if (item.isFile) {
      if (item.name[0] === ".") return resolve([]);
      resolve([item]);
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      const dirPath = `${path + item.name}/`;
      dirReader.readEntries((entries) => {
        Promise.all(entries.map((entry) => traverseFileTree(entry, dirPath)))
          .then(flatten)
          .then(resolve);
      });
    }
  });
}
function getFiles(files) {
  return new Promise((resolve) => {
    if (!files.length) return resolve([]);
    if (!files[0].webkitGetAsEntry) return resolve(files);
    const entries = Array.from(files).map((file) => file.webkitGetAsEntry());
    Promise.all(entries.map(traverseFileTree))
      .then(flatten)
      .then((fileEntries) => fileEntries.map((fileEntry) => new Promise((res) => fileEntry.file(res))))
      .then((filePromises) => Promise.all(filePromises))
      .then(resolve);
  });
}
const Upload = ({ children, sendFiles }) => {
  const [hovered, setHovered] = useState(false);
  const onHover = (e) => {
    e.preventDefault();
    setHovered(true);
  };
  const onLeave = setHovered.bind(null, false);
  const dropzoneRef = useRef();
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      onLeave();
      getFiles(e.dataTransfer.items).then((files) => sendFiles(files));
    },
    [onLeave, sendFiles],
  );
  return (
    <div
      id="holder"
      className={dropzoneClass.mod({ hovered })}
      ref={dropzoneRef}
      onDragStart={onHover}
      onDragOver={onHover}
      onDragLeave={onLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  let extra = error.validation_errors ?? error.extra;
  if (extra && typeof extra === "object" && !Array.isArray(extra)) {
    extra = extra.non_field_errors ?? Object.values(extra);
  }
  if (Array.isArray(extra)) extra = extra.join("; ");
  return (
    <div className={importClass.elem("error")}>
      <IconErrorAlt width="24" height="24" />
      {error.id && `[${error.id}] `}
      {error.detail || error.message}
      {extra && ` (${extra})`}
    </div>
  );
};


export const ImportPage = ({
  project,
  sample,
  show = true,
  onWaiting,
  onFileListUpdate,
  onSampleDatasetSelect,
  highlightCsvHandling,
  dontCommitToProject = false,
  csvHandling,
  setCsvHandling,
  addColumns,
  openLabelingConfig,
}) => {
  const { t } = useTranslation(); // <-- 已添加: 初始化 t 函数
  const [error, setError] = useState();
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState(new Set());
  const prevUploadedRef = useRef(new Set());
  const api = useAPI();
  const projectConfigured = project?.label_config !== "<View></View>";
  const sampleConfig = useAtomValue(sampleDatasetAtom);

  // ... (此处到 return 之前的所有业务逻辑函数保持不变) ...
  // ... (此处省略未修改的业务逻辑代码以保持简洁) ...
  const processFiles = (state, action) => {
    if (action.sending) {
      return { ...state, uploading: [...action.sending, ...state.uploading] };
    }
    if (action.sent) {
      return {
        ...state,
        uploading: state.uploading.filter((f) => !action.sent.includes(f)),
      };
    }
    if (action.uploaded) {
      return {
        ...state,
        uploaded: unique([...state.uploaded, ...action.uploaded], (a, b) => a.id === b.id),
      };
    }
    if (action.ids) {
      const ids = unique([...state.ids, ...action.ids]);
      onFileListUpdate?.(ids);
      return { ...state, ids };
    }
    return state;
  };
  const [files, dispatch] = useReducer(processFiles, {
    uploaded: [],
    uploading: [],
    ids: [],
  });
  const showList = Boolean(files.uploaded?.length || files.uploading?.length || sample);
  const loadFilesList = useCallback(
    async (file_upload_ids) => {
      const query = {};
      if (file_upload_ids) {
        query.ids = JSON.stringify(file_upload_ids);
      }
      const files = await api.callApi("fileUploads", {
        params: { pk: project.id, ...query },
      });
      dispatch({ uploaded: files ?? [] });
      if (files?.length) {
        dispatch({ ids: files.map((f) => f.id) });
      }
      return files;
    },
    [project?.id],
  );
  const onError = (err) => {
    console.error(err);
    if (typeof err === "string" && err.includes("RequestDataTooBig")) {
      const message = "Imported file is too big";
      const extra = err.match(/"exception_value">(.*)<\/pre>/)?.[1];
      err = { message, extra };
    }
    setError(err);
    onWaiting?.(false);
  };
  const onFinish = useCallback(
    async (res) => {
      const { could_be_tasks_list, data_columns, file_upload_ids } = res;
      dispatch({ ids: file_upload_ids });
      if (could_be_tasks_list && !csvHandling) setCsvHandling("choose");
      onWaiting?.(false);
      addColumns(data_columns);
      await loadFilesList(file_upload_ids);
      return res;
    },
    [addColumns, loadFilesList],
  );
  useEffect(() => {
    const currentUploadedIds = new Set(files.uploaded.map((f) => f.id));
    const previousUploadedIds = prevUploadedRef.current;
    const justUploaded = new Set([...currentUploadedIds].filter((id) => !previousUploadedIds.has(id)));
    prevUploadedRef.current = new Set(currentUploadedIds);
    setNewlyUploadedFiles((prev) => {
      const filtered = new Set([...prev].filter((id) => currentUploadedIds.has(id)));
      return filtered;
    });
    if (justUploaded.size > 0) {
      setNewlyUploadedFiles((prev) => new Set([...prev, ...justUploaded]));
      const timeoutId = setTimeout(() => {
        setNewlyUploadedFiles((prev) => {
          const updated = new Set(prev);
          justUploaded.forEach((id) => updated.delete(id));
          return updated;
        });
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [files.uploaded]);
  const importFilesImmediately = useCallback(
    async (files, body) => {
      importFiles({
        files,
        body,
        project,
        onError,
        onFinish,
        onUploadStart: (files) => dispatch({ sending: files }),
        onUploadFinish: (files) => dispatch({ sent: files }),
        dontCommitToProject,
      });
    },
    [project, onFinish],
  );
  const sendFiles = useCallback(
    (files) => {
      setError(null);
      onWaiting?.(true);
      files = [...files];
      const fd = new FormData();
      for (const f of files) {
        if (!allSupportedExtensions.includes(getFileExtension(f.name))) {
          onError(new Error(`The filetype of file "${f.name}" is not supported.`));
          return;
        }
        fd.append(f.name, f);
      }
      return importFilesImmediately(files, fd);
    },
    [importFilesImmediately],
  );
  const onUpload = useCallback(
    (e) => {
      sendFiles(e.target.files);
      e.target.value = "";
    },
    [sendFiles],
  );
  const onLoadURL = useCallback(
    (e) => {
      e.preventDefault();
      setError(null);
      const url = urlRef.current?.value;
      if (!url) {
        return;
      }
      urlRef.current.value = "";
      onWaiting?.(true);
      const body = new URLSearchParams({ url });
      importFilesImmediately([{ name: url }], body);
    },
    [importFilesImmediately],
  );
  const openConfig = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLabelingConfig?.();
    },
    [openLabelingConfig],
  );
  useEffect(() => {
    if (project?.id !== undefined) {
      loadFilesList().then((files) => {
        if (csvHandling) return;
        if (Array.isArray(files) && files.some(({ file }) => /\.[ct]sv$/.test(file))) {
          setCsvHandling("choose");
        }
      });
    }
  }, [project?.id, loadFilesList]);
  const urlRef = useRef();


  if (!project) return null;
  if (!show) return null;

  const csvProps = {
    name: "csv",
    type: "radio",
    onChange: (e) => setCsvHandling(e.target.value),
  };

  return (
    <div className={importClass}>
      {highlightCsvHandling && <div className={importClass.elem("csv-splash")} />}
      <input id="file-input" type="file" name="file" multiple onChange={onUpload} style={{ display: "none" }} />

      <header className="flex gap-4">
        <form
          className={`${importClass.elem("url-form")} inline-flex items-stretch`}
          method="POST"
          onSubmit={onLoadURL}
        >
          {/* 已修改: placeholder */}
          <Input
            placeholder={t("pages.create_project.import.dataset_url")}
            name="url"
            ref={urlRef}
            rawClassName="h-[40px]"
          />
          {/* 已修改: aria-label 和按钮文本 */}
          <Button
            variant="primary"
            look="outlined"
            type="submit"
            aria-label={t("pages.create_project.import.add_url")}
          >
            {t("pages.create_project.import.add_url")}
          </Button>
        </form>
        {/* 已修改: "or" */}
        <span>{t("or")}</span>
        <Button
          variant="primary"
          look="outlined"
          type="button"
          onClick={() => document.getElementById("file-input").click()}
          leading={<IconUpload />}
          aria-label={t("pages.create_project.import.upload_files")}
        >
          {/* 已修改: 动态按钮文本 */}
          {files.uploaded.length
            ? t("pages.create_project.import.upload_more_files")
            : t("pages.create_project.import.upload_files")}
        </Button>
        {ff.isActive(ff.FF_SAMPLE_DATASETS) && (
          <SampleDatasetSelect samples={samples} sample={sample} onSampleApplied={onSampleDatasetSelect} />
        )}
        <div
          className={importClass.elem("csv-handling").mod({ highlighted: highlightCsvHandling, hidden: !csvHandling })}
        >
          {/* 已修改: CSV 处理部分 */}
          <span>{t("pages.create_project.import.csv_handling_title")}</span>
          <label>
            <input {...csvProps} value="tasks" checked={csvHandling === "tasks"} />{" "}
            {t("pages.create_project.import.csv_list_of_tasks")}
          </label>
          <label>
            <input {...csvProps} value="ts" checked={csvHandling === "ts"} />{" "}
            {t("pages.create_project.import.csv_time_series")}
          </label>
        </div>
        <div className={importClass.elem("status")}>
          {/* 已修改: 文件上传状态 */}
          {files.uploaded.length
            ? t("pages.create_project.import.files_uploaded", { count: files.uploaded.length })
            : ""}
        </div>
      </header>

      <ErrorMessage error={error} />

      <main>
        <Upload sendFiles={sendFiles} project={project}>
          <div
            className={scn("flex gap-4 w-full min-h-full", {
              "justify-center": !showList,
            })}
          >
            {!showList && (
              <div className="flex gap-4 justify-center items-start w-full h-full">
                <label htmlFor="file-input" className="w-full h-full">
                  <div className={`${dropzoneClass.elem("content")} w-full`}>
                    <IconFileUpload height="64" className={dropzoneClass.elem("icon")} />
                    <header>
                      {/* 已修改: 拖放区域文本 */}
                      {t("pages.create_project.import.drag_and_drop")}
                      <br />
                      {t("or")} {t("pages.create_project.import.click_to_browse")}
                    </header>

                    <dl>
                      {/* 已修改: 文件类型 */}
                      <dt>{t("pages.create_project.import.images")}</dt>
                      <dd>{supportedExtensions.image.join(", ")}</dd>
                      <dt>{t("pages.create_project.import.audio")}</dt>
                      <dd>{supportedExtensions.audio.join(", ")}</dd>
                      <dt>
                        <div className="flex items-center gap-1">
                          {t("pages.create_project.import.video")}
                          {/* 已修改: Tooltip 标题 */}
                          <Tooltip title={t("pages.create_project.import.video_tooltip")}>
                            <a
                              href="https://labelstud.io/tags/video#Video-format"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center"
                              aria-label="Learn more about video format support (opens in a new tab)"
                            >
                              <IconInfoOutline className="w-4 h-4 text-primary-content hover:text-primary-content-hover" />
                            </a>
                          </Tooltip>
                        </div>
                      </dt>
                      <dd>{supportedExtensions.video.join(", ")}</dd>
                      <dt>{t("pages.create_project.import.html_hypertext")}</dt>
                      <dd>{supportedExtensions.html.join(", ")}</dd>
                      <dt>{t("pages.create_project.import.text")}</dt>
                      <dd>{supportedExtensions.text.join(", ")}</dd>
                      <dt>{t("pages.create_project.import.structured_data")}</dt>
                      <dd>{supportedExtensions.structuredData.join(", ")}</dd>
                      <dt>{t("pages.create_project.import.pdf")}</dt>
                      <dd>{supportedExtensions.pdf.join(", ")}</dd>
                    </dl>
                    <div className="tips">
                      {/* 已修改: 重要提示部分 */}
                      <b>{t("pages.create_project.import.important")}</b>
                      <ul className="mt-2 ml-4 list-disc font-normal">
                        <li>
                          {t("pages.create_project.import.recommend_cloud_storage_1")}{" "}
                          <a
                            href="https://labelstud.io/guide/tasks.html#Import-data-from-the-Label-Studio-UI"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Upload limitations documentation (opens in a new tab)"
                          >
                            {t("pages.create_project.import.upload_limitations")}
                          </a>
                          {t("pages.create_project.import.recommend_cloud_storage_2")}{" "}
                          <a
                            href="https://labelstud.io/guide/storage.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Cloud Storage documentation (opens in a new tab)"
                          >
                            {t("pages.create_project.import.cloud_storage")}
                          </a>
                          .
                        </li>
                        <li>
                          {t("pages.create_project.import.for_pdfs_1")}{" "}
                          <a
                            href="https://labelstud.io/templates/multi-page-document-annotation"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Multi-image labeling documentation (opens in a new tab)"
                          >
                            {t("pages.create_project.import.multi_image_labeling")}
                          </a>
                          {t("pages.create_project.import.for_pdfs_2")}
                        </li>
                        <li>
                          {t("pages.create_project.import.check_docs_1")}{" "}
                          <a target="_blank" href="https://labelstud.io/guide/predictions.html" rel="noreferrer">
                            {t("pages.create_project.import.import_preannotated_data")}
                          </a>
                          {t("pages.create_project.import.check_docs_2")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </label>
              </div>
            )}

            {showList && (
              <div className="w-full">
                {/* 已修改: 文件列表标题 */}
                <SimpleCard
                  title={t("pages.create_project.import.files")}
                  className="w-full h-full"
                  contentClassName="overflow-y-auto h-[calc(100%-48px)]"
                >
                  <table className="w-full">
                    <tbody>
                      {sample && (
                        <tr key={sample.url}>
                          <td>
                            <div className="flex items-center gap-2">
                              {sample.title}
                              {/* 已修改: 示例 Badge */}
                              <Badge variant="info" className="h-5 text-xs rounded-sm">
                                {t("pages.create_project.import.sample")}
                              </Badge>
                            </div>
                          </td>
                          <td>{sample.description}</td>
                          <td>
                            <Button size="smaller" variant="negative" onClick={() => onSampleDatasetSelect(undefined)}>
                              <IconTrash className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      )}
                      {files.uploaded.map((file) => {
                        const truncatedFilename = truncate(file.file, 24, 24, "...");
                        return (
                          <tr
                            key={file.file}
                            className={newlyUploadedFiles.has(file.id) ? importClass.elem("upload-flash") : ""}
                          >
                            <td className={importClass.elem("file-name")}>
                              <Tooltip title={file.file}>
                                <Typography variant="body" size="small" className="truncate">
                                  {truncatedFilename}
                                </Typography>
                              </Tooltip>
                            </td>
                            <td>
                              <span className={importClass.elem("file-status")} />
                            </td>
                            <td className={importClass.elem("file-size")}>
                              <Typography
                                variant="body"
                                size="smaller"
                                className="text-nowrap text-neutral-content-subtle text-right"
                              >
                                {file.size ? formatFileSize(file.size) : ""}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                      {files.uploading.map((file, idx) => {
                        const truncatedFilename = truncate(file.name, 24, 24, "...");
                        return (
                          <tr key={`${idx}-${file.name}`}>
                            <td className={importClass.elem("file-name")}>
                              <Tooltip title={file.name}>
                                <Typography variant="body" size="small" className="truncate">
                                  {truncatedFilename}
                                </Typography>
                              </Tooltip>
                            </td>
                            <td>
                              <span className={importClass.elem("file-status").mod({ uploading: true })} />
                            </td>
                            <td className={importClass.elem("file-size")}>&nbsp;</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </SimpleCard>
              </div>
            )}

            {ff.isFF(ff.FF_JSON_PREVIEW) && (
              <div className="w-full h-full flex flex-col min-h-[400px]">
                {projectConfigured ? (
                  // 已修改: 预览区标题
                  <SimpleCard
                    title={t("pages.create_project.import.expected_input_preview")}
                    className="w-full h-full overflow-hidden flex flex-col"
                    contentClassName="h-[calc(100%-48px)]"
                    flushContent
                  >
                    {sampleConfig.data ? (
                      <div className={importClass.elem("code-wrapper")}>
                        <CodeBlock
                          title={t("pages.create_project.import.expected_input_preview")}
                          code={sampleConfig?.data ?? ""}
                          className="w-full h-full"
                        />
                      </div>
                    ) : sampleConfig.isLoading ? (
                      <div className="w-full flex justify-center py-12">
                        <Spinner className="h-6 w-6" />
                      </div>
                    ) : sampleConfig.isError ? (
                      // 已修改: 错误信息
                      <div className="w-[calc(100%-24px)] text-lg text-negative-content bg-negative-background border m-3 rounded-md border-negative-border-subtle p-4">
                        {t("pages.create_project.import.json_preview_error")}
                      </div>
                    ) : null}
                  </SimpleCard>
                ) : (
                  <SimpleCard className="w-full h-full flex flex-col items-center justify-center text-center p-wide">
                    <div className="flex flex-col items-center gap-tight">
                      <div className="bg-primary-background rounded-largest p-tight flex items-center justify-center">
                        <IconCode className="w-6 h-6 text-primary-icon" />
                      </div>
                      <div className="flex flex-col items-center gap-tighter">
                        {/* 已修改: JSON 预览提示 */}
                        <div className="text-label-small text-neutral-content font-medium">
                          {t("pages.create_project.import.view_json_format")}
                        </div>
                        <div className="text-body-small text-neutral-content-subtler text-center">
                          {t("pages.create_project.import.setup_your")}{" "}
                          <Button
                            type="button"
                            look="string"
                            onClick={openConfig}
                            className="border-none bg-none p-0 m-0 text-primary-content underline"
                          >
                            {t("pages.create_project.import.labeling_configuration")}
                          </Button>{" "}
                          {t("pages.create_project.import.first_to_preview")}
                        </div>
                      </div>
                    </div>
                  </SimpleCard>
                )}
              </div>
            )}
          </div>
        </Upload>
      </main>
    </div>
  );
};
