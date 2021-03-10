import paper from 'paper';
import { ItemType, SerializedItem } from '../types/serialization';

export function deserializeItem(item: SerializedItem): paper.Item {
  const { type, data } = item;

  // Create correct item type and deserialize
  let deserialized: paper.Item;
  switch (type) {
    case ItemType.PATH:
      deserialized = new paper.Path();
      break;
    default:
      window.alert(`Unsupported item type: ${type}`);
      throw Error();
  }
  deserialized.importJSON(data);

  return deserialized;
}
