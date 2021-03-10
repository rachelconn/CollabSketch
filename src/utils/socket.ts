import { createItemFor, removeItemByID } from '../classes/itemSynchronization';
import SocketAction from '../types/actions';
import SocketResponse from '../types/responses';

// Global WebSocket
const socket = new WebSocket('ws://localhost:12345');

// Handle message receiving
function handleMessage(e: MessageEvent) {
  const message: SocketResponse = JSON.parse(e.data);
  console.log(message);
  switch (message.type) {
    case 'listItems':
      message.items.forEach(createItemFor);
      break;
    case 'itemEdited':
      createItemFor(message.item);
      break;
    case 'itemDeleted':
      removeItemByID(message.itemID);
      break;
    default:
      window.alert(`Unimplemented message type ${message.type}!`);
  }
}

// Error handling
function handleError(e: Event) {
  window.alert(`WebSocket server error, make sure the server is running.`);
}

socket.onmessage = handleMessage;

socket.onerror = handleError;

/**
 * Sends a message over the WebSocket.
 * @param action The action to send a message for.
 */
export default function send(action: SocketAction) {
  socket.send(JSON.stringify(action));
}
