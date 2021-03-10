import paper from 'paper';
import { Paths } from '../types/responses';

type SerializedPoint = [number, number];

interface SerializedPath {
  points: SerializedPoint[],
  strokeColor: string;
  fillColor: string;
}

export function serializePath(path: paper.Path): string {
  const points: SerializedPoint[] = [];
  for (let i = 0; i < path.length; i++) points.push(path.getPointAt[i]);

  const serialized: SerializedPath = {
    points,
    strokeColor: path.strokeColor.toString(),
    fillColor: path.fillColor.toString(),
  };
  return JSON.stringify(serialized);
}

function deserializePath(path: string): paper.Path {
  // TODO: implement
  const { points, strokeColor, fillColor }: SerializedPath = JSON.parse(path);

  // Don't render the new point - 
  return new paper.Path({
    segments: points,
    strokeColor: new paper.Color(strokeColor),
    fillColor: new paper.Color(fillColor),
    insert: false,
  });
}

/**
 * Deserializes the Paths string returned from the server into an array of [id, paper.Path] tuples.
 * @param paths Paths string from server response to deserialize
 */
export function deserializePaths(paths: Paths): [string, paper.Path][] {
  return Object.entries(paths).map(([id, path]) => [id, deserializePath(path)]);
}
