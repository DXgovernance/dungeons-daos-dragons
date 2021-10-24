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
  background-color: #98a7fe !important;
  margin: 0 10px;
  cursor: pointer;
`;
const StyledOptionRotated = styled(StyledOption)``;
const ExecuteButton = styled(Button)`
  background-color: #ff9051;
`;

interface LinkedButtonsProps {}
export enum Actions {
  up,
  down,
  left,
  right,
  attack,
  heal,
}

export const PlayerActions: React.FC<LinkedButtonsProps> = () => {
  const [action, setAction] = useState<Actions>(Actions.attack);
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
  async function vote() {
    setShowModal(true);
    try {
      console.log(action);
      const getData = await ddndService.getAllGameData(1);
      const guildSelected = parseInt(
        JSON.parse(localStorage.getItem('GuildSelected'))
      );
      const getGuilds = await ddndService.getGuilds();

      let directionProposal;
      if (action === Actions.up)
        directionProposal =
          getData.actions[getGuilds[guildSelected]].move_north;
      if (action === Actions.down)
        directionProposal =
          getData.actions[getGuilds[guildSelected]].move_south;
      if (action === Actions.left)
        directionProposal = getData.actions[getGuilds[guildSelected]].move_west;
      if (action === Actions.right)
        directionProposal = getData.actions[getGuilds[guildSelected]].move_east;
      const vote = await ddndService.vote(
        getGuilds[guildSelected],
        directionProposal.proposalId,
        '1000000000'
      );
      console.log(vote);
    } catch (e) {
      setShowModal(false);
    }
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
            setAction(Actions.up);
          }}
        >
          ↑ {directionVotes && formatEther(directionVotes.move_north.votes)}
        </StyledOption>
        <StyledOption
          onClick={() => {
            setAction(Actions.down);
          }}
        >
          ↓ {directionVotes && formatEther(directionVotes.move_south.votes)}
        </StyledOption>
      </StyledSelect>
      <StyledSelect>
        <StyledOptionRotated
          onClick={() => {
            setAction(Actions.left);
          }}
        >
          ← {directionVotes && formatEther(directionVotes.move_east.votes)}
        </StyledOptionRotated>
        <StyledOptionRotated
          onClick={() => {
            setAction(Actions.right);
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
      <ExecuteButton
        onClick={async () => {
          await vote();
        }}
      >
        Execute!
      </ExecuteButton>
    </PlayerActionsWrapper>
  );
};
