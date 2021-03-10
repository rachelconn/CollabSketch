import paper from 'paper';
import createBrushTool from './tools/brush';
import createEraserTool from './tools/eraser';
import registerToolToKey from './tools/registerToolToKey';

window.onload = function() {
  // Initialize canvas
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  paper.setup(canvas);

  // Initialize tools
  const brushTool = createBrushTool();
  const eraserTool = createEraserTool();
  paper.tool = brushTool;

  // Hotkey setup
  registerToolToKey(brushTool, '1');
  registerToolToKey(eraserTool, '2');
}
