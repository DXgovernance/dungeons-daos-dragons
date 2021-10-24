// Externals
import React, { useEffect, useState } from 'react';
import { Button, Box, Modal } from 'retro-ui';
import styled from 'styled-components';
import { useContext } from '../../../../contexts';

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
const StyledOptionRotated = styled(StyledOption)`
  transform: rotate(90deg);
`;
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
  const {
    context: { messageService },
  } = useContext();
  const [action, setAction] = useState<Actions>(Actions.attack);
  const [showModal, setShowModal] = useState(false);
  const [directionVotes, setDirectionVotes] = useState(null);
  const {
    context: { ddndService },
  } = useContext();
  console.log({ action });

  async function getAllGameData() {
    try {
      const getData = await ddndService.getAllGameData(1);

      const guildSelected = parseInt(
        JSON.parse(localStorage.getItem('GuildSelected'))
      );
      const getGuilds = await ddndService.getGuilds();

      setDirectionVotes(getData.actions[getGuilds[guildSelected]]);
      return getData.actions;
    } catch (e) {}
  }
  async function createProposal() {
    setShowModal(true);
    try {
      // const guild=JSON.parse(localStorage.getItem('GuildSelected'));
      //  console.log(guild)
      // const dataFor=[
      //   '0xa9190c4800149320c589197c747461f45962592b24754e87d715b8a304629ebe' ,
      // ,
      //   [0],
      //   action,
      //   "0x0000000000000000000000000000000000000000"]
      //
      // await ddndService.createProposal(' 0xa9190c4800149320c589197c747461f45962592b24754e87d715b8a304629ebe',dataFor)
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
  return (
    <PlayerActionsWrapper>
      {showModal && (
        <Modal open={showModal}>
          <Button>Confirm Transaction in Metamask</Button>
        </Modal>
      )}
      <StyledSelect multiple name="Move">
        <StyledOption
          onClick={() => {
            setAction(Actions.up);
          }}
        >
          ↑ {directionVotes && directionVotes.move_north.votes}
        </StyledOption>
        <StyledOption
          onClick={() => {
            setAction(Actions.down);
          }}
        >
          ↓ {directionVotes && directionVotes.move_south.votes}
        </StyledOption>
      </StyledSelect>
      <StyledSelect>
        <StyledOptionRotated
          onClick={() => {
            setAction(Actions.left);
          }}
        >
          ↓ {directionVotes && directionVotes.move_east.votes}
        </StyledOptionRotated>
        <StyledOptionRotated
          onClick={() => {
            setAction(Actions.right);
          }}
        >
          ↑ {directionVotes && directionVotes.move_west.votes}
        </StyledOptionRotated>
      </StyledSelect>
      <StyledButton
        style={{ backgroundColor: '#cf5f3b' }}
        onClick={() => {
          setAction(Actions.attack);
          messageService.write();
        }}
      >
        Attack 0
      </StyledButton>
      <StyledButton
        onClick={() => {
          setAction(Actions.heal);
        }}
        style={{ backgroundColor: '#bbee9e' }}
      >
        Heal 0
      </StyledButton>
      <ExecuteButton
        onClick={async () => {
          await createProposal();
        }}
      >
        Execute!
      </ExecuteButton>
    </PlayerActionsWrapper>
  );
};
