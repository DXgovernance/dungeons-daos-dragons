// Externals
import React, { useEffect, useState } from 'react';
import { Button, Box } from 'retro-ui';
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

interface LinkedButtonsProps {}
enum Actions {
  up,
  down,
  left,
  right,
  attack,
  heal,
}

export const PlayerActions: React.FC<LinkedButtonsProps> = () => {
  const {
    context: {
      messageService
    },
  } = useContext();
  const [action, setAction] = useState<Actions>(Actions.attack);
  useEffect(() => {
    console.log(action);
  }, [action]);
  return (
    <PlayerActionsWrapper>
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
          messageService.write();
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
    </PlayerActionsWrapper>
  );
};
