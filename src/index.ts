import paper from 'paper';
import createBrushTool from './tools/brush';


window.onload = function() {
  // Initialize canvas
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  paper.setup(canvas);
  const tool = createBrushTool();
  paper.tool = tool;
}
