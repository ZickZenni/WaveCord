export interface Reaction {
  count: number;
  emoji: {
    id: string | null;
    name: string;
    animated?: boolean;
  };
  me: true;
}
