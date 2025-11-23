// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 请根据您的项目结构进行调整，确保引入了 t 函数

import { useQuery } from "@tanstack/react-query";
import { useAPI } from "apps/labelstudio/src/providers/ApiProvider";
import { useCallback, useMemo } from "react";

function useStorages(target: "import" | "export", projectId?: number) {
  const api = useAPI();
  const storagesQueryKey = ["storages", target, projectId];
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: storagesQueryKey,
    enabled: projectId !== undefined,
    async queryFn() {
      const result = await api.callApi("listStorages", {
        params: { project: projectId, target },
        errorFilter: () => true,
      });

      if (!result?.$meta.ok) return [];

      return result;
    },
  });

  return {
    storages: data,
    storagesLoading: isLoading,
    storagesLoaded: isSuccess,
    reloadStoragesList: () => refetch({ queryKey: storagesQueryKey }),
  };
}

function useStorageTypes(target: "import" | "export") {
  const api = useAPI();
  const storageTypesQueryKey = ["storage-types", target];
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: storageTypesQueryKey,
    async queryFn() {
      const result = await api.callApi<{ title: string; name: string }[]>("storageTypes", {
        params: { target },
        errorFilter: () => true,
      });

      if (!result?.$meta.ok) return [];

      // ============================================================
      // 汉化逻辑：拦截 API 返回结果，替换 title 为中文
      // ============================================================
      return result.map((type) => {
        // 构造翻译键，例如: storage_settings.providers.s3.title
        const translationKey = `storage_settings.providers.${type.name}.title`;

        // 尝试获取翻译，如果翻译不存在（返回了键名），则回退使用 API 返回的原始英文 title
        // 注意：具体的 t 函数行为取决于您的 i18n 配置，通常可以传入 defaultValue
        const translatedTitle = t(translationKey, { defaultValue: type.title });

        // 这里判断一下，如果 t 返回的还是 key 本身（说明没配翻译），就用原标题
        const finalTitle = translatedTitle === translationKey ? type.title : translatedTitle;

        return {
          ...type,
          title: finalTitle,
        };
      });
    },
  });

  return {
    storageTypes: data,
    storageTypesLoading: isLoading,
    storageTypesLoaded: isSuccess,
    reloadStorageTypes: () => refetch({ queryKey: storageTypesQueryKey }),
  };
}

export function useStorageCard(target: "import" | "export", projectId?: number) {
  const { reloadStoragesList, ...storages } = useStorages(target, projectId);
  const { reloadStorageTypes, ...storageTypes } = useStorageTypes(target);

  const fetchStorages = useCallback(async () => {
    reloadStoragesList();
    reloadStorageTypes();
  }, [reloadStoragesList, reloadStorageTypes]);

  const loading = useMemo(
    () => storageTypes.storageTypesLoading || storages.storagesLoading,
    [storageTypes.storageTypesLoading, storages.storagesLoading],
  );
  const loaded = useMemo(
    () => storageTypes.storageTypesLoaded || storages.storagesLoaded,
    [storageTypes.storageTypesLoaded, storages.storagesLoaded],
  );

  return {
    ...storages,
    ...storageTypes,
    loaded,
    loading,
    fetchStorages,
  };
}
