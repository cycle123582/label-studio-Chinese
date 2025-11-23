import { API } from "apps/labelstudio/src/providers/ApiProvider";

export const importFiles = async ({
  files,
  body,
  project,
  onUploadStart,
  onUploadFinish,
  onFinish,
  onError,
  dontCommitToProject,
}: {
  files: { name: string }[];
  body: Record<string, any> | FormData;
  project: APIProject;
  onUploadStart?: (files: { name: string }[]) => void;
  onUploadFinish?: (files: { name: string }[]) => void;
  onFinish?: (response: any) => void;
  onError?: (response: any) => void;
  dontCommitToProject?: boolean;
}) => {
  onUploadStart?.(files);

  const query = dontCommitToProject ? { commit_to_project: "false" } : {};

  const contentType =
    body instanceof FormData
      ? "multipart/form-data" // usual multipart for usual files
      : "application/x-www-form-urlencoded"; // chad urlencoded for URL uploads
  const res = await API.invoke(
    "importFiles",
    { pk: project.id, ...query },
    { headers: { "Content-Type": contentType }, body },
  );

  if (res && !res.error) {
    await onFinish?.(res);
  } else {
    onError?.(res?.response);
  }

  onUploadFinish?.(files);
};
