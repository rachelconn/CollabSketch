import { createItemFor, removeItemByID } from '../classes/itemSynchronization';
import SocketAction from '../types/actions';
import SocketResponse from '../types/responses';

// Global WebSocket
const socket = new WebSocket('ws://localhost:12345');

socket.onopen = (e: Event) => {
  console.log('hooray');
};

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

socket.onmessage = handleMessage;

/**
 * Sends a message over the WebSocket.
 * @param action The action to send a message for.
 */
export default function send(action: SocketAction) {
  socket.send(JSON.stringify(action));
}
