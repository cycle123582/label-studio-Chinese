import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import { useAtom } from "jotai";
import { CodeEditor } from "@humansignal/ui";
import { BottomPanel } from "../BottomPanel";
import { configAtom } from "../../atoms/configAtoms";
import { editorExtensions, editorOptions } from "../../utils/codeEditor";

const COLLAPSED_PANEL_HEIGHT = 33;
const DEFAULT_PANEL_HEIGHT = 300;
const MIN_PANEL_HEIGHT = 100;
const MAX_PANEL_HEIGHT = 800;

export const EditorPanel = ({ editorWidth }: { editorWidth: number }) => {
  const [config, setConfig] = useAtom(configAtom);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(DEFAULT_PANEL_HEIGHT);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag logic for vertical resize
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      startY.current = e.clientY;
      startHeight.current = bottomPanelHeight;
    },
    [bottomPanelHeight],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    const delta = startY.current - e.clientY;
    const newHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, startHeight.current + delta));
    setBottomPanelHeight(newHeight);
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const handleDividerDoubleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setBottomPanelHeight(DEFAULT_PANEL_HEIGHT);
    },
    [setBottomPanelHeight],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
    window.addEventListener("mouseup", handleMouseUp as unknown as EventListener);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
      window.removeEventListener("mouseup", handleMouseUp as unknown as EventListener);
    };
  }, [handleMouseMove, handleMouseUp]);

  const bottomPanelStyle = useMemo(() => {
    if (isCollapsed) return { height: COLLAPSED_PANEL_HEIGHT };
    return {
      height: bottomPanelHeight,
    };
  }, [bottomPanelHeight, isCollapsed]);

  return (
    <div ref={containerRef} className="flex flex-col min-w-0 h-full" style={{ width: `${editorWidth}%` }}>
      {/* CodeEditor (top) */}
      <div className="flex-1 min-h-0">
        <CodeEditor
          ref={editorRef}
          value={config}
          onBeforeChange={(_editor: any, _data: any, value: string) => setConfig(value)}
          border={false}
          controlled
          // @ts-ignore
          autoCloseTags
          smartIndent
          detach
          extensions={editorExtensions}
          options={editorOptions}
        />
      </div>
      {/* Divider for resizing (only when not collapsed) */}
      {!isCollapsed && (
        <div
          className="h-2 cursor-row-resize bg-neutral-emphasis hover:bg-primary-border active:bg-primary-border transition-colors duration-100 z-10"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDividerDoubleClick}
          role="separator"
          aria-orientation="horizontal"
          tabIndex={-1}
        />
      )}
      {/* BottomPanel (Input/Output) */}
      <div style={bottomPanelStyle}>
        <BottomPanel isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
    </div>
  );
};
