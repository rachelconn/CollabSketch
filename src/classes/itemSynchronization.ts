import paper from 'paper';
import { DeleteItemAction, UpdateItemAction } from '../types/actions';
import { getItemType, ItemType, SerializedItem } from '../types/serialization';
import { deserializeItem } from '../utils/pathSerialization';
import send from '../utils/socket';

// Keep track of all items so those received from the server aren't duplicated
const itemIDs = new Map<paper.Item, string>();
const items = new Map<string, paper.Item>();

/**
 * Generates an ID for the server to use for a path.
 * Uses the current time in milliseconds and a random int [0, 999] to make collisions
 * very unlikely.
 */
function generateServerID(): string {
  return `${new Date().getTime()}-${Math.round(Math.random() * 1000)}`;
}

function getServerID(item: paper.Item): string {
  let serverID = itemIDs.get(item);
  if (serverID === undefined) {
    serverID = generateServerID();
    itemIDs.set(item, serverID);
    items.set(serverID, item);
  }
  return serverID;
}

/**
 * Uploads an item to the server to synchronize with other clients
 * @param item Item to send to the server
 */
export function sendItemToServer(item: paper.Item): void {
  const serverID = getServerID(item);

  const serializedItem: SerializedItem = {
    id: serverID,
    type: getItemType(item),
    data: item.exportJSON(),
  };

  const message: UpdateItemAction = {
    action: 'updateItem',
    item: serializedItem,
  };
  send(message);
}

/**
 * Removes an item locally by ID.
 * @param itemID ID of item to remove
 */
export function removeItemByID(itemID: string): void {
  const item = items.get(itemID);
  if (item) {
    item.remove();
    items.delete(itemID);
    itemIDs.delete(item);
  }
};

/**
 * Removes an item locally, as well as from the server (if it is being synchronized)
 * @param item Item to remove
 */
export function removeItem(item: paper.Item): void {
  console.log('removing item');
  // Remove locally
  item.remove();

  // Remove from server
  // If item isn't already synchronized, the server doesn't have it so no need to sync
  const itemID = itemIDs.get(item);
  if (itemID) {
    // Send message for other clients to delete
    const message: DeleteItemAction = {
      action: 'deleteItem',
      id: itemID,
    };
    send(message);
    console.log(message);

    itemIDs.delete(item);
    items.delete(itemID);
  }
}

/**
 * Creates or updates an item based on one received from the server.
 * @param item SerializedItem to synchronize
 */
export function createItemFor(item: SerializedItem): void {
  // Delete local item if needed so it can be updated to the one on the server
  items.get(item.id)?.remove();

  // Deserialize and save this item locally
  const deserialized = deserializeItem(item);
  itemIDs.set(deserialized, item.id);
  items.set(item.id, deserialized);
}
