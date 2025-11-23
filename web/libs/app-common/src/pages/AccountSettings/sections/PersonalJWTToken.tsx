import { Callout, CalloutContent, CalloutHeader, CalloutIcon, CalloutTitle } from "@humansignal/ui/lib/callout/callout";
import { IconWarning } from "@humansignal/icons";
import { atomWithMutation, atomWithQuery, queryClientAtom } from "jotai-tanstack-query";
import { useAtomValue } from "jotai";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale"; // 1. 引入中文日期包
import { useCopyText } from "@humansignal/core";
import styles from "./PersonalJWTToken.module.scss";
import { Button } from "@humansignal/ui";
import { useTranslation } from "react-i18next"; // 2. 引入 i18n Hook

/**
 * FIXME: This is legacy imports. We're not supposed to use such statements
 * each one of these eventually has to be migrated to core/ui
 */
import { getApiInstance } from "@humansignal/core";
import { modal, confirm } from "@humansignal/ui/lib/modal";
import { Input, Label } from "apps/labelstudio/src/components/Form/Elements";
import { Tooltip } from "@humansignal/ui";

type Token = {
  token: string;
  expires_at: string;
};

const ACCESS_TOKENS_QUERY_KEY = ["access-tokens"];

// list all existing API tokens
const tokensListAtom = atomWithQuery(() => ({
  queryKey: ACCESS_TOKENS_QUERY_KEY,
  async queryFn() {
    const api = getApiInstance();
    const tokens = await api.invoke("accessTokenList");
    if (!tokens.$meta.ok) {
      // 修复原版代码的一个变量名错误 (token -> tokens)
      console.error(tokens.error);
      return [];
    }

    return tokens as Token[];
  },
}));

// despite the name, gets user's access token
const refreshTokenAtom = atomWithMutation((get) => {
  const queryClient = get(queryClientAtom);
  return {
    mutationKey: ["refresh-token"],
    async mutationFn() {
      const api = getApiInstance();
      const token = await api.invoke("accessTokenGetRefreshToken");
      if (!token.$meta.ok) {
        console.error(token.error);
        return "";
      }
      return token.token;
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ACCESS_TOKENS_QUERY_KEY });
    },
  };
});

const revokeTokenAtom = atomWithMutation((get) => {
  const queryClient = get(queryClientAtom);
  return {
    mutationKey: ["revoke"],
    async mutationFn({ token }: { token: string }) {
      const api = getApiInstance();
      await api.invoke("accessTokenRevoke", null, {
        params: {},
        body: {
          refresh: token,
        },
      });
    },
    // Optimistic update
    async onMutate({ token }: { token: string }) {
      // Cancel all ongoing queries so we can override the data they hold
      await queryClient.cancelQueries({ queryKey: ACCESS_TOKENS_QUERY_KEY });
      // Getting currently cached data of a specific query
      const previousTokens = queryClient.getQueryData(ACCESS_TOKENS_QUERY_KEY) as Token[];
      // We need to keep everything but one token that we just deleted
      const filtered = previousTokens.filter((t) => t.token !== token);
      // We now optimistically override data inside the query
      queryClient.setQueryData(ACCESS_TOKENS_QUERY_KEY, (old: Token[]) => filtered as Token[]);
      return { previousTokens };
    },
    onError: (err, newTodo, context) => {
      // If error, reset query to its previous state (without changes from `onMutate`)
      queryClient.setQueryData(ACCESS_TOKENS_QUERY_KEY, context?.previousTokens);
    },
    onSettled() {
      // Reload query from remote if deletion went ok
      queryClient.invalidateQueries({
        queryKey: ACCESS_TOKENS_QUERY_KEY,
      });
    },
  };
});

export function PersonalJWTToken() {
  const { t } = useTranslation(); // 初始化翻译
  const [dialogOpened, setDialogOpened] = useState(false);
  const tokens = useAtomValue(tokensListAtom);
  const revokeToken = useAtomValue(revokeTokenAtom);
  const createToken = useAtomValue(refreshTokenAtom);
  const queryClient = useAtomValue(queryClientAtom);

  const tokensListClassName = clsx({
    [styles.tokensList]: tokens.data && tokens.data.length,
  });

  const revoke = useCallback(
    async (token: string) => {
      confirm({
        title: t("user_token.revoke_title", "Revoke Token"),
        body: t("user_token.revoke_body", "Are you sure you want to delete this access token? Any application using this token will need a new token to be able to access {{appName}}", {
          appName: window?.APP_SETTINGS?.app_name || "Label Studio",
        }),
        okText: t("user_token.revoke_button", "Revoke"),
        buttonLook: "negative",
        onOk: async () => {
          await revokeToken.mutateAsync({ token });
        },
      });
    },
    [revokeToken, t],
  );

  const disallowAddingTokens = useMemo(() => {
    return createToken.isPending || tokens.isLoading || (tokens.data?.length ?? 0) > 0;
  }, [createToken.isPending, tokens.isLoading, tokens.data]);

  function openDialog() {
    if (dialogOpened) return;
    setDialogOpened(true);
    modal({
      visible: true,
      title: t("user_token.create_modal_title", "New Auth Token"),
      style: { width: 680 },
      body: CreateTokenForm,
      closeOnClickOutside: false,
      onHidden: () => {
        setDialogOpened(false);
        queryClient.invalidateQueries({ queryKey: ACCESS_TOKENS_QUERY_KEY });
      },
    });
  }

  return (
    <div className={styles.personalAccessToken}>
      <div className={tokensListClassName}>
        {tokens.isLoading ? (
          <div>{t("common.loading", "loading...")}</div>
        ) : tokens.isSuccess && tokens.data && tokens.data.length ? (
          <div>
            <Label text={t("user_token.access_token_label", "Access Token")} className={styles.label} />
            <div className="flex flex-col gap-2">
              {tokens.data.map((token, index) => {
                return (
                  <div key={`${token.expires_at}${index}`} className={styles.token}>
                    <div className={styles.tokenWrapper}>
                      <div className={styles.expirationDate}>
                        {token.expires_at
                          ? t("user_token.expires_on", "Expires on {{date}}", { date: format(new Date(token.expires_at), "yyyy-MM-dd HH:mm") })
                          : t("user_token.personal_access_token", "Personal access token")}
                      </div>
                      <div className={styles.tokenString}>{token.token}</div>
                    </div>
                    <Button variant="negative" look="outlined" onClick={() => revoke(token.token)}>
                      {t("user_token.revoke_button", "Revoke")}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : tokens.isError ? (
          <div>{t("user_token.error_loading_list", "Unable to load tokens list")}</div>
        ) : null}
      </div>
      <Tooltip
        title={t("user_token.one_token_limit_tooltip", "You can only have one active token")}
        disabled={!disallowAddingTokens}
      >
        <div style={{ width: "max-content" }}>
          <Button disabled={disallowAddingTokens || dialogOpened} onClick={openDialog}>
            {t("user_token.create_new_token_button", "Create New Token")}
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}

function CreateTokenForm() {
  const { t } = useTranslation(); // 子组件也需要初始化
  const { data, mutate: createToken } = useAtomValue(refreshTokenAtom);
  const [copy, copied] = useCopyText({ defaultText: data ?? "" });

  useEffect(() => {
    createToken();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p>{t("user_token.create_instructions", "Copy your new access token from below and keep it secure.")}</p>

      <div className="flex items-end w-full gap-2">
        <Input
          label={t("user_token.access_token_label", "Access Token")}
          labelProps={{ className: "flex-1", rawClassName: "flex-1" }}
          className="w-full"
          readOnly
          value={data ?? ""}
        />
        <Button onClick={() => copy()} disabled={copied} variant="neutral" look="outlined">
          {copied ? t("common.copied", "Copied!") : t("common.copy", "Copy")}
        </Button>
      </div>

      {data?.expires_at && (
        <div>
          <Label text={t("user_token.token_expiry_date", "Token Expiry Date")} />
          {data && format(new Date(data?.expires_at), "yyyy-MM-dd HH:mm z")}
        </div>
      )}

      <Callout variant="warning">
        <CalloutHeader>
          <CalloutIcon>
            <IconWarning />
          </CalloutIcon>
          <CalloutTitle>{t("user_token.warning_title", "Manage your access tokens securely")}</CalloutTitle>
        </CalloutHeader>
        <CalloutContent>
          {t("user_token.warning_content", "Do not share this key with anyone. If you suspect any keys have been compromised, you should revoke them and create new ones.")}
        </CalloutContent>
      </Callout>
    </div>
  );
}

// === 防止路由白屏的保险措施 ===
export const AccessTokenPage = PersonalJWTToken; // 如果有地方用这个名字引用
export default PersonalJWTToken;
