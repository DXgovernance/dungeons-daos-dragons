import { chunk } from './/utility/tools.js';
import { section, article } from './/ui/block.js';
import { drawLegend } from './/dungeons/legend.js';
import { generateDungeon } from './/dungeons/generate.js';
import {
  getDoorwayList,
  getKeyDescription,
  getMapDescription,
  getRoomDescription,
} from './/rooms/description.js';
import { subtitle } from './/ui/typography.js';
import { list } from './/ui/list.js';

const settings = {
  dungeonComplexity: 4,
  dungeonConnections: 5,
  dungeonMaps: 1,
  dungeonTraps: 0,
  roomCondition: 'random',
  roomCount: 'random',
  roomFurnishing: 'random',
  roomSize: 'random',
  roomType: 'random',
  itemCondition: 'random',
  itemQuantity: 'random',
  itemRarity: 'random',
  itemType: 'random',
};

const formatRoom = (room, doors) => {
  let roomDoors = doors && doors[room.roomNumber];
  let desc = getRoomDescription(room, roomDoors);
  let doorList = roomDoors ? getDoorwayList(roomDoors) : '';
  let items = room.items.join('');
  let map = room.map ? getMapDescription() : '';
  let keys = room.keys ? getKeyDescription(room.keys) : '';
  let traps = room.traps
    ? subtitle(`Traps (${room.traps.length})`) + list(room.traps)
    : '';

  return article(desc + doorList + items + map + keys + traps);
};

const getRoomRows = (rooms, doors) => {
  let sections = chunk(rooms, 3);

  return sections
    .map(roomChunk => {
      let row = roomChunk.map(room => formatRoom(room, doors)).join('');

      return section(row, { 'data-grid': 3 });
    })
    .join('');
};

const getDungeon = settings => {
  let { map, rooms, doors, mapDimensions, roomsJson } =
    generateDungeon(settings);
  console.log({ doors });

  let legend = drawLegend({ mapWidth: mapDimensions.gridWidth });
  // Add items to json from here
  let sections = getRoomRows(rooms, doors);

  roomsJson.map((room, index) => {
    roomsJson[index].doors = doors[index + 1];
  });

  return { svg: section(map), roomsJson };
};

export const generateMap = () => {
  // useEffect(() => {
  const { svg, roomsJson } = getDungeon(settings);
  //   setSvg(dungeon.svg);
  //   setJson(dungeon.roomsJson);
  // }, []);
  // const { svg, roomsJson } = getDungeon(settings);

  return { svg, json: roomsJson };
};
