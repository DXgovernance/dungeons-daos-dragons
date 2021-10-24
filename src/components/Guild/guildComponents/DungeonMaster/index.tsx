// Externals
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Box, Message, Input, Button } from 'retro-ui';

// import { generateMap } from '../../../../map-generator/index';

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
    context: { ipfsService, ddndService },
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

  // const uploadToIpfs = async (json, svg) => {
  //   try {
  //     const jsonString = JSON.stringify({ rooms: json, map: svg });
  //     console.log({ jsonString });
  //     const jsonHash = await ipfsService.add(jsonString);
  //     console.log({ jsonHash });
  //     const mapString = JSON.stringify(svg);
  //     console.log({ mapString });
  //     const mapHash = await ipfsService.add(svg);
  //     console.log({ mapHash });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const setNextTurn = function () {
    const actualTurn = 1;
    const finalActionSignatures = [];
    const startActionsOfNextTurn = [
      `${guildOneDesc}:${guildTwoDesc}`,
      'StateOfGuild',
      'StateOfGuild',
    ];
    ddndService.setNextTurnFromDM(
      1,
      actualTurn + 1,
      1,
      `${guildOneDesc}:${guildTwoDesc}`,
      '0x0', // address 0x0
      finalActionSignatures,
      startActionsOfNextTurn
    );
  };

  useEffect(() => {
    getInitialMapFromIpfs();
  }, []);

  console.log({ json });

  const constructButtonsForAvailableDoors = room => {
    return room?.doors.map(door => {
      return <StyledButton>Go {door.connection.direction}</StyledButton>;
    });
  };
  const [guilds, setGuild] = useState(null);
  const [turnNumber, setTurnNumber] = useState(null);
  const [guildsApprovedActions, setGuildApprovedActions] = useState([
    'waiting for decision..',
    'waiting for decision..',
  ]);
  useEffect(() => {
    async function fetchData() {
      const gameData = await ddndService.getAllGameData(1);
      const guild1name = await ddndService.getGuildName(
        gameData.playersAddresses[1]
      );
      const guild2name = await ddndService.getGuildName(
        gameData.playersAddresses[2]
      );
      setTurnNumber(Number(gameData.turnNumber) + 1);
      Object.keys(gameData.actions[gameData.playersAddresses[1]]).map(
        action => {
          if (
            gameData.actions[gameData.playersAddresses[1]][action].state == '3'
          )
            guildsApprovedActions[0] = action;
        }
      );
      Object.keys(gameData.actions[gameData.playersAddresses[2]]).map(
        action => {
          if (
            gameData.actions[gameData.playersAddresses[2]][action].state == '3'
          )
            guildsApprovedActions[1] = action;
        }
      );
      setGuild([guild1name, guild2name]);
      setGuildApprovedActions(guildsApprovedActions);
    }
    fetchData();
  }, []);

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
          <Message>
            {guilds && guilds[0]} Decision - Move {turnNumber}
          </Message>
          <Message type="success">
            {guildsApprovedActions && guildsApprovedActions[0]}
          </Message>
        </StyledBox>
        <StyledBox>
          <Message>
            {guilds && guilds[1]} Decision - Move {turnNumber}
          </Message>
          <Message type="success">
            {guildsApprovedActions && guildsApprovedActions[1]}
          </Message>
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
        <LargeStyledButton onClick={() => setNextTurn()}>
          Send
        </LargeStyledButton>
      </GuildsWrapper>
    </UserInfoWrap>
  );
};
