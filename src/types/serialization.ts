import paper from 'paper';

export enum ItemType {
  PATH = 'path',
}

export function getItemType(item: paper.Item): ItemType {
  switch (item.className) {
    case 'Path': return ItemType.PATH;
    default:
      window.alert(`Unsupported item type ${item.className}`);
      throw Error();
  }
};

export interface SerializedItem {
  id: string;
  type: ItemType;
  data: string;
}
