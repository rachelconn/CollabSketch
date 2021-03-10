import paper from 'paper';
import { SerializedPath, SerializedPoint }  from '../types/serialization';

export function serializePath(path: paper.Path): string {
  const points: SerializedPoint[] = [];
  for (let i = 0; i < path.length; i++) {
    const {x, y} = path.getPointAt(i);
    points.push([x, y]);
  }
  console.log(points);

  const serialized: SerializedPath = {
    points,
    strokeColor: path.strokeColor?.toString(),
    fillColor: path.fillColor?.toString(),
  };
  console.log(serialized);
  return JSON.stringify(serialized);
}

export function deserializePath(path: string): paper.Path {
  // TODO: implement
  const { points, strokeColor, fillColor }: SerializedPath = JSON.parse(path);

  // Don't render the new point immediately - this will be handled by SynchronizedPath
  return new paper.Path({
    segments: points,
    strokeColor: new paper.Color(strokeColor),
    fillColor: new paper.Color(fillColor),
    insert: false,
  });
}
