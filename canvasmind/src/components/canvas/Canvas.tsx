"use client";
import React from "react";
import {
  Type,
  RectangleHorizontal,
  Square as SquareIcon,
  Circle as CircleIcon,
  Star as StarIcon,
  Pencil as PencilIcon,
  MousePointer2,
  Eraser as EraserIcon,
} from "lucide-react";

import { Stage, Layer, Rect, Text, Line, Circle, Star } from "react-konva";
import CatMascot from "./CatMascot";
import AIPanel, { ChatMessage } from "./AIPanel";
import { useState, useEffect, useRef } from "react";
import type Konva from "konva";
import type { CanvasNode } from "@/types/canvas";

export default function Canvas() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const isDrawingSelection = useRef(false);
  const selectionStart = useRef({ x: 0, y: 0 });
  const selectionBoxRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const [drawMode, setDrawMode] = useState(false);
  const isDrawingLine = useRef(false);
  const [pencilColor, setPencilColor] = useState("#1a1a1a");
  const linePointsRef = useRef<number[]>([]);
  const liveLineRef = useRef<Konva.Line>(null);

  const [eraserMode, setEraserMode] = useState(false);
  const [shapeColor, setShapeColor] = useState("#4C5FD5");

  const [aiLoading, setAiLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMessages, setPanelMessages] = useState<ChatMessage[]>([]);
  const [panelThumbnail, setPanelThumbnail] = useState("");
  const [panelLoading, setPanelLoading] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !editingId) {
        setNodes((prev) => prev.filter((n) => n.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, editingId]);

  useEffect(() => {
    if (editingId && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDrawingLine.current) {
        isDrawingLine.current = false;
        if (linePointsRef.current.length > 2) {
          const newNode: CanvasNode = {
            id: crypto.randomUUID(),
            type: "line",
            position: { x: 0, y: 0 },
            points: linePointsRef.current,
            stroke: pencilColor,
            strokeWidth: 3,
          } as CanvasNode;
          setNodes((prev) => [...prev, newNode]);
        }
        linePointsRef.current = [];
        liveLineRef.current?.points([]);
        liveLineRef.current?.getLayer()?.batchDraw();
      }

      if (isDrawingSelection.current) {
        isDrawingSelection.current = false;
        if (selectionBoxRef.current) {
          setSelectionBox(selectionBoxRef.current);
        }
      }
    };
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [pencilColor]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    if (selectMode || drawMode) return;

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const addText = () => {
    const newNode: CanvasNode = {
      id: crypto.randomUUID(),
      type: "text",
      position: { x: 200, y: 200 },
      content: "Double-click to edit",
      width: 150,
      fontSize: 18,
    } as CanvasNode;
    setNodes([...nodes, newNode]);
  };

  const addRectangle = () => {
    const newNode: CanvasNode = {
      id: crypto.randomUUID(),
      type: "rect",
      position: { x: 300, y: 300 },
      width: 150,
      height: 100,
      fill: shapeColor,
    } as CanvasNode;
    setNodes([...nodes, newNode]);
  };

  const addSquare = () => {
    const newNode: CanvasNode = {
      id: crypto.randomUUID(),
      type: "rect",
      position: { x: 300, y: 300 },
      width: 120,
      height: 120,
      fill: shapeColor,
    } as CanvasNode;
    setNodes([...nodes, newNode]);
  };

  const addCircle = () => {
    const newNode: CanvasNode = {
      id: crypto.randomUUID(),
      type: "circle",
      position: { x: 350, y: 350 },
      radius: 60,
      fill: shapeColor,
    } as CanvasNode;
    setNodes([...nodes, newNode]);
  };

  const addStar = () => {
    const newNode: CanvasNode = {
      id: crypto.randomUUID(),
      type: "star",
      position: { x: 350, y: 350 },
      numPoints: 5,
      innerRadius: 30,
      outerRadius: 60,
      fill: shapeColor,
    } as CanvasNode;
    setNodes([...nodes, newNode]);
  };

  const disableStageDrag = () => {
    stageRef.current?.draggable(false);
  };

  const enableStageDrag = () => {
    if (!selectMode && !drawMode && !eraserMode) stageRef.current?.draggable(true);
  };

  const getCanvasPointer = () => {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!stage || !pointer) return null;
    return {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale,
    };
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== stageRef.current) return;

    if (drawMode) {
      const p = getCanvasPointer();
      if (!p) return;
      isDrawingLine.current = true;
      linePointsRef.current = [p.x, p.y];
      liveLineRef.current?.points(linePointsRef.current);
      liveLineRef.current?.getLayer()?.batchDraw();
      return;
    }

    if (selectMode) {
      const p = getCanvasPointer();
      if (!p) return;
      isDrawingSelection.current = true;
      selectionStart.current = p;
      selectionBoxRef.current = { x: p.x, y: p.y, width: 0, height: 0 };
      setSelectionBox(selectionBoxRef.current);
      setAiError(null);
    } else {
      setSelectedId(null);
    }
  };

  const handleStageMouseMove = () => {
    if (drawMode && isDrawingLine.current) {
      const p = getCanvasPointer();
      if (!p) return;
      linePointsRef.current = [...linePointsRef.current, p.x, p.y];
      liveLineRef.current?.points(linePointsRef.current);
      liveLineRef.current?.getLayer()?.batchDraw();
      return;
    }

    if (!isDrawingSelection.current) return;
    const p = getCanvasPointer();
    if (!p) return;
    const start = selectionStart.current;
    const box = {
      x: Math.min(start.x, p.x),
      y: Math.min(start.y, p.y),
      width: Math.abs(p.x - start.x),
      height: Math.abs(p.y - start.y),
    };
    selectionBoxRef.current = box;
    if (selectionRectRef.current) {
      selectionRectRef.current.setAttrs(box);
      selectionRectRef.current.getLayer()?.batchDraw();
    }
  };

  const toggleSelectMode = () => {
    setDrawMode(false);
    setEraserMode(false);
    setSelectMode((prev) => {
      const next = !prev;
      stageRef.current?.draggable(!next);
      if (!next) setSelectionBox(null);
      return next;
    });
  };

  const toggleDrawMode = () => {
    setSelectMode(false);
    setEraserMode(false);
    setSelectionBox(null);
    setDrawMode((prev) => {
      const next = !prev;
      stageRef.current?.draggable(!next);
      return next;
    });
  };

  const toggleEraserMode = () => {
    setSelectMode(false);
    setDrawMode(false);
    setSelectionBox(null);
    setEraserMode((prev) => {
      const next = !prev;
      stageRef.current?.draggable(!next);
      return next;
    });
  };

  const askAI = async (action: string) => {
    const stage = stageRef.current;
    if (!stage || !selectionBox) return;

    setAiLoading(true);
    setLoadingAction(action);
    setAiError(null);

    try {
      const exportRect = {
        x: selectionBox.x * scale + position.x,
        y: selectionBox.y * scale + position.y,
        width: selectionBox.width * scale,
        height: selectionBox.height * scale,
      };

      const dataUrl = stage.toDataURL({
        x: exportRect.x,
        y: exportRect.y,
        width: exportRect.width,
        height: exportRect.height,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();

      const formData = new FormData();
      formData.append("image", blob, "selection.png");
      formData.append("action", action);

      const response = await fetch("http://127.0.0.1:8000/explain-region", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error, please try again");
      const data = await response.json();
      const cleaned = data.result.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#+\s?/g, "");

      const noteWidth = Math.min(480, Math.max(selectionBox.width, 220, Math.sqrt(cleaned.length) * 22));
      const aiNode: CanvasNode = {
        id: crypto.randomUUID(),
        type: "text",
        position: {
          x: selectionBox.x,
          y: selectionBox.y + selectionBox.height + 16,
        },
        content: cleaned,
        width: noteWidth,
        fontSize: 14,
        isAI: true,
      } as CanvasNode;
      setNodes((prev) => [...prev, aiNode]);
      setSelectionBox(null);

      setPanelThumbnail(dataUrl);
      setPanelMessages([{ role: "ai", text: cleaned }]);
      setPanelOpen(true);
    } catch (err) {
      setAiError("Something went wrong reaching the AI. Is the backend running?");
    } finally {
      setAiLoading(false);
      setLoadingAction(null);
    }
  };
  const handleSendFollowup = async (question: string) => {
    if (!panelThumbnail) return;
    const userMsg: ChatMessage = { role: "user", text: question };
    const historyText = panelMessages.map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`).join("\n");
    setPanelMessages((prev) => [...prev, userMsg]);
    setPanelLoading(true);

    try {
      const blob = await (await fetch(panelThumbnail)).blob();
      const formData = new FormData();
      formData.append("image", blob, "selection.png");
      formData.append("history", historyText);
      formData.append("question", question);

      const response = await fetch("http://127.0.0.1:8000/chat-followup", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const cleaned = data.result.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#+\s?/g, "");
      setPanelMessages((prev) => [...prev, { role: "ai", text: cleaned }]);
    } catch (err) {
      setPanelMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong reaching the AI." }]);
    } finally {
      setPanelLoading(false);
    }
  };
  const finishEditing = (nodeId: string, newContent: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, content: newContent } as CanvasNode : n))
    );
    setEditingId(null);
  };

  const editingNode = nodes.find((n) => n.id === editingId) as any;

  const askButtonPosition = selectionBox
    ? {
        left: selectionBox.x * scale + position.x,
        top: (selectionBox.y + selectionBox.height) * scale + position.y + 8,
      }
    : null;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#FBEAF0",
          border: "2px solid #F4C0D1",
          borderRadius: 999,
          padding: "8px 12px",
          boxShadow: "0 4px 14px rgba(212,83,126,0.15)",
        }}
      >
        <button
          onClick={addText}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, border: "none", background: "#fff", fontSize: 13, fontWeight: 500, color: "#993556", cursor: "pointer" }}
        >
          <Type size={16} /> Text
        </button>
        <button
          onClick={addRectangle}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, border: "none", background: "#fff", fontSize: 13, fontWeight: 500, color: "#993556", cursor: "pointer" }}
        >
          <RectangleHorizontal size={16} /> Rectangle
        </button>
        <button
          onClick={addSquare}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, border: "none", background: "#fff", fontSize: 13, fontWeight: 500, color: "#993556", cursor: "pointer" }}
        >
          <SquareIcon size={16} /> Square
        </button>
        <button
          onClick={addCircle}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, border: "none", background: "#fff", fontSize: 13, fontWeight: 500, color: "#993556", cursor: "pointer" }}
        >
          <CircleIcon size={16} /> Circle
        </button>
        <button
          onClick={addStar}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, border: "none", background: "#fff", fontSize: 13, fontWeight: 500, color: "#993556", cursor: "pointer" }}
        >
          <StarIcon size={16} /> Star
        </button>

        <div style={{ width: 2, height: 26, background: "#F0997B", borderRadius: 1, margin: "0 4px" }} />

        <div style={{ display: "flex", gap: 8, padding: "0 6px" }}>
          {[
            { color: "#4B4E9E" },
            { color: "#E24B4A" },
            { color: "#F2789F" },
            { color: "#EF9F27" },
            { color: "#639922" },
          ].map((c) => (
            <button
              key={c.color}
              onClick={() => setShapeColor(c.color)}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: c.color,
                border: "3px solid #FBEAF0",
                boxShadow: shapeColor === c.color ? `0 0 0 2px ${c.color}` : "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        <div style={{ width: 2, height: 26, background: "#F0997B", borderRadius: 1, margin: "0 4px" }} />

        <button
          onClick={toggleDrawMode}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: "none", background: drawMode ? "#D4537E" : "#fff", color: drawMode ? "#fff" : "#993556", cursor: "pointer" }}
        >
          <PencilIcon size={18} />
        </button>
        <button
          onClick={toggleSelectMode}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: "none", background: selectMode ? "#D4537E" : "#fff", color: selectMode ? "#fff" : "#993556", cursor: "pointer" }}
        >
          <MousePointer2 size={18} />
        </button>
        <button
          onClick={toggleEraserMode}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 999, border: "none", background: eraserMode ? "#D4537E" : "#fff", color: eraserMode ? "#fff" : "#993556", cursor: "pointer" }}
        >
          <EraserIcon size={18} />
        </button>

        {drawMode && (
          <div style={{ display: "flex", gap: 6, paddingLeft: 6 }}>
            {[
              { color: "#1a1a1a" },
              { color: "#FF3B30" },
              { color: "#FF6FB5" },
              { color: "#FFD60A" },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => setPencilColor(c.color)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: c.color,
                  border: "3px solid #FBEAF0",
                  boxShadow: pencilColor === c.color ? `0 0 0 2px ${c.color}` : "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {askButtonPosition && selectionBox && selectionBox.width > 5 && selectionBox.height > 5 && (
        <div
          style={{
            position: "absolute",
            left: askButtonPosition.left,
            top: askButtonPosition.top,
            zIndex: 15,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            maxWidth: 260,
          }}
        >
          {[
            { action: "explain", label: "Explain" },
            { action: "simplify", label: "Simplify" },
            { action: "find_mistakes", label: "Find Mistakes" },
            { action: "expand", label: "Expand" },
            { action: "examples", label: "Examples" },
          ].map((opt) => (
            <button
              key={opt.action}
              onClick={() => askAI(opt.action)}
              disabled={aiLoading}
              style={{
                padding: "6px 12px",
                background: "#4C5FD5",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {loadingAction === opt.action ? "..." : opt.label}
            </button>
          ))}
        </div>
      )}

      {aiError && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            background: "#F6F4FB",
            borderLeft: "1px solid #ddd",
            padding: 16,
            zIndex: 20,
            overflowY: "auto",
          }}
        >
          <button onClick={() => setAiError(null)} style={{ marginBottom: 12 }}>
            Close
          </button>
          <p style={{ color: "#FF6B6B" }}>{aiError}</p>
        </div>
      )}

      {editingNode && (
        <textarea
          ref={textAreaRef}
          defaultValue={editingNode.content}
          onBlur={(e) => finishEditing(editingNode.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              finishEditing(editingNode.id, e.currentTarget.value);
            }
          }}
          style={{
            position: "absolute",
            top: editingNode.position.y * scale + position.y,
            left: editingNode.position.x * scale + position.x,
            width: editingNode.width * scale,
            fontSize: editingNode.fontSize * scale,
            border: "1px solid #4C5FD5",
            padding: 0,
            margin: 0,
            background: "white",
            zIndex: 20,
            resize: "none",
          }}
        />
      )}

      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        draggable={!selectMode && !drawMode && !eraserMode}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setPosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        <Layer>
          {nodes.map((node) => {
            const isSelected = node.id === selectedId;
            const isEditing = node.id === editingId;

            const handleNodeDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
              enableStageDrag();
              setNodes((prev) =>
                prev.map((n) =>
                  n.id === node.id
                    ? { ...n, position: { x: e.target.x(), y: e.target.y() } }
                    : n
                )
              );
            };

            const handleClick = () => {
              if (eraserMode) {
                setNodes((prev) => prev.filter((n) => n.id !== node.id));
                return;
              }
              if (!selectMode && !drawMode) setSelectedId(node.id);
            };

            if (node.type === "text") {
              const t = node as any;
              if (isEditing) return null;

              const charsPerLine = Math.max(1, Math.floor(t.width / (t.fontSize * 0.55)));
              const rawLines = t.content.split("\n");
              const estLines = rawLines.reduce(
                (total: number, line: string) => total + Math.max(1, Math.ceil(line.length / charsPerLine)),
                0
              );
              const estHeight = estLines * t.fontSize * 1.4 + 16;

              return (
                <React.Fragment key={t.id}>
                  {t.isAI && (
                    <>
                      <Rect
                        x={t.position.x - 10}
                        y={t.position.y - 8}
                        width={t.width + 20}
                        height={estHeight}
                        fill="#FBEAF0"
                        stroke="#ED93B1"
                        strokeWidth={2.5}
                        cornerRadius={16}
                        listening={false}
                      />
                      <Circle
                        x={t.position.x + 6}
                        y={t.position.y - 8}
                        radius={12}
                        fill="#F2789F"
                        stroke="#FBEAF0"
                        strokeWidth={3}
                        listening={false}
                      />
                      <Star
                        x={t.position.x + 6}
                        y={t.position.y - 8}
                        numPoints={4}
                        innerRadius={2.5}
                        outerRadius={6}
                        fill="#ffffff"
                        listening={false}
                      />
                      <Star
                        x={t.position.x + t.width + 12}
                        y={t.position.y - 8 + estHeight + 6}
                        numPoints={4}
                        innerRadius={3}
                        outerRadius={8}
                        fill="#AFA9EC"
                        listening={false}
                      />
                    </>
                  )}
                  <Text
                    x={t.position.x}
                    y={t.position.y}
                    text={t.content}
                    fontSize={t.fontSize}
                    width={t.width}
                    draggable={!selectMode && !drawMode && !eraserMode}
                    onClick={handleClick}
                    onTap={handleClick}
                    onDblClick={() => !selectMode && !drawMode && !eraserMode && setEditingId(t.id)}
                    onDblTap={() => !selectMode && !drawMode && !eraserMode && setEditingId(t.id)}
                    onDragStart={disableStageDrag}
                    onDragEnd={handleNodeDragEnd}
                    stroke={isSelected ? "#4C5FD5" : undefined}
                    strokeWidth={isSelected ? 1 : 0}
                  />
                </React.Fragment>
              );
            }

            if (node.type === "rect") {
              const s = node as any;
              return (
                <Rect
                  key={s.id}
                  x={s.position.x}
                  y={s.position.y}
                  width={s.width}
                  height={s.height}
                  fill={s.fill}
                  draggable={!selectMode && !drawMode && !eraserMode}
                  onClick={handleClick}
                  onTap={handleClick}
                  onDragStart={disableStageDrag}
                  onDragEnd={handleNodeDragEnd}
                  stroke={isSelected ? "#FF6B6B" : undefined}
                  strokeWidth={isSelected ? 3 : 0}
                />
              );
            }

            if (node.type === "circle") {
              const c = node as any;
              return (
                <Circle
                  key={c.id}
                  x={c.position.x}
                  y={c.position.y}
                  radius={c.radius}
                  fill={c.fill}
                  draggable={!selectMode && !drawMode && !eraserMode}
                  onClick={handleClick}
                  onTap={handleClick}
                  onDragStart={disableStageDrag}
                  onDragEnd={handleNodeDragEnd}
                  stroke={isSelected ? "#FF6B6B" : undefined}
                  strokeWidth={isSelected ? 3 : 0}
                />
              );
            }

            if (node.type === "star") {
              const st = node as any;
              return (
                <Star
                  key={st.id}
                  x={st.position.x}
                  y={st.position.y}
                  numPoints={st.numPoints}
                  innerRadius={st.innerRadius}
                  outerRadius={st.outerRadius}
                  fill={st.fill}
                  draggable={!selectMode && !drawMode && !eraserMode}
                  onClick={handleClick}
                  onTap={handleClick}
                  onDragStart={disableStageDrag}
                  onDragEnd={handleNodeDragEnd}
                  stroke={isSelected ? "#FF6B6B" : undefined}
                  strokeWidth={isSelected ? 3 : 0}
                />
              );
            }

            if (node.type === "line") {
              const l = node as any;
              return (
                <Line
                  key={l.id}
                  points={l.points}
                  stroke={l.stroke}
                  strokeWidth={l.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  onClick={handleClick}
                  onTap={handleClick}
                />
              );
            }

            return null;
          })}

          <Line
            ref={liveLineRef}
            points={[]}
            stroke={pencilColor}
            strokeWidth={3}
            lineCap="round"
            lineJoin="round"
            listening={false}
          />

          {selectionBox && (
            <Rect
              ref={selectionRectRef}
              x={selectionBox.x}
              y={selectionBox.y}
              width={selectionBox.width}
              height={selectionBox.height}
              stroke="#FF6B6B"
              strokeWidth={2}
              dash={[6, 4]}
              fill="rgba(255,107,107,0.1)"
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      <CatMascot />
      {panelOpen && (
        <AIPanel
          thumbnailDataUrl={panelThumbnail}
          selectedLabel="Selected region"
          messages={panelMessages}
          loading={panelLoading}
          onSend={handleSendFollowup}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}