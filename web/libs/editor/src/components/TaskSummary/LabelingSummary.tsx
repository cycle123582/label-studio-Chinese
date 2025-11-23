import { useMemo } from "react";
import { cnm, IconSparks, Userpic } from "@humansignal/ui";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type { MSTAnnotation, MSTResult, RawResult } from "../../stores/types";
import { renderers } from "./labelings";
import { ResizeHandler } from "./ResizeHandler";
import { SummaryBadge } from "./SummaryBadge";
import type { AnnotationSummary, ControlTag, RendererType } from "./types";

type Props = {
  annotations: MSTAnnotation[];
  controls: ControlTag[];
  onSelect: (entity: AnnotationSummary) => void;
  hideInfo: boolean;
};

const cellFn = (control: ControlTag, render: RendererType) => (props: { row: Row<AnnotationSummary> }) => {
  const annotation = props.row.original;
  const results = annotation.results.filter((result) => result.from_name === control.name);
  const content = !results.length
    ? "-"
    : (render?.(results, control) ?? `${results.length} result${results.length > 1 ? "s" : ""}`);
  return content;
};

const convertPredictionResult = (result: MSTResult) => {
  const json = result.toJSON() as RawResult;
  return {
    ...json,
    // those are real results, so they have full names with @annotation-id postfix
    from_name: json.from_name.replace(/@.*$/, ""),
  };
};

const columnHelper = createColumnHelper<AnnotationSummary>();

export const LabelingSummary = ({ hideInfo, annotations: all, controls, onSelect }: Props) => {
  const currentUser = window.APP_SETTINGS?.user;
  const annotations: AnnotationSummary[] = all.map((annotation) => ({
    id: annotation.pk,
    type: annotation.type,
    user: hideInfo ? { email: currentUser?.id === annotation.user?.id ? "Me" : "User" } : annotation.user,
    createdBy:
      annotation.type === "prediction"
        ? annotation.createdBy
        : hideInfo
          ? currentUser?.id === annotation.user?.id
            ? "Me"
            : "User"
          : (annotation.user?.displayName ?? "User"),
    results:
      annotation.type === "prediction"
        ? (annotation.results?.map(convertPredictionResult) ?? [])
        : (annotation.versions.result ?? []),
  }));
  const columns = useMemo(() => {
    const columns: ColumnDef<AnnotationSummary, unknown>[] = controls.map((control) =>
      columnHelper.display({
        id: control.name,
        header: () => (
          <>
            {control.name}{" "}
            <SummaryBadge>
              {control.per_region ? "per-region " : ""}
              {control.type}
            </SummaryBadge>
          </>
        ),
        cell: cellFn(control, renderers[control.type]),
        size: 250,
      }),
    );
    columns.unshift({
      header: "Annotation ID",
      accessorKey: "id",
      size: 200,
      minSize: 150,
      cell: ({ row }) => {
        const annotation = row.original;

        return (
          <button
            type="button"
            className="flex gap-tight items-center cursor-pointer"
            onClick={() => onSelect(annotation)}
          >
            <Userpic
              user={annotation.user}
              className={annotation.type === "prediction" ? "!bg-accent-plum-subtle text-accent-plum-bold" : ""}
            >
              {annotation.type === "prediction" && <IconSparks size={18} />}
            </Userpic>
            <span>{annotation.createdBy}</span>
            {!hideInfo && <span>#{annotation.id}</span>}
          </button>
        );
      },
    });
    return columns;
  }, [controls, onSelect]);

  const table = useReactTable<AnnotationSummary>({
    data: annotations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 80,
      maxSize: 800,
    },
  });

  return (
    <div className="overflow-x-auto pb-tight mb-base">
      <div className="border border-neutral-border rounded-small border-collapse overflow-hidden w-max">
        <div>
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className={cnm(
                "flex [&>*]:flex-shrink-0 [&>*]:px-4 [&>*]:py-2 bg-neutral-surface",
                "[&>*]:text-left [&>*]:whitespace-nowrap",
              )}
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    position: "relative",
                  }}
                >
                  <div className="overflow-hidden text-ellipsis">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                  <ResizeHandler header={header} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={cnm(
                "flex [&>*]:flex-shrink-0 even:bg-neutral-surface [&_td]:align-top [&>*]:px-4 [&>*]:py-2",
                "[&>*]:overflow-hidden [&>*]:text-ellipsis",
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
