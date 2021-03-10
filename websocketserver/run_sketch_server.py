import logging
import json
from typing import Any, Callable, Dict, Set, TypedDict
import asyncio
import websockets

class SerializedItem(TypedDict):
    id: str
    type: str
    data: str

# Dict mapping item id -> serialized representation of that item
ITEMS: Dict[str, SerializedItem] = {}

# Set keeping track of connected users
USERS: Set[websockets.WebSocketClientProtocol] = set()

"""
SERIALIZATION
"""
def serialize_items() -> str:
    """ Serializes all items to send to clients on initial connection """
    items = {
        'type': 'listItems',
        'items': [item for item in ITEMS.values()]
    }
    return json.dumps(items)

def serialize_users() -> str:
    """ Serialize users to send to clients.
        Currently unused, but could be used to show clients who is currently connected.
    """
    users = {
        'type': 'users',
        'count': len(USERS)
    }
    return json.dumps(users)

"""
CLIENT NOTIFICATION: to synchronize updated state across clients
"""

async def notify_edit_item(item_id, originator=None) -> None:
    """ Notifies each connected client that an item has been created or edited.
    Parameters:
        originator (optional): A client to not alert (as they originated the event)
    """
    message = json.dumps({
        'type': 'itemEdited',
        'item': ITEMS[item_id],
    })
    events = [user.send(message) for user in USERS if user != originator]
    if events:
        await asyncio.wait(events)

async def notify_delete_item(item_id, originator=None) -> None:
    """ Notifies each connected client that an item has been deleted.
    Parameters:
        originator (optional): A client to not alert (as they originated the event)
    """
    message = json.dumps({
        'type': 'itemDeleted',
        'itemID': item_id,
    })
    events = [user.send(message) for user in USERS if user != originator]
    if events:
        await asyncio.wait(events)

async def notify_users() -> None:
    """ Notifies each connected client of the current users """
    if USERS:
        message = serialize_users()
        await asyncio.wait([user.send(message) for user in USERS])

"""
CONNECTION HANDLERS: for when a client is connected/disconnected
"""
async def register(websocket) -> None:
    print(f'Adding user {websocket}: {type(websocket)}')
    USERS.add(websocket)

async def unregister(websocket) -> None:
    USERS.remove(websocket)

"""
ACTION HANDLERS: to run whenever a client sends an action
"""
async def add_item(data: Dict, user) -> None:
    """ Action handler for when a new item is created """
    item = data['item']
    item_id = item['id']
    if item is not None and item_id is not None:
        ITEMS[item_id] = item
        await notify_edit_item(item_id, user)

async def update_item(data: Dict, user) -> None:
    """ Action handler to update an existing item """
    item = data['item']
    item_id = item['id']
    if item is not None and item_id is not None:
        ITEMS[item_id] = item
        await notify_edit_item(item_id, user)

async def delete_item(data: Dict, user) -> None:
    """ Action handler to delete an item """
    item_id = data.get('id')
    if item_id is not None:
        if ITEMS.pop(item_id, None) is not None:
            await notify_delete_item(item_id, user)

# Dict mapping action id -> function to run for that action
actions: Dict[str, Callable[[Dict], Any]] = {
    'createItem': add_item,
    'updateItem': update_item,
    'deleteItem': delete_item,
}

"""
SERVER LOOP
"""
# TODO: Instead, send each item on initial load and after that each create/update/delete sends each client
# a message to only change the single changed item
async def sketch_server_loop(websocket, _) -> None:
    """ Main logic loop for sketch server """
    await register(websocket)
    try:
        print('User connected')
        await websocket.send(serialize_items())
        async for message in websocket:
            data = json.loads(message)
            action = data.get('action')
            handle_action = actions.get(action)
            if handle_action:
                await handle_action(data, websocket)
            else:
                logging.error(f'Invalid action {action}')
    finally:
        await unregister(websocket)

def run_server() -> None:
    #Start server
    start_server = websockets.serve(sketch_server_loop, 'localhost', 12345)
    asyncio.get_event_loop().run_until_complete(start_server)

    # Continue running until stopped manually
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    run_server()
