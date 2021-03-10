import paper from 'paper';

export type SerializedPoint = [number, number];

export interface SerializedPath {
  points: SerializedPoint[],
  strokeColor: string;
  fillColor: string;
}

export interface DeserializedPath {
  id: string;
  path: string;
}
