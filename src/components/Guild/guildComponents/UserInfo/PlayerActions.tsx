// Externals
import React, { useEffect, useState } from 'react';
import { Button, Box,Modal } from 'retro-ui';
import styled from 'styled-components';
 import { useContext } from '../../../../contexts';


const PlayerActionsWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
const ExecuteButton=styled(Button)`
background-color: #ff9051;
`

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
  const [showModal,setShowModal]=useState(false)
  const {
    context: { ddndService },
  } = useContext();

  async function createProposal(){
    setShowModal(true)
    try{
      const guild=JSON.parse(localStorage.getItem('GuildSelected'));
       console.log(guild)
      const dataFor=[
        '0xa9190c4800149320c589197c747461f45962592b24754e87d715b8a304629ebe' ,
      ,
        [0],
        action,
        "0x0000000000000000000000000000000000000000"]

      await ddndService.createProposal(' 0xa9190c4800149320c589197c747461f45962592b24754e87d715b8a304629ebe',dataFor)
    }catch (e) {
      console.log(e)
      setShowModal(false)
    }
    setShowModal(false)


  }
  useEffect(() => {
    console.log(action);
  }, [action]);
  return (
    <PlayerActionsWrapper>
      {showModal &&
      <Modal open={showModal}>
        <Button >Confirm Transaction in Metamsk</Button>
      </Modal>}
      <StyledSelect multiple name="Move">
        <StyledOption
          onClick={() => {
            setAction(Actions.up);
          }}
        >
          ↑
        </StyledOption>
        <StyledOption
          onClick={() => {
            setAction(Actions.down);
          }}
        >
          ↓
        </StyledOption>
        <StyledOptionRotated
          onClick={() => {
            setAction(Actions.left);
          }}
        >
          ↓
        </StyledOptionRotated>
        <StyledOptionRotated
          onClick={() => {
            setAction(Actions.right);
          }}
        >
          ↑
        </StyledOptionRotated>
      </StyledSelect>
      <StyledButton
        onClick={() => {
          setAction(Actions.attack);
        }}
      >
        Attack
      </StyledButton>
      <StyledButton
        onClick={() => {
          setAction(Actions.heal);
        }}
      >
        Heal
      </StyledButton>
      <ExecuteButton  onClick={async () => {

        await createProposal()
      }}>
        Execute!
      </ExecuteButton>
    </PlayerActionsWrapper>
  );
};
