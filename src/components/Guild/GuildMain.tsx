// Externals
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserInfo } from './guildComponents/UserInfo';

// import { generateMap } from '../../map-generator/index';
import { SplitMap } from './guildComponents/Maps';
import { useContext } from '../../contexts';

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

  const {
    context: { ipfsService },
  } = useContext();

  const getInitialMapFromIpfs = async () => {
    const { map, rooms } = await ipfsService.getContentFromIPFS(
      process.env.REACT_APP_STATE_HASH_IPFS
    );
    console.log({ map, rooms });
    rooms.map(room => {
      if (room.roomNumber === 1) {
        setGuildOneState({ room });
      } else if (room.roomNumber === 5) {
        setGuildTwoState({ room });
      }
    });

    setOriginalMap(map);

    setJson(rooms);
  };

  useEffect(() => {
    getInitialMapFromIpfs();
    // const { svg, json } = generateMap();
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
