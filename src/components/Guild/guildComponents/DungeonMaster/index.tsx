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
    context: { ipfsService,ddndService },
  } = useContext();

  const uploadToIpfs = async (json, svg) => {
    try{
      const jsonString = JSON.stringify({ rooms: json, map: svg });
      console.log({ jsonString });
      const jsonHash = await ipfsService.add(jsonString);
      console.log({ jsonHash });
      const mapString = JSON.stringify(svg);
      console.log({ mapString });
      const mapHash = await ipfsService.add(svg);
      console.log({ mapHash });
    }catch (e) {
console.log(e)
    }

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
  const [guilds,setGuild]=useState(null)
  useEffect(()=>{
    async function fetchData(){
      const guildData=await ddndService.getGuilds()
      console.log('guildData',guildData)
      const guild1name=await ddndService.getGuildName(guildData[0])
      const guild2name=await ddndService.getGuildName(guildData[1])
      console.log('works?',guild1name)
      console.log('guild2',guild2name)
      setGuild([guild1name,guild2name])

    }
    fetchData()
  },[])

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
          <Message>{guilds && guilds[0]} Decision - Move 4</Message>
          <Message type="success">Move down</Message>
        </StyledBox>
        <StyledBox>
          <Message>{guilds && guilds[1]} Decision - Move 4</Message>
          <Message type="success">Attack</Message>
        </StyledBox>
        <StyledBox>
          <Message>{guilds && guilds[0]} - Move 4 - Action</Message>
          <ButtonWrapper>
            <Button>Attack</Button>
            {constructButtonsForAvailableDoors(guildOneState?.room)}
            <Button>Nothing</Button>
          </ButtonWrapper>
        </StyledBox>
        <StyledBox>
          <Message>{guilds && guilds[1]} - Move 4 - Action</Message>
          <ButtonWrapper>
            <StyledButton>Attack</StyledButton>
            {constructButtonsForAvailableDoors(guildTwoState?.room)}
            <StyledButton>Do nothing</StyledButton>
          </ButtonWrapper>
        </StyledBox>
        <StyledBox>
          <Input
            name={`${guilds && guilds[0]} Next description`}
            id="guildOneDesc"
            value={guildOneDesc}
            onChange={e => setGuildOneDesc(e.target.value)}
          />
        </StyledBox>
        <StyledBox>
          <Input
            name={`${guilds && guilds[1]} Next      description`}
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
