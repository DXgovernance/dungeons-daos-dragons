// Externals
import React from 'react';
import { Button,Select } from 'retro-ui'
import styled from 'styled-components'

const PlayerActionsWrapper=styled.div`
width:50%;
display: flex;
flex-direction: column;
align-items: center;
`

const StyledSelect=styled(Select)`
display: flex;
`

interface LinkedButtonsProps {

}

export const PlayerActions: React.FC<LinkedButtonsProps> = () => {


  return (
   <PlayerActionsWrapper>
     <StyledSelect multiple name="Move">
       <option>↑</option>
       <option>↓</option>
       <option>→</option>
       <option>←</option>
     </StyledSelect>
     <Button>Attack</Button>
     <Button>Heal</Button>
   </PlayerActionsWrapper>



  );
};
