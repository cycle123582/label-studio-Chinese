import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button } from "@humansignal/ui";
import { useAPI } from "../../../providers/ApiProvider";
import { Typography } from "@humansignal/ui";

export const TestRequest = ({ backend }) => {
  const { t } = useTranslation(); // 初始化 t 函数
  const api = useAPI();
  const [testResponse, setTestResponse] = useState({});

  const sendTestRequest = useCallback(
    async (backend) => {
      const response = await api.callApi("predictWithML", {
        params: {
          pk: backend.id,
          random: true,
        },
      });

      if (response) setTestResponse(response);
    },
    [setTestResponse, api], // api 应该在依赖项中
  );

  return (
    <section>
      <Button
        onClick={() => {
          sendTestRequest(backend);
        }}
      >
        {t("test_request.button", "Send Request")}
      </Button>
      <Typography size="smaller" className="my-tight">
        {t(
          "test_request.description",
          "This sends a test request to the prediction endpoint of the ML Backend using a random task.",
        )}
      </Typography>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Typography variant="title" size="medium">
            {t("test_request.request_title", "Request")}
          </Typography>
          <div className="bg-neutral-surface rounded-md p-tight overflow-y-scroll max-h-[400px] min-h-[90px]">
            <pre className="whitespace-pre-wrap break-words text-body-small">
              {testResponse.url && `POST ${testResponse.url}\n\n${JSON.stringify(testResponse.request, null, 2)}`}
            </pre>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="title" size="medium">
            {t("test_request.response_title", "Response")}
          </Typography>
          <div className="bg-neutral-surface rounded-md p-tight overflow-y-scroll max-h-[400px] min-h-[90px]">
            <pre className="whitespace-pre-wrap break-words text-body-small">
              {testResponse.status && `${testResponse.status}\n\n${JSON.stringify(testResponse.response, null, 2)}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
