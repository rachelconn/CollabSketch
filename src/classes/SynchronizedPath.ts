import paper from 'paper';
import { DeletePathAction, UpdatePathAction } from '../types/actions';
import { DeserializedPath } from '../types/serialization';
import { deserializePath } from '../utils/pathSerialization';
import send from '../utils/socket';

/**
 * Generates an ID for the server to use for a path.
 * Uses the current time in milliseconds and a random int [0, 999] to make collisions
 * very unlikely.
 */
function generateServerID() {
  return `${new Date().getTime()}-${Math.round(Math.random() * 1000)}`;
}

export default class SynchronizedPath extends paper.Path {
  serverID: string;
  // Keep track of all paths so those received from the server aren't duplicated
  static allPaths = new Map<string, SynchronizedPath>();

  constructor(path: paper.Path, serverID = generateServerID()) {
    // Make this a copy of the path provided with some additional bookkeeping
    console.log('synchronized path constructed:');
    console.log(path);
    super(path);
    Object.assign(this, path.clone());
    this.serverID = serverID;

    // Don't show the original path anymore - this is a paper.Path object, so it also renders
    path.remove();

    // If this has the same ID as an old path, don't render the old one anymore (since it's been updated)
    const oldPath = SynchronizedPath.allPaths.get(serverID);
    if (oldPath) oldPath.remove();

    // Update allPaths with the newly created path, and render it
    SynchronizedPath.allPaths.set(serverID, this);
    if (!path.isInserted()) path.clone();
  }

  /**
   * send(): Sends the path to the WebSocket server so that all clients can see it.
   * This can be used to send the path for the first time, or update its value.
   */
  send() {
    console.log('sending:');
    console.log(this);
    const message: UpdatePathAction = {
      action: 'updatePath',
      pathID: this.serverID,
      pathData: this.exportJSON(),
    };
    send(message);
  }

  /**
   * delete(): Delete the path from the WebSocket server so that no clients see it anymore.
   * Not to be confused with paper.Path.remove(), which only removes the path locally.
   */
  delete() {
    // Delete locally
    this.remove();

    // Send message for other clients to delete
    const message: DeletePathAction = {
      action: 'deletePath',
      pathID: this.serverID,
    };
    send(message);
  }

  /**
   * Creates paths corresponding to ones serialized from the server
   * @param paths Paths to create/update
   */
  static createPathsFor(paths: DeserializedPath[]): void {
    paths.forEach(({ id, path }) => {
      // Create SynchronizedPath for each received path, they will automatically be added to allPaths
      // and render if not yet registered
      new SynchronizedPath(deserializePath(path), id);
    });
  }
};
