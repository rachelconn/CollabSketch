import { SerializedItem } from "./serialization";

// Interfaces for actions to send to the server.

export interface CreateItemAction {
  action: 'createItem';
  item: SerializedItem;
}

export interface UpdateItemAction {
  action: 'updateItem';
  item: SerializedItem;
}

export interface DeleteItemAction {
  action: 'deleteItem';
  id: string;
}

type SocketAction = CreateItemAction | UpdateItemAction | DeleteItemAction;

export default SocketAction;
