import paper from 'paper';

export function deserializePath(path: string): paper.Path {
  // Don't render the new point immediately - this will be handled by SynchronizedPath
  const deserialized = new paper.Path({ insert: false });
  deserialized.importJSON(path);

  return deserialized;
}
