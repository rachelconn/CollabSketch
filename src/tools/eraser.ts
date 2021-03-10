import paper from 'paper';
import { removeItem } from '../classes/itemSynchronization';

export default function createEraserTool(): paper.Tool {
  function erase(event: paper.ToolEvent): void {
    paper.project.activeLayer.children.forEach((item) => {
      if (item.hitTest(event.point)) {
        removeItem(item);
      }
    });
  }

  const tool = new paper.Tool();
  tool.onMouseDown = erase;
  tool.onMouseDrag = erase;
  return tool;
}
