// Externals
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { addPlayerPos } from '../MapUtil';

const MapWrap = styled.div`
  display: flex;
  justify-content: center;
`;

interface MapsProps {
  originalMap: string;
  guildOneState: any;
  guildTwoState: any;
}

export const SplitMap: React.FC<MapsProps> = ({
  originalMap,
  guildOneState,
  guildTwoState,
}) => {
  const [guildOneMap, setGuildOneMap] = useState('');
  const [guildTwoMap, setGuildTwoMap] = useState('');

  useEffect(() => {
    setGuildOneMap(addPlayerPos(originalMap, guildOneState.room, 'red'));
    setGuildTwoMap(addPlayerPos(originalMap, guildTwoState.room, 'blue'));
  }, [guildOneMap, guildTwoMap]);

  return (
    <MapWrap>
      <div dangerouslySetInnerHTML={{ __html: guildOneMap }} />
      <div dangerouslySetInnerHTML={{ __html: guildTwoMap }} />
    </MapWrap>
  );
};
