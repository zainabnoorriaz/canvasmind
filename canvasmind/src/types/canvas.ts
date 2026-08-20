// A single point on the canvas
export interface Position {
  x: number;
  y: number;
}

// The kinds of objects that can exist on the board
export type NodeType = "text" | "rect" | "circle" | "line" | "star";

// Base shape shared by every object on the canvas
export interface CanvasNode {
  id: string;
  type: NodeType;
  position: Position;
}

// A text box on the board
export interface TextNode extends CanvasNode {
  type: "text";
  content: string;
  width: number;
  fontSize: number;
  isAI?: boolean;
}

// A rectangle (or square, same shape with equal width/height)
export interface ShapeNode extends CanvasNode {
  type: "rect";
  width: number;
  height: number;
  fill: string;
}

// A circle
export interface CircleNode extends CanvasNode {
  type: "circle";
  radius: number;
  fill: string;
}

// A star
export interface StarNode extends CanvasNode {
  type: "star";
  numPoints: number;
  innerRadius: number;
  outerRadius: number;
  fill: string;
}

// A freehand pencil stroke — points is a flat array [x1, y1, x2, y2, ...]
export interface LineNode extends CanvasNode {
  type: "line";
  points: number[];
  stroke: string;
  strokeWidth: number;
}