export interface Reaction {
  count: number;
  emoji: {
    id: string | null;
    name: string;
  };
  me: true;
}
