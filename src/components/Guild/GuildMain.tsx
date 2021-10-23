// Externals
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserInfo } from './guildComponents/UserInfo';

import { generateMap } from '../../map-generator/index';
import { addPlayerPos } from './guildComponents/MapUtil';

const GuildWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MapWrap = styled.div`
  display: flex;
  justify-content: center;
`;

export const GuildMain: React.FC = () => {
  const [originalMap, setOriginalMap] = useState('');
  const [guildOneMap, setGuildOneMap] = useState('');
  const [guildTwoMap, setGuildTwoMap] = useState('');
  const [json, setJson] = useState(null);
  const [guildOnePos, setGuildOnePos] = useState([0, 0]);
  const [guildTwoPos, setGuildTwoPos] = useState([0, 0]);

  useEffect(() => {
    const { svg, json } = generateMap();
    let initialRoom = null;
    json.map(room => {
      if (room.roomNumber === 1) {
        initialRoom = room;
      }
    });

    setOriginalMap(svg);
    setGuildOneMap(addPlayerPos(svg, initialRoom));
    setGuildTwoMap(addPlayerPos(svg, initialRoom));

    setJson(json);

    json.map(room => {
      if (room.roomNumber === 1) {
        setGuildOnePos([room.x, room.y]);
        setGuildTwoPos([room.x, room.y]);
      }
    });
  }, []);
  console.log("DDND_ADDRESS", process.env.REACT_APP_DDND_ADDRESS)

  console.log({ guildOnePos, guildTwoPos, originalMap, json });

  return (
    <GuildWrap>
      <MapWrap>
        <div dangerouslySetInnerHTML={{ __html: guildOneMap }} />
        <div dangerouslySetInnerHTML={{ __html: guildTwoMap }} />
      </MapWrap>
      <UserInfo />
    </GuildWrap>
  );
};
