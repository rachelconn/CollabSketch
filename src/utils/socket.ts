import paper from 'paper';
import SynchronizedPath from '../classes/SynchronizedPath';
import SocketAction from '../types/actions';
import SocketResponse from '../types/responses';
import { deserializePath } from './pathSerialization';

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
    case 'listPaths':
      SynchronizedPath.createPathsFor(message.paths);
      break;
    case 'pathEdited':
      console.log('path edited');
      new SynchronizedPath(deserializePath(message.path));
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
