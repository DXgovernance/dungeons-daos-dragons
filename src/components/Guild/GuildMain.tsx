// Externals
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserInfo } from './guildComponents/UserInfo';

import { generateMap } from '../../map-generator/index';
import { SplitMap } from './guildComponents/Maps';

const GuildWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const GuildMain: React.FC = () => {
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
  console.log('DDND_ADDRESS', process.env.REACT_APP_DDND_ADDRESS);

  console.log({ originalMap, json });

  
  return (
    <GuildWrap>
      {originalMap ? (
        <SplitMap
          originalMap={originalMap}
          guildOneState={guildOneState}
          guildTwoState={guildTwoState}
        />
      ) : null}

      <UserInfo />
    </GuildWrap>
  );
};
