import { drawCircle } from '../../../map-generator/dungeons/draw';
import { section } from '../../../map-generator/ui/block.js';

export const addPlayerPos = (svg, room, color) => {
  return section(
    svg.replace(
      '</svg>',
      `${drawCircle(
        {
          cx: room.x * 24 + (room.width * 24) / 2,
          cy: room.y * 24 + (room.height * 24) / 2,
          r: 5,
        },
        { fill: color }
      )}</svg>`
    )
  );
};
