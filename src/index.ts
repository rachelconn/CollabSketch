import paper from 'paper';
import createBrushTool from './tools/brush';
import createEraserTool from './tools/eraser';


window.onload = function() {
  // Initialize canvas
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  paper.setup(canvas);
  const brushTool = createBrushTool();
  const eraserTool = createEraserTool();
  paper.tool = eraserTool;
}
