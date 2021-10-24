// Externals
import React, { useEffect, useState } from 'react';
import { Button, Box, Modal } from 'retro-ui';
import styled from 'styled-components';
import { useContext } from '../../../../contexts';
import { formatEther } from 'ethers/utils';

const PlayerActionsWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-flow: wrap;
`;

const StyledButton = styled(Button)`
  font-size: 16px;
`;
const StyledSelect = styled(Box)`
  display: flex;
  font-size: 16px;
  background-color: #98a7fe;
`;
const StyledOption = styled.option`
  background-color: #98a7fe ;
  border-radius: 6px;
  margin: 0 10px;
  cursor: pointer;
`;
const StyledOptionRotated = styled(StyledOption)``;
const ExecuteButton = styled(Button)`
  background-color: #ff9051;
`;

interface LinkedButtonsProps {}


export const PlayerActions: React.FC<LinkedButtonsProps> = () => {

  const [showModal, setShowModal] = useState(false);
  const [directionVotes, setDirectionVotes] = useState(null);
  const {
    context: { ddndService },
  } = useContext();

  async function getAllGameData() {
    const getData = await ddndService.getAllGameData(1);

    const guildSelected = parseInt(
      JSON.parse(localStorage.getItem('GuildSelected'))
    );
    const getGuilds = await ddndService.getGuilds();

    setDirectionVotes(getData.actions[getGuilds[guildSelected]]);
    return getData.actions;
  }

  async function voteAction(action){
    setShowModal(true)

    const gameData = await ddndService.getAllGameData(1)
    const guildSelected = parseInt(JSON.parse(localStorage.getItem('GuildSelected')))
    const guildsAddresses = await ddndService.getGuilds()


    const directionProposal = gameData.actions[guildsAddresses[guildSelected]][action];
    await ddndService.voteAction(
      guildsAddresses[guildSelected],
      directionProposal.proposalId,
      "1000000000",
      action,
      gameData.topic
    );
    setShowModal(false);
  }
  useEffect(() => {
    async function fetchData() {
      await getAllGameData();
    }
    fetchData();
  }, []);
  useEffect(()=>{
    setInterval(async function() {
      await getAllGameData();
    }, 1000);
  },[])
  return (
    <PlayerActionsWrapper>
      {showModal && (
        <Modal
          onClick={() => {
            setShowModal(false);
          }}
          open={showModal}
        >
          <Button>Confirm Transaction in Metamask</Button>
        </Modal>
      )}
      <StyledSelect multiple name="Move">
        <StyledOption

          onClick={() => {
            voteAction("move_north");
          }}
        >
          ↑ {directionVotes && formatEther(directionVotes.move_north.votes)}
        </StyledOption>
        <StyledOption

          onClick={() => {
            voteAction("move_south");
          }}
        >
          ↓ {directionVotes && formatEther(directionVotes.move_south.votes)}
        </StyledOption>
      </StyledSelect>
      <StyledSelect>
        <StyledOptionRotated

          onClick={() => {
            voteAction("move_west");
          }}
        >
          ← {directionVotes && formatEther(directionVotes.move_east.votes)}
        </StyledOptionRotated>
        <StyledOptionRotated

          onClick={() => {
            voteAction("move_east");
          }}
        >
          → {directionVotes && formatEther(directionVotes.move_west.votes)}
        </StyledOptionRotated>
      </StyledSelect>
      <StyledButton
        style={{ backgroundColor: '#cf5f3b' }}
        // onClick={() => {
        //   setAction(Actions.attack);
        //   messageService.write();
        // }}
      >
        Attack 0
      </StyledButton>
      <StyledButton style={{ backgroundColor: '#bbee9e' }}>Heal 0</StyledButton>

      <ExecuteButton  onClick={async () => {  }}> Execute! </ExecuteButton>
    </PlayerActionsWrapper>
  );
};
