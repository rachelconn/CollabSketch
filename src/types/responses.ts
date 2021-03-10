import { SerializedItem } from "./serialization";

// Interfaces for responses received from the server.
export interface ListItemsResponse {
  type: 'listItems',
  items: SerializedItem[],
}

export interface EditItemResponse {
  type: 'itemEdited',
  item: SerializedItem,
}

export interface DeleteItemResponse {
  type: 'itemDeleted',
  itemID: string,
}

export type PathResponse = ListItemsResponse | EditItemResponse | DeleteItemResponse;

export interface UserResponse {
  type: 'users',
  count: number,
}

type SocketResponse = PathResponse | UserResponse;
export default SocketResponse;
