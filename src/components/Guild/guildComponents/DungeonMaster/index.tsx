// Externals
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Box } from 'retro-ui';

import { generateMap } from '../../../../map-generator/index';
import { addPlayerPos } from '../MapUtil';

const UserInfoWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;
const Guild = styled(Box)`
  width: 50%;
`;
const GuildsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  grid-gap: 2px;
`;
const GuildName = styled.div`
  font-family: 'Press Start 2P';
`;
const GuildActions = styled(Box)`
  flex-direction: column;
  margin-left: auto;
  width: 50%;
`;

export const DungeonMaster: React.FC = () => {
  const [map, setMap] = useState('');
  const [json, setJson] = useState(null);
  const [guildOnePos, setGuildOnePos] = useState([0, 0]);

  useEffect(() => {
    // Get map from game state instead of generating here
    const { svg, json } = generateMap();
    let initialRoom = null;
    json.map(room => {
      if (room.roomNumber === 1) {
        initialRoom = room;
      }
    });

    setMap(addPlayerPos(svg, initialRoom));

    setJson(json);
    json.map(room => {
      if (room.roomNumber === 1) {
        setGuildOnePos([room.x, room.y]);
      }
    });
  }, []);

  useEffect(() => {
    // setMap(
    //   section(
    //     map.replace(
    //       '</svg>',
    //       `${drawCircle(
    //         { cx: guildOnePos[0] * 24, cy: guildOnePos[1] * 24, r: 20 },
    //         { fill: 'pink' }
    //       )}</svg>`
    //     )
    //   )
    // );
  }, [guildOnePos]);

  console.log({ json });

  return (
    <UserInfoWrap>
      <Box style={{ marginBottom: '15px' }}>DungeonMaster</Box>

      <div dangerouslySetInnerHTML={{ __html: map }} />
      <GuildsWrapper>
        <Guild>
          <GuildName>Guild name 1</GuildName>
          <GuildActions>
            <div>Move</div>
            <div>Attack</div>
          </GuildActions>
        </Guild>
        <Guild>
          <GuildName>Guild name 2</GuildName>
          <GuildActions>
            <div>Move</div>
            <div>Attack</div>
          </GuildActions>
        </Guild>
      </GuildsWrapper>
    </UserInfoWrap>
  );
};
