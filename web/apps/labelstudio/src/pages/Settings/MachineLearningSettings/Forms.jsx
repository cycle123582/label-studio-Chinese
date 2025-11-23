import { useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button } from "@humansignal/ui";
import { ErrorWrapper } from "../../../components/Error/Error";
import { InlineError } from "../../../components/Error/InlineError";
import { Form, Input, Select, TextArea, Toggle } from "../../../components/Form";
import "./MachineLearningSettings.scss";

const CustomBackendForm = ({ action, backend, project, onSubmit }) => {
  const { t } = useTranslation(); // 初始化 t 函数
  const [selectedAuthMethod, setAuthMethod] = useState("NONE");
  const [, setMLError] = useState();

  // 将选项定义在组件内部，以便使用 t 函数
  const authMethodOptions = [
    { label: t("ml_backend_form.auth_method_none", "No Authentication"), value: "NONE" },
    { label: t("ml_backend_form.auth_method_basic", "Basic Authentication"), value: "BASIC_AUTH" },
  ];

  return (
    <Form
      action={action}
      formData={{ ...(backend ?? {}) }}
      params={{ pk: backend?.id }}
      onSubmit={async (response) => {
        if (!response.error_message) {
          onSubmit(response);
        }
      }}
    >
      <Input type="hidden" name="project" value={project.id} />

      <Form.Row columnCount={1}>
        <Input
          name="title"
          label={t("ml_backend_form.name_label", "Name")}
          placeholder={t("ml_backend_form.name_placeholder", "Enter a name")}
          required
        />
      </Form.Row>

      <Form.Row columnCount={1}>
        <Input name="url" label={t("ml_backend_form.url_label", "Backend URL")} required />
      </Form.Row>

      <Form.Row columnCount={2}>
        <Select
          name="auth_method"
          label={t("ml_backend_form.auth_method_label", "Select authentication method")}
          options={authMethodOptions}
          value={selectedAuthMethod}
          onChange={setAuthMethod}
        />
      </Form.Row>

      {(backend?.auth_method === "BASIC_AUTH" || selectedAuthMethod === "BASIC_AUTH") && (
        <Form.Row columnCount={2}>
          <Input name="basic_auth_user" label={t("ml_backend_form.basic_auth_user_label", "Basic auth user")} />
          {backend?.basic_auth_pass_is_set ? (
            <Input
              name="basic_auth_pass"
              label={t("ml_backend_form.basic_auth_pass_label", "Basic auth pass")}
              type="password"
              placeholder="********"
            />
          ) : (
            <Input
              name="basic_auth_pass"
              label={t("ml_backend_form.basic_auth_pass_label", "Basic auth pass")}
              type="password"
            />
          )}
        </Form.Row>
      )}

      <Form.Row columnCount={1}>
        <TextArea
          name="extra_params"
          label={t("ml_backend_form.extra_params_label", "Any extra params to pass during model connection")}
          style={{ minHeight: 120 }}
        />
      </Form.Row>

      <Form.Row columnCount={1}>
        <Toggle
          name="is_interactive"
          label={t("ml_backend_form.interactive_preannotations_label", "Interactive preannotations")}
          description={t(
            "ml_backend_form.interactive_preannotations_desc",
            "If enabled some labeling tools will send requests to the ML Backend interactively during the annotation process.",
          )}
        />
      </Form.Row>

      <Form.Actions>
        <Button
          type="submit"
          look="primary"
          onClick={() => setMLError(null)}
          aria-label={t("ml_backend_form.submit_aria", "Save machine learning form")}
        >
          {t("ml_backend_form.submit_button", "Validate and Save")}
        </Button>
      </Form.Actions>

      <Form.ResponseParser>
        {(response) => (
          <>
            {response.error_message && (
              <ErrorWrapper
                error={{
                  response: {
                    detail: backend
                      ? t("ml_backend_form.error_save", "Failed to save ML backend.")
                      : t("ml_backend_form.error_add", "Failed to add new ML backend."),
                    exc_info: response.error_message,
                  },
                }}
              />
            )}
          </>
        )}
      </Form.ResponseParser>

      <InlineError />
    </Form>
  );
};

export { CustomBackendForm };
