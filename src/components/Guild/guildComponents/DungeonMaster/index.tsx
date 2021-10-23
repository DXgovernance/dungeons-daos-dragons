// Externals
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Box, Message, Input, Button } from 'retro-ui';

import { generateMap } from '../../../../map-generator/index';
import { SplitMap } from '../Maps';

const UserInfoWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;
const StyledBox = styled(Box)`
  width: 40%;
  margin: 10px;
`;
const GuildsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const StyledButton = styled(Button)`
  width: 40%;
  margin: 10px;
`;

export const DungeonMaster: React.FC = () => {
  const [originalMap, setOriginalMap] = useState('');
  const [json, setJson] = useState(null);
  const [guildOneState, setGuildOneState] = useState(null);
  const [guildTwoState, setGuildTwoState] = useState(null);
  const [guildOneDesc, setGuildOneDesc] = useState(null);
  const [guildTwoDesc, setGuildTwoDesc] = useState(null);

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

  const constructButtonsForAvailableDoors = room => {
    return room.doors.map(door => {
      return <Button>Go {door.connection.direction}</Button>;
    });
  };

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
        <StyledBox>
          <Message>Guild #1 Decision - Move 4</Message>
          <Message type="success">Move down</Message>
        </StyledBox>
        <StyledBox>
          <Message>Guild #2 Decision - Move 4</Message>
          <Message type="success">Attack</Message>
        </StyledBox>
        <StyledBox>
          <Message>Guild #1 - Move 4 - Action</Message>
          <ButtonWrapper>
            <Button>Attack</Button>
            {constructButtonsForAvailableDoors(guildOneState?.room)}
            <Button>Nothing</Button>
          </ButtonWrapper>
        </StyledBox>
        <StyledBox>
          <Message>Guild #2 - Move 4 - Action</Message>
          <ButtonWrapper>
            <Button>Attack</Button>
            {constructButtonsForAvailableDoors(guildTwoState?.room)}
            <Button>Do nothing</Button>
          </ButtonWrapper>
        </StyledBox>
        <StyledBox>
          <Input
            name="Guild #1 Next description"
            id="guildOneDesc"
            value={guildOneDesc}
            onChange={e => setGuildOneDesc(e.target.value)}
          />
        </StyledBox>
        <StyledBox>
          <Input
            name="Guild #2 Next description"
            id="guildTwoDesc"
            value={guildTwoDesc}
            onChange={e => setGuildTwoDesc(e.target.value)}
          />
        </StyledBox>
        <StyledButton>Send</StyledButton>
        <StyledButton>Send</StyledButton>
      </GuildsWrapper>
    </UserInfoWrap>
  );
};
