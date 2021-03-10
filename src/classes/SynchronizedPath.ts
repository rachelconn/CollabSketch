import paper, { Path } from 'paper';
import { Paths } from '../types/responses';
import { deserializePaths } from '../utils/pathSerialization';
import socket from '../utils/socket';

/**
 * Generates an ID for the server to use for a path.
 * Uses the current time in milliseconds and a random int [0, 999] to make collisions
 * very unlikely.
 */
function generateServerID() {
  return `${new Date().getTime()}-${Math.round(Math.random() * 1000)}`;
}

export default class SynchronizedPath extends paper.Path {
  _serverID: string;
  // Keep track of all paths so those received from the server aren't duplicated
  static allPaths = new Map<string, SynchronizedPath>();

  constructor(path: paper.Path, serverID = generateServerID()) {
    super(path);
    this._serverID = serverID;
    SynchronizedPath.allPaths.set(serverID, this);
    if (!path.isInserted()) path.clone();
  }

  /**
   * send(): Sends the path to the WebSocket server so that all clients can see it.
   * This can be used to send the path for the first time, or update its value.
   */
  send() {
    socket.send(this.serialize());
  }

  /**
   * remove(): Removes the path from the WebSocket server so that no clients see it anymore.
   */
  remove() {
    socket.send
  }

  /**
   * Creates paths corresponding to ones serialized from the server
   * @param paths Paths to create/update
   */
  static createPathsFor(paths: Paths): void {
    const deserialized = deserializePaths(paths);
    deserialized.forEach(([id, path]) => {
      // Create SynchronizedPath for each received path, they will automatically be added to allPaths
      // and render if not yet registered
      new SynchronizedPath(path, id);
    });
  }
};
