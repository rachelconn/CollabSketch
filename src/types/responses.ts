// Interfaces for responses received from the server.
export type Paths = Record<string, string>;

export interface PathsResponse {
  type: 'paths',
  paths: Paths,
}

export interface UserResponse {
  type: 'users',
  count: number,
}

type SocketResponse = PathsResponse | UserResponse;
export default SocketResponse;
