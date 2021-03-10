import paper from 'paper';

const registeredEvents = new Map<string, (e: KeyboardEvent) => any>();

/**
 * Makes it so that upon pressing key, tool is selected.
 * @param tool Tool to activate when key is pressed
 * @param key Key to register
 */
export default function registerToolToKey(tool: paper.Tool, key: string): void {
  const activateTool = (e: KeyboardEvent) => {
    if (e.key === key) paper.tool = tool;
  };

  const previousEvent = registeredEvents.get(key);
  if (previousEvent) window.removeEventListener('keydown', previousEvent);

  window.addEventListener('keydown', activateTool);
  registeredEvents.set(key, activateTool);
}
