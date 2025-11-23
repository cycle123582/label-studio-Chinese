import { useCallback, useEffect, useMemo, useState } from "react";
import { inject, observer } from "mobx-react";
import { useCopyText } from "@humansignal/core";
import { isDefined, userDisplayName } from "@humansignal/core/lib/utils/helpers";
import { cn } from "../../utils/bem";
import {
  IconAnnotationGroundTruth,
  IconAnnotationSkipped2,
  IconDraftCreated2,
  IconDuplicate,
  IconLink,
  IconTrashRect,
  IconCommentResolved,
  IconCommentUnresolved,
  IconSparks,
  IconStar,
  IconStarOutline,
} from "@humansignal/icons";
import { Tooltip, Userpic, ToastType, useToast } from "@humansignal/ui";
import { TimeAgo } from "../../common/TimeAgo/TimeAgo";
import { useDropdown } from "../../common/Dropdown/DropdownTrigger";

// eslint-disable-next-line
// @ts-ignore
import { confirm } from "../../common/Modal/Modal";
import { type ContextMenuAction, ContextMenu, ContextMenuTrigger, type MenuActionOnClick } from "../ContextMenu";
import "./AnnotationButton.scss";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

interface AnnotationButtonInterface {
  entity?: any;
  capabilities?: any;
  annotationStore?: any;
  store: any;
  onAnnotationChange?: () => void;
}

const renderCommentIcon = (ent: any) => {
  if (ent.unresolved_comment_count > 0) {
    return IconCommentUnresolved;
  }
  if (ent.comment_count > 0) {
    return IconCommentResolved;
  }

  return null;
};

// 2. 修改该函数以接收 t 函数
const renderCommentTooltip = (ent: any, t: any) => {
  if (ent.unresolved_comment_count > 0) {
    return t("lsf.annotation_button.unresolved_comments", "Unresolved Comments");
  }
  if (ent.comment_count > 0) {
    return t("lsf.annotation_button.all_comments_resolved", "All Comments Resolved");
  }

  return "";
};

const injector = inject(({ store }) => {
  return {
    store,
  };
});

export const AnnotationButton = observer(
  ({ entity, capabilities, annotationStore, onAnnotationChange }: AnnotationButtonInterface) => {
    const { t } = useTranslation(); // 初始化翻译
    const iconSize = 32;
    const isPrediction = entity.type === "prediction";
    const username = userDisplayName(
      entity.user ?? {
        firstName: entity.createdBy || "Admin",
      },
    );
    const [isGroundTruth, setIsGroundTruth] = useState<boolean>();
    const infoIsHidden = annotationStore.store?.hasInterface("annotations:hide-info");
    let hiddenUser = null;

    if (infoIsHidden) {
      // this data can be missing in tests, but we don't have `infoIsHidden` there, so hiding logic like this
      const currentUser = annotationStore.store.user;
      const isCurrentUser = entity.user?.id === currentUser.id || entity.createdBy === currentUser.email;
      hiddenUser = { email: isCurrentUser ? t("lsf.history.me", "Me") : t("lsf.history.user", "User") }; // 汉化 Me/User
    }

    const CommentIcon = renderCommentIcon(entity);
    // need to find a more reliable way to grab this value
    // const historyActionType = annotationStore.history.toJSON()?.[0]?.actionType;

    useEffect(() => {
      setIsGroundTruth(entity.ground_truth);
    }, [entity, entity.ground_truth]);

    const clickHandler = useCallback(() => {
      const { selected, id, type } = entity;

      if (!selected) {
        if (type === "prediction") {
          annotationStore.selectPrediction(id);
        } else {
          annotationStore.selectAnnotation(id);
        }
      }
    }, [entity]);

    const AnnotationButtonContextMenu = injector(
      observer(({ entity, capabilities, store }: AnnotationButtonInterface) => {
        const { t } = useTranslation(); // 子组件也要初始化翻译
        const annotationLink = useMemo(() => {
          const url = new URL(window.location.href);
          if (entity.pk) {
            url.searchParams.set("annotation", entity.pk);
          }
          // In case of targeting directly an annotation, we don't want to show the region in the URL
          // otherwise it will be shown as a region link
          url.searchParams.delete("region");
          return url.toString();
        }, [entity.pk]);
        const [copyLink] = useCopyText({ defaultText: annotationLink });
        const toast = useToast();
        const dropdown = useDropdown();
        const clickHandler = () => {
          onAnnotationChange?.();
          dropdown?.close();
        };
        const setGroundTruth = useCallback<MenuActionOnClick>(() => {
          entity.setGroundTruth(!isGroundTruth);
          clickHandler();
        }, [entity]);
        const duplicateAnnotation = useCallback<MenuActionOnClick>(() => {
          const c = annotationStore.addAnnotationFromPrediction(entity);

          window.setTimeout(() => {
            annotationStore.selectAnnotation(c.id);
            clickHandler();
          });
        }, [entity]);
        const linkAnnotation = useCallback<MenuActionOnClick>(() => {
          copyLink();
          dropdown?.close();
          toast.show({
            message: t("lsf.annotation_button.link_copied", "Annotation link copied to clipboard"),
            type: ToastType.info,
          });
        }, [entity, copyLink, t]);
        const deleteAnnotation = useCallback(() => {
          clickHandler();
          confirm({
            title: t("lsf.annotation_button.delete_title", "Delete annotation?"),
            body: (
              <>
                {/* 使用 dangerouslySetInnerHTML 或拆分翻译来保留 strong 标签效果 */}
                <div dangerouslySetInnerHTML={{ __html: t("lsf.annotation_button.delete_body", "This will <strong>delete all existing regions</strong>. Are you sure you want to delete them?<br />This action cannot be undone.").replace('<br />', '<br/>') }} />
              </>
            ),
            buttonLook: "negative",
            okText: t("lsf.annotation_button.delete_confirm", "Delete"),
            okText: t("common.delete", "Delete"), // 或者复用 common delete
            onOk: () => {
              entity.list.deleteAnnotation(entity);
            },
          });
        }, [entity, t]);
        const isPrediction = entity.type === "prediction";
        const isDraft = !isDefined(entity.pk);
        const showGroundTruth = capabilities.groundTruthEnabled && !isPrediction && !isDraft;
        const showDuplicateAnnotation = capabilities.enableCreateAnnotation && !isDraft;
        const actions = useMemo<ContextMenuAction[]>(
          () => [
            {
              label: isGroundTruth
                ? t("lsf.annotation_button.unset_ground_truth", "Unset as Ground Truth")
                : t("lsf.annotation_button.set_ground_truth", "Set as Ground Truth"),
              onClick: setGroundTruth,
              icon: isGroundTruth ? (
                <IconStar color="#FFC53D" width={iconSize} height={iconSize} />
              ) : (
                <IconStarOutline width={iconSize} height={iconSize} />
              ),
              enabled: showGroundTruth,
            },
            {
              label: t("lsf.annotation_button.duplicate", "Duplicate Annotation"),
              onClick: duplicateAnnotation,
              icon: <IconDuplicate width={20} height={20} />,
              enabled: showDuplicateAnnotation,
            },
            {
              label: t("lsf.annotation_button.copy_link", "Copy Annotation Link"),
              onClick: linkAnnotation,
              icon: <IconLink />,
              enabled: !isDraft && store.hasInterface("annotations:copy-link"),
            },
            {
              label: t("lsf.annotation_button.delete", "Delete Annotation"),
              onClick: deleteAnnotation,
              icon: <IconTrashRect />,
              separator: true,
              danger: true,
              enabled: capabilities.enableAnnotationDelete && !isPrediction,
            },
          ],
          [
            entity,
            isGroundTruth,
            isPrediction,
            isDraft,
            capabilities.enableAnnotationDelete,
            capabilities.enableCreateAnnotation,
            capabilities.groundTruthEnabled,
            t,
          ],
        );

        return <ContextMenu actions={actions} />;
      }),
    );

    return (
      <div className={cn("annotation-button").mod({ selected: entity.selected }).toClassName()}>
        <div className={cn("annotation-button").elem("mainSection").toClassName()} onClick={clickHandler}>
          <div className={cn("annotation-button").elem("picSection").toClassName()}>
            <Userpic
              className={cn("annotation-button").elem("userpic").mod({ prediction: isPrediction }).toClassName()}
              showUsernameTooltip
              username={isPrediction ? entity.createdBy : null}
              user={hiddenUser ?? entity.user ?? { email: entity.createdBy }}
              size={24}
              block="lsf-annotation-button"
            >
              {isPrediction && <IconSparks style={{ width: 18, height: 18 }} />}
            </Userpic>
            {/* TODO: Remove block. Selenium is using this anchor that was mistakenly propagated into this element. */}
            {/* to do: return these icons when we have a better way to grab the history action type */}
            {/* {historyActionType === 'accepted' && <Elem name='status' mod={{ approved: true }}><IconCheckBold /></Elem>}
          {historyActionType && (
            <Elem name='status' mod={{ skipped: true }}>
              <IconCrossBold />
            </Elem>
          )}
          {entity.history.canUndo && (
            <Elem name='status' mod={{ updated: true }}>
              <IconCheckBold />
            </Elem>
          )} */}
          </div>
          <div className={cn("annotation-button").elem("main").toClassName()}>
            <div className={cn("annotation-button").elem("user").toClassName()}>
              <span className={cn("annotation-button").elem("name").toClassName()}>
                {hiddenUser ? hiddenUser.email : username}
              </span>
              {!infoIsHidden && (
                <span className={cn("annotation-button").elem("entity-id").toClassName()}>
                  #{entity.pk ?? entity.id}
                </span>
              )}
            </div>
            {!infoIsHidden && (
              <div className={cn("annotation-button").elem("info").toClassName()}>
                <TimeAgo className={cn("annotation-button").elem("date").toClassName()} date={entity.createdDate} />
                {isPrediction && isDefined(entity.score) && (
                  <span title={`Prediction score = ${entity.score}`}>
                    {" · "} {(entity.score * 100).toFixed(2)}%
                  </span>
                )}
              </div>
            )}
          </div>
          {!isPrediction && (
            <div className={cn("annotation-button").elem("icons").toClassName()}>
              {entity.draftId > 0 && (
                <Tooltip title={t("lsf.annotation_button.draft", "Draft")}>
                  <div className={cn("annotation-button").elem("icon").mod({ draft: true }).toClassName()}>
                    <IconDraftCreated2 color="#617ADA" />
                  </div>
                </Tooltip>
              )}
              {entity.skipped && (
                <Tooltip title={t("lsf.annotation_button.skipped", "Skipped")}>
                  <div className={cn("annotation-button").elem("icon").mod({ skipped: true }).toClassName()}>
                    <IconAnnotationSkipped2 color="#DD0000" />
                  </div>
                </Tooltip>
              )}
              {isGroundTruth && (
                <Tooltip title={t("lsf.annotation_button.ground_truth", "Ground-truth")}>
                  <div className={cn("annotation-button").elem("icon").mod({ groundTruth: true }).toClassName()}>
                    <IconAnnotationGroundTruth />
                  </div>
                </Tooltip>
              )}
              {CommentIcon && (
                <Tooltip title={renderCommentTooltip(entity, t)}>
                  <div className={cn("annotation-button").elem("icon").mod({ comments: true }).toClassName()}>
                    <CommentIcon />
                  </div>
                </Tooltip>
              )}
            </div>
          )}
        </div>
        <ContextMenuTrigger
          className={cn("annotation-button").elem("trigger").toClassName()}
          content={
            <AnnotationButtonContextMenu
              entity={entity}
              capabilities={capabilities}
              annotationStore={annotationStore}
            />
          }
        />
      </div>
    );
  },
);
