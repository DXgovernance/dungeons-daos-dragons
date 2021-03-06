import {
  cellBlank,
  cellCornerWall,
  cellDoor,
  cellWall,
  getStartingPoint,
  getValidRoomCords,
  sides,
  wallSize,
} from "./grid.js";

import {
  drawDoor,
  drawGrid,
  drawMap,
  drawRoom,
  labelMinHeight,
  labelMinWidth,
} from "./draw.js";

import { dimensionRanges, customDimensions } from "../rooms/dimensions.js";
import {
  lockable,
  lockedChance,
  outside,
  probability as doorProbability,
  secretProbability,
} from "../rooms/door.js";

import { knobs } from "../knobs.js";
import { roll, rollArrayItem, rollPercentile } from "../utility/roll.js";
import { isRequired, toWords } from "../utility/tools.js";
import roomType from "../rooms/type.js";

// -- Types --------------------------------------------------------------------

/** @typedef {import('../knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../knobs.js').RoomConfig} RoomConfig */
/** @typedef {import('../rooms/dimensions.js').RoomDimensions} RoomDimensions */
/** @typedef {import('./draw.js').GridRectangle} GridRectangle */
/** @typedef {import('./grid.js').Grid} Grid */
/** @typedef {import('./grid.js').GridCoordinates} GridCoordinates */
/** @typedef {import('./grid.js').GridDimensions} GridDimensions */

/**
 * @typedef {object} Connection
 *
 * @property {Directions} direction - north, east, south, or west
 * @property {number | string} to - Room number or "outside"
 */

/**
 * @typedef {object} Door
 *
 * @property {string} rect
 * @property {string} type
 * @property {boolean} locked
 * @property {object.<number, Connection>} connections
 * @property {Connection} connection
 * @property {number} size
 */

/**
 * @typedef {object} AppliedRoomResults
 *
 * @property {Room[]} rooms
 *     All rooms which have been generated for the map grid.
 *
 * @property {Door[]} doors
 *     Doors which are associated to rooms which have been applied to the grid.
 *
 * @property {GridRoom[]} gridRooms
 *     Room configs which have been applied to the grid.
 *
 * @property {Room[]} skipped
 *     Room configs which have not been applied to the grid.
 *
 * @property {number} roomNumber
 *     The room's ID.
 */

// -- Config -------------------------------------------------------------------

/**
 * If an ASCII representation of the map arrays should be logged to the console.
 */
const debug = false;

/**
 * Maximum number of grid cells a door can be wide or tall.
 *
 * TODO rename to `maxDoorCellSize`?
 */
const maxDoorWidth = 4;

/**
 * Directions
 *
 * @typedef {object} Directions
 *
 * @property {"north"} north
 * @property {"east"} east
 * @property {"south"} south
 * @property {"west"} west
 */

/**
 * Directions
 *
 * TODO freeze all lookup objects
 *
 * @type {Directions}
 */
export const directions = {
  north: "north",
  east: "east",
  south: "south",
  west: "west",
};

/**
 * Lookup up of direction opposites.
 *
 * TODO no underscore
 */
const _oppositeDirectionLookup = {
  [directions.north]: directions.south,
  [directions.east]: directions.west,
  [directions.south]: directions.north,
  [directions.west]: directions.east,
};

// -- Private Functions --------------------------------------------------------

/**
 * Checks for an adjacent door.
 *
 * @param {Grid} grid
 * @param {GridCoordinates} gridCoordinates
 *
 * @returns {boolean}
 */
const checkAdjacentDoor = (grid, [x, y]) => {
  return [-1, 1].some((adjust) => {
    let xAdjust = x + adjust;
    let yAdjust = y + adjust;

    let xCell = grid[xAdjust] && grid[xAdjust][y];
    let yCell = grid[x] && grid[x][yAdjust];

    if (xCell === cellDoor || yCell === cellDoor) {
      return true;
    }

    return false;
  });
};

/**
 * Draws rooms to a map grid and returns the results.
 *
 * @param {GridDimensions} mapSettings // TODO rename, infer from Grid?
 * @param {Room[]} mapRooms
 * @param {Grid} grid
 * @param {number} [roomNumber = 1] // TODO make required?
 * @param {Room} [prevRoom]
 *
 * @returns {AppliedRoomResults}
 */
const drawRooms = (mapSettings, mapRooms, grid, roomNumber = 1, prevRoom) => {
  let rooms = [];
  let doors = [];
  let skipped = [];
  let gridRooms = [];
  let isFork = roomNumber === 1 ? false : true;

  const roomsJson = [];

  mapRooms.forEach((roomConfig) => {
    let { [knobs.roomType]: type } = roomConfig.settings;

    let roomDimensions = getRoomDimensions(mapSettings, roomConfig);

    let x;
    let y;

    if (prevRoom) {
      let validCords = getValidRoomCords(grid, prevRoom, roomDimensions);

      if (!validCords.length) {
        skipped.push(roomConfig);
        return;
      }

      if (type === roomType.hallway) {
        // TODO remind me why the last set of cords is used for halls?
        [x, y] = validCords[validCords.length - 1];
      } else {
        [x, y] = rollArrayItem(validCords);
      }
    } else {
      [x, y] = getStartingPoint(mapSettings, roomDimensions);
    }

    let room = {
      x,
      y,
      width: roomDimensions.roomWidth,
      height: roomDimensions.roomHeight,
      type,
      roomNumber,
    };

    roomsJson.push(room);

    let { rect, walls } = getRoom(grid, room, {
      hasTraps: Boolean(roomConfig.traps),
    });

    room.walls = walls;

    gridRooms.push(room);

    doors.push(getDoor(grid, room, prevRoom, { allowSecret: isFork }));

    rooms.push({
      rect,
      config: {
        ...roomConfig,
        walls,
        roomNumber,
        size: [roomDimensions.roomWidth, roomDimensions.roomHeight], // TODO rename to dimensions
      },
    });

    roomNumber++;

    prevRoom = room;
  });

  let extraDoors = getExtraDoors(grid, rooms, doors);

  return {
    rooms,
    doors: doors.concat(extraDoors),
    gridRooms,
    skipped,
    roomNumber,
    roomsJson,
  };
};

/**
 * Returns a door object based on the given grid, room, and previous room.
 *
 * @param {Grid} grid
 * @param {Room} room
 * @param {Room} prevRoom
 * @param {options} [options]
 *     @param {options} [options.allowSecret]
 *
 * @returns {Door}
 */
const getDoor = (grid, room, prevRoom, { allowSecret } = {}) => {
  let cells = getDoorCells(grid, room, prevRoom);
  let useEdge =
    prevRoom &&
    prevRoom.roomType === roomType.hallway &&
    room.roomType === roomType.hallway;
  let max = Math.min(maxDoorWidth, Math.ceil(cells.length / 2));
  let size = roll(1, max);
  let remainder = cells.length - size;
  let start = useEdge ? rollArrayItem([0, remainder]) : roll(0, remainder);
  let doorCells = cells.slice(start, start + size);
  let [x, y] = doorCells[0];
  let direction = getDoorDirection([x, y], room);

  let width = 1;
  let height = 1;

  grid[x][y] = cellDoor;

  doorCells.forEach(([cellX, cellY]) => {
    if (cellX > x || cellY > y) {
      cellX > x ? width++ : height++;
      grid[cellX][cellY] = cellDoor;
    }
  });

  /** @type {GridRectangle} doorRectangle */
  let doorRectangle = {
    gridX: x,
    gridY: y,
    gridWidth: width,
    gridHeight: height,
  }; // TODO cleanup
  let from = room.roomNumber;
  let to = prevRoom ? prevRoom.roomNumber : outside;
  let type = allowSecret && secretProbability.roll();

  return makeDoor(doorRectangle, { from, to, direction, type });
};

/**
 * Returns an array of grid cells which are valid spaces for a door.
 *
 * @param {Grid} grid
 * @param {Room} room
 * @param {Room} prevRoom
 *
 * @returns {string[]} // TODO GridCoordinates[]
 */
const getDoorCells = (grid, room, prevRoom) => {
  let prevWalls = [];

  if (prevRoom) {
    // TODO require rooms share an edge
    prevWalls = prevRoom.walls;
  } else {
    // TODO get grid dimensions helper?
    let gridWidth = grid.length - 1;
    let gridHeight = grid[0].length - 1;

    let startTop = room.y === wallSize && sides.top;
    let startRight = room.x === gridWidth - room.width && sides.right;
    let startBottom = room.y === gridHeight - room.height && sides.bottom;
    let startLeft = room.x === wallSize && sides.left;

    // TODO require room is against a grid edge

    let side = rollArrayItem(
      [startTop, startRight, startBottom, startLeft].filter(Boolean)
    );
    let dimension =
      side === sides.top || side === sides.bottom ? gridWidth : gridHeight;

    for (let i = 0; i <= dimension; i++) {
      switch (side) {
        case sides.top:
          prevWalls.push([i, 0]);
          break;
        case sides.right:
          prevWalls.push([gridWidth, i]);
          break;
        case sides.bottom:
          prevWalls.push([i, gridHeight]);
          break;
        case sides.left:
          prevWalls.push([0, i]);
          break;
      }
    }
  }

  let roomWalls = room.walls.map((cords) => cords.join());
  let prevRoomWalls = prevWalls.map((cords) => cords.join());
  let intersection = roomWalls.filter((value) => prevRoomWalls.includes(value));

  let cells = intersection.map((xy) => xy.split(","));

  return cells;
};

/**
 * Returns a door's direction based on a cell of the door and the room.
 *
 * @param {GridCell} cell
 * @param {Room} room
 * @returns
 */
const getDoorDirection = ([x, y], room) => {
  // TODO return early and drop elses
  // TODO Remove number casting
  // TODO check x & y, e.g. the corner of the room is an invalid door cell
  if (Number(y) === room.y - 1) {
    return directions.north;
  } else if (Number(x) === room.x + room.width) {
    return directions.east;
  } else if (Number(y) === room.y + room.height) {
    return directions.south;
  } else if (Number(x) === room.x - 1) {
    return directions.west;
  } else {
    throw new TypeError("Invalid grid cell");
  }
};

/**
 * Returns randomized room dimensions for the given room type.
 *
 * @param {GridDimensions} mapSettings // TODO rename
 * @param {RoomConfig | DungeonConfig} roomConfig
 *
 * @returns {RoomDimensions}
 */
const getRoomDimensions = (mapSettings, roomConfig) => {
  // TODO just pass settings
  let {
    settings: { [knobs.roomSize]: roomSize, [knobs.roomType]: roomType },
  } = roomConfig;

  isRequired(roomSize, "roomSize is required in getRoomDimensions()");
  isRequired(roomType, "roomType is required in getRoomDimensions()");

  let { gridWidth, gridHeight } = mapSettings;

  let roomWidth;
  let roomHeight;

  if (customDimensions[roomType]) {
    // TODO should return an array?
    ({ roomWidth, roomHeight } = customDimensions[roomType](roomSize));
  } else {
    let [min, max] = dimensionRanges[roomSize];

    roomWidth = roll(min, max);
    roomHeight = roll(min, max);
  }

  // TODO replace - 2 with - (wallSize * 2)
  let width = Math.min(gridWidth - 2, roomWidth);
  let height = Math.min(gridHeight - 2, roomHeight);

  return { roomWidth: width, roomHeight: height };
};

/**
 * Returns a room rectangle and array of walls
 * @param {Grid} grid
 * @param {Room} room
 * @param {object} [options]
 *     @param {boolean} [options.hasTraps]
 *
 * @returns {{
 *     rect: string;
 *     walls: string[][]; // TODO GridCoordinates[]
 * }}
 */
const getRoom = (grid, room, { hasTraps } = {}) => {
  let { x, y, width, height, type, roomNumber } = room;

  let walls = [];

  // TODO refactor out into `addRoomToGrid()`
  // TODO refactor out to create room w/ walls separate from applying to grid
  for (let w = -wallSize; w < width + wallSize; w++) {
    for (let h = -wallSize; h < height + wallSize; h++) {
      let xCord = x + w;
      let yCord = y + h;

      if (!grid[xCord] || !grid[xCord][yCord]) {
        continue;
      }

      let isCornerWall =
        (w === -wallSize && h === -wallSize) ||
        (w === -wallSize && h === height) ||
        (w === width && h === -wallSize) ||
        (w === width && h === height);

      let isWall =
        !isCornerWall &&
        (w === -wallSize || w === width || h === -wallSize || h === height);

      if (isWall) {
        walls.push([xCord, yCord]);
      }

      let cell = roomNumber;

      if (isWall) {
        cell = cellWall;
      } else if (isCornerWall) {
        cell = cellCornerWall;
      }

      grid[xCord][yCord] = cell;
    }
  }

  /** @type {GridRectangle} */
  let roomRectangle = {
    gridX: x,
    gridY: y,
    gridWidth: width,
    gridHeight: height,
  };
  let showRoomLabel =
    type !== roomType.room &&
    width >= labelMinWidth &&
    height >= labelMinHeight;
  let roomLabel = showRoomLabel && toWords(type);

  let rect = drawRoom(roomRectangle, { roomNumber, roomLabel }, { hasTraps });

  return {
    rect, // TODO rename to roomElements?
    walls,
  };
};

// TODO rename to createDoor()
const makeDoor = (doorRectangle, { from, to, direction, type }) => {
  if (!type) {
    type = doorProbability.roll();
  }

  let locked = lockable.has(type) && rollPercentile(lockedChance);

  return {
    rect: drawDoor(doorRectangle, { direction, type, locked }),
    type,
    locked,
    connections: {
      [from]: { direction, to },
      [to]: { direction: _oppositeDirectionLookup[direction], to: from },
    },
    // TODO size is returning NaN, likely unused?
    size: Math.max(doorRectangle.width, doorRectangle.height),
  };
};

/**
 * Returns an array of Door configs for the additional connections to the given
 * Room, if any.
 *
 * @param {Grid} grid
 * @param {Room[]} rooms
 * @param {Door[]} existingDoors
 *
 * @returns {Door[]}
 */
const getExtraDoors = (grid, rooms, existingDoors) => {
  let doors = [];

  rooms.forEach((room) => {
    let { roomNumber, settings } = room.config;
    let { [knobs.dungeonConnections]: connectionChance } = settings;

    let chance = Number(connectionChance);

    if (!chance) {
      return;
    }

    let connectedTo = new Set();

    [...existingDoors, ...doors].forEach((door) => {
      let connection = door.connections[roomNumber];

      if (connection) {
        connectedTo.add(connection.to);
      }
    });

    room.config.walls.forEach(([x, y]) => {
      let cell = grid[x][y];

      if (cell !== cellWall) {
        return;
      }

      if (checkAdjacentDoor(grid, [x, y])) {
        return;
      }

      [-1, 1].forEach((adjust) => {
        /** @type {GridRectangle} */
        let doorRectangle = {
          gridX: x,
          gridY: y,
          gridWidth: wallSize,
          gridHeight: wallSize,
        };

        let xAdjust = x + adjust;
        let yAdjust = y + adjust;

        let xCell = grid[xAdjust] && grid[xAdjust][y];
        let yCell = grid[x] && grid[x][yAdjust];

        let xConnect = xCell && Number.isInteger(xCell) && xCell;
        let canConnectX =
          xConnect && xConnect !== roomNumber && !connectedTo.has(xConnect);

        if (canConnectX && rollPercentile(chance)) {
          grid[x][y] = cellDoor;

          connectedTo.add(xConnect);

          let direction = adjust === -1 ? directions.west : directions.east;
          let type = secretProbability.roll(); // TODO inject `secretProbability`

          doors.push(
            makeDoor(doorRectangle, {
              from: roomNumber,
              to: xConnect,
              direction,
              type,
            })
          );
        }

        let yConnect = yCell && Number.isInteger(yCell) && yCell;
        let canConnectY =
          yConnect && yConnect !== roomNumber && !connectedTo.has(yConnect);

        if (canConnectY && rollPercentile(chance)) {
          grid[x][y] = cellDoor;

          connectedTo.add(yConnect);

          let direction = adjust === -1 ? directions.north : directions.south;
          let type = secretProbability.roll(); // TODO inject `secretProbability`

          doors.push(
            makeDoor(doorRectangle, {
              from: roomNumber,
              to: yConnect,
              direction,
              type,
            })
          );
        }
      });
    });
  });

  return doors;
};

const getRooms = (mapSettings, grid) => {
  let { rooms, doors, skipped, roomNumber, gridRooms, roomsJson } = drawRooms(
    mapSettings,
    mapSettings.rooms,
    grid
  );

  let lastRoomNumber = roomNumber;
  let lastSkipped = skipped;

  gridRooms.forEach((gridRoom) => {
    let fork = drawRooms(
      mapSettings,
      lastSkipped,
      grid,
      lastRoomNumber,
      gridRoom
    );

    if (fork.rooms.length && fork.doors.length) {
      lastRoomNumber = fork.roomNumber;
      lastSkipped = fork.skipped;
      rooms.push(...fork.rooms);
      doors.push(...fork.doors);
      roomsJson.push(...fork.roomsJson);
    }
  });

  return {
    rooms,
    doors,
    roomsJson,
  };
};

export {
  checkAdjacentDoor as testCheckAdjacentDoor,
  drawRooms as testDrawRooms,
  getDoor as testGetDoor,
  getDoorCells as testGetDoorCells,
  getDoorDirection as testGetDoorDirection,
  getExtraDoors as testGetExtraDoors,
  getRoom as testGetRoom,
  getRoomDimensions as testGetRoomDimensions,
  getRooms as testGetRooms,
  makeDoor as testMakeDoor,
};

// -- Public Functions ---------------------------------------------------------

// TODO Bug? Only logs square grids?
// TODO return string & rename to `getAsciiGrid()`
export const logGrid = (grid) => {
  let rows = [];

  grid.forEach((column, x) => {
    let cols = [];

    column.forEach((_, y) => {
      grid[y] && grid[y][x] && cols.push(grid[y][x]);
    });

    cols.length && rows.push(cols);
  });

  let ascii = rows
    .map((cols) => {
      return cols.join(" ");
    })
    .join("\n");
};

export const generateMap = (mapSettings) => {
  let { gridWidth, gridHeight } = mapSettings;

  // TODO use `createBlankGrid()`
  let grid = [...Array(gridWidth)].fill(cellBlank);

  grid.forEach((_, col) => {
    grid[col] = [...Array(gridHeight)].fill(cellBlank);
  });

  let { rooms, doors, roomsJson } = getRooms(mapSettings, grid);
  console.log({ roomsJson, rooms });

  if (mapSettings.rooms.length <= rooms.length) {
    console.warn(
      "Not enough rooms generated",
      mapSettings.rooms.length,
      rooms.length
    );
  }

  let roomRects = rooms.map((room) => room.rect).join("");
  let doorRects = doors.map(({ rect }) => rect).join("");
  let gridLines = drawGrid(mapSettings);
  let content = gridLines + roomRects + doorRects;

  debug && logGrid(grid);

  return {
    map: drawMap(mapSettings, content),
    rooms: rooms.map(({ config }) => config),
    doors: doors.map(({ rect, ...door }) => door),
    roomsJson,
    // findConnectedRooms(roomsJson),
  };
};
