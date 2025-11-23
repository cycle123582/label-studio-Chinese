import { forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button } from "@humansignal/ui";
import { InlineError } from "../../../components/Error/InlineError";
import { Form, Input } from "../../../components/Form";
import { Oneof } from "../../../components/Oneof/Oneof";
import { ApiContext } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";
import { isDefined } from "../../../utils/helpers";

export const StorageForm = forwardRef(({ onSubmit, target, project, rootClass, storage, storageTypes }, ref) => {
  const { t } = useTranslation(); // 初始化 t 函数
  /**@type {import('react').RefObject<Form>} */
  const api = useContext(ApiContext);
  const formRef = ref ?? useRef();
  const [type, setType] = useState(storage?.type ?? storageTypes?.[0]?.name ?? "s3");
  const [checking, setChecking] = useState(false);
  const [connectionValid, setConnectionValid] = useState(null);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    api
      .callApi("storageForms", {
        params: {
          target,
          type,
        },
      })
      .then((formFields) => setFormFields(formFields ?? []));
  }, [type, api, target]);

  const storageTypeSelect = {
    columnCount: 1,
    fields: [
      {
        skip: true,
        type: "select",
        name: "storage_type",
        label: t("storage_form.storage_type_label", "Storage Type"),
        disabled: !!storage,
        options: storageTypes.map(({ name, title }) => ({
          value: name,
          label: title,
        })),
        value: storage?.type ?? type,
        onChange: setType,
      },
    ],
  };

  const validateStorageConnection = useCallback(async () => {
    setChecking(true);
    setConnectionValid(null);

    const form = formRef.current;

    if (form && form.validateFields()) {
      const body = form.assembleFormData({ asJSON: true });
      const type = form.getField("storage_type").value;

      if (isDefined(storage?.id)) {
        body.id = storage.id;
      }

      const response = await form.api.callApi("validateStorage", {
        params: {
          target,
          type,
        },
        body,
      });

      if (response?.$meta?.ok) setConnectionValid(true);
      else setConnectionValid(false);
    }
    setChecking(false);
  }, [formRef, target, storage]);

  const action = useMemo(() => {
    return storage ? "updateStorage" : "createStorage";
  }, [storage]);

  return (
    <Form.Builder
      ref={formRef}
      action={action}
      params={{ target, type, project, pk: storage?.id }}
      fields={[storageTypeSelect, ...(formFields ?? [])]}
      formData={{ ...(storage ?? {}) }}
      skipEmpty={false}
      onSubmit={onSubmit}
      autoFill="off"
      autoComplete="off"
    >
      <Input type="hidden" name="project" value={project} />
      <Form.Actions
        valid={connectionValid}
        extra={
          connectionValid !== null && (
            <div className={cn("form-indicator").toClassName()}>
              <Oneof value={connectionValid}>
                <span className={cn("form-indicator").elem("item").mod({ type: "success" }).toClassName()} case={true}>
                  {t("storage_form.connected_successfully", "Successfully connected!")}
                </span>
                <span className={cn("form-indicator").elem("item").mod({ type: "fail" }).toClassName()} case={false}>
                  {t("storage_form.connection_failed", "Connection failed")}
                </span>
              </Oneof>
            </div>
          )
        }
      >
        <Input type="hidden" name="project" value={project} />
        <div className="flex gap-tight">
          <Button
            type="button"
            look="outlined"
            waiting={checking}
            onClick={validateStorageConnection}
            aria-label={t("storage_form.check_connection_aria", "Test storage connection")}
          >
            {t("storage_form.check_connection_button", "Check Connection")}
          </Button>
          <Button
            type="submit"
            aria-label={
              storage
                ? t("storage_form.save_storage_aria", "Save storage settings")
                : t("storage_form.add_storage_aria", "Add storage")
            }
          >
            {storage ? t("save", "Save") : t("storage_form.add_storage_button", "Add Storage")}
          </Button>
        </div>
      </Form.Actions>

      <InlineError />
    </Form.Builder>
  );
});
