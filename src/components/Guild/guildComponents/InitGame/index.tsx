// Externals
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Button } from 'retro-ui';

import { generateMap } from '../../../../map-generator/index';

const UserInfoWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;

const StyledInput = styled(Input)`
  margin-bottom: 20px;
`;

export const InitGame: React.FC = () => {
  const [map, setMap] = useState('');
  const [json, setJson] = useState(null);

  const [guildOne, setGuildOne] = useState(null);
  const [guildTwo, setGuildTwo] = useState(null);
  const [dmFee, setDmFee] = useState(null);
  const [winningPot, setWinningPot] = useState(0);

  const generateMapToUse = () => {
    const { svg, json } = generateMap();
    setMap(svg);
    setJson(json);
  };

  useEffect(() => {
    generateMapToUse();
  }, []);

  console.log({ json });

  return (
    <UserInfoWrap>
      <StyledInput
        name="Guild #1 Address"
        id="guildOne"
        value={guildOne}
        onChange={e => setGuildOne(e.target.value)}
      />
      <StyledInput
        name="Guild #2 Address"
        id="guildTwo"
        value={guildTwo}
        onChange={e => setGuildTwo(e.target.value)}
      />
      <StyledInput
        name="Winning Pot Amount"
        id="winningPot"
        value={winningPot}
        onChange={e => setWinningPot(e.target.value)}
      />
      <StyledInput
        name="Dungeon Master Fee"
        id="dmFee"
        value={dmFee}
        onChange={e => setDmFee(e.target.value)}
      />
      <Button onClick={() => generateMapToUse()}>{'Regenerate Map'}</Button>
      <div dangerouslySetInnerHTML={{ __html: map }} />
      <Button>{'Create Game!'}</Button>
    </UserInfoWrap>
  );
};
