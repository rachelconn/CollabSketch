// Interfaces for actions to send to the server.
// interface Shape {
//   ID: string;
//   updated: number;
// }

export interface CreatePathAction {
  action: 'createPath';
  pathID: string;
  pathData: string;
}

export interface UpdatePathAction {
  action: 'updatePath';
  pathID: string;
  pathData: string;
}

export interface DeletePathAction {
  action: 'deletePath';
  pathID: string;
}

// interface RequestShapesAction {
//   action: 'requestShapes';
//   shapes: Shape[];
// }

type SocketAction = CreatePathAction | UpdatePathAction | DeletePathAction;

export default SocketAction;
