import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button } from "@humansignal/ui";
import { useAPI } from "../../../providers/ApiProvider";
import { Typography } from "@humansignal/ui";

export const StartModelTraining = ({ backend }) => {
  const { t } = useTranslation(); // 初始化 t 函数
  const api = useAPI();
  const [response, setResponse] = useState(null);

  const onStartTraining = useCallback(
    async (backend) => {
      const res = await api.callApi("trainMLBackend", {
        params: {
          pk: backend.id,
        },
      });

      setResponse(res.response || {});
    },
    [api],
  );

  return (
    <div className="max-w-[680px]">
      <Typography size="small" className="text-neutral-content-subtler">
        {t(
          "start_training.intro",
          "You're about to manually trigger your model's training process. This action will start the learning phase based on how train method is implemented in the ML Backend. Proceed to begin this process.",
        )}
      </Typography>
      <Typography size="small" className="text-neutral-content-subtler mt-base mb-wide">
        {t(
          "start_training.note",
          "*Note: Currently, there is no built-in feedback loop within this interface for tracking the training progress. You'll need to monitor the model's training steps directly through the model's own tools and environment.",
        )}
      </Typography>

      {!response && (
        <Button
          onClick={() => {
            onStartTraining(backend);
          }}
        >
          {t("start_training.button", "Start Training")}
        </Button>
      )}

      {!!response && (
        <>
          <pre>{t("start_training.request_sent", "Request Sent!")}</pre>
          <pre>
            {t("start_training.response_label", "Response:")} {JSON.stringify(response, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};
