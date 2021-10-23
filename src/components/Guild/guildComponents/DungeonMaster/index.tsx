// Externals
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Box } from 'retro-ui';

import { generateMap } from '../../../../map-generator/index';
import { SplitMap } from '../Maps';

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
  const [originalMap, setOriginalMap] = useState('');
  const [json, setJson] = useState(null);
  const [guildOneState, setGuildOneState] = useState(null);
  const [guildTwoState, setGuildTwoState] = useState(null);

  useEffect(() => {
    const { svg, json } = generateMap();
    json.map(room => {
      if (room.roomNumber === 1) {
        setGuildOneState({ room });
        setGuildTwoState({ room });
      }
    });

    setOriginalMap(svg);

    setJson(json);
  }, []);

  console.log({ json });

  return (
    <UserInfoWrap>
      <Box style={{ marginBottom: '15px' }}>DungeonMaster</Box>

      {originalMap ? (
        <SplitMap
          originalMap={originalMap}
          guildOneState={guildOneState}
          guildTwoState={guildTwoState}
        />
      ) : null}
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
