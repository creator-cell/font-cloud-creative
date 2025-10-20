export type StoredTurn = {
  id: string;
  sessionId: string;
  message: string;
  model: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  }>;
  createdAt: number;
};

const turnStore = new Map<string, StoredTurn>();

export const storeTurn = (turn: StoredTurn) => {
  turnStore.set(turn.id, turn);
};

export const getTurn = (turnId: string) => turnStore.get(turnId);

export const removeTurn = (turnId: string) => {
  const turn = turnStore.get(turnId);
  turnStore.delete(turnId);
  return turn;
};
