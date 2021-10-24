// Externals
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Box, Message, Input, Button } from 'retro-ui';

import { generateMap } from '../../../../map-generator/index';
import { SplitMap } from '../Maps';
import { useContext } from '../../../../contexts';

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
  margin-top: 15px;
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
  margin: 5px;
`;
const LargeStyledButton = styled(Button)`
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

  const {
    context: { ipfsService },
  } = useContext();

  const uploadToIpfs = async (json, svg) => {
    const jsonString = JSON.stringify({ rooms: json, map: svg });
    console.log({ jsonString });
    const jsonHash = await ipfsService.add(jsonString);
    console.log({ jsonHash });
    const mapString = JSON.stringify(svg);
    console.log({ mapString });
    const mapHash = await ipfsService.add(svg);
    console.log({ mapHash });
  };

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
    uploadToIpfs(json, svg);
  }, []);

  console.log({ json });

  const constructButtonsForAvailableDoors = room => {
    return room?.doors.map(door => {
      return <StyledButton>Go {door.connection.direction}</StyledButton>;
    });
  };

  return (
    <UserInfoWrap>
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
            <StyledButton>Attack</StyledButton>
            {constructButtonsForAvailableDoors(guildTwoState?.room)}
            <StyledButton>Do nothing</StyledButton>
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
        <LargeStyledButton>Send</LargeStyledButton>
        <LargeStyledButton>Send</LargeStyledButton>
      </GuildsWrapper>
    </UserInfoWrap>
  );
};
