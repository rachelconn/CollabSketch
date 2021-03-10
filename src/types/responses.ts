import { DeserializedPath, SerializedPath } from "./serialization";

// Interfaces for responses received from the server.
export interface ListPathsResponse {
  type: 'listPaths',
  paths: DeserializedPath[],
}

export interface EditPathResponse {
  type: 'pathEdited',
  path: string,
}

export interface DeletePathResponse {
  type: 'pathDeleted',
  pathID: string,
}

export type PathResponse = ListPathsResponse | EditPathResponse | DeletePathResponse;

export interface UserResponse {
  type: 'users',
  count: number,
}

type SocketResponse = PathResponse | UserResponse;
export default SocketResponse;
