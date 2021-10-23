export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  walls: any[];
  doors: [
    {
      connection: {
        direction: string;
        to: number;
      };
      connections: any;
      type: string;
      size: number;
      locked: boolean;
    }
  ];
}

export interface PlayerState {
  rooms: Room[];
  currentPosition: Room;
  avatar: {
    health: number;
    score: number;
  };
  guild: string;
  items: any;
}
