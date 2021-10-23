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


const StyledButton=styled(Button)`
    font-size: 16px;
`
const StyledSelect=styled(Select)`
display: flex;
    font-size: 16px;
    background-color: #98a7fe;
   
`
const StyledOption=styled.option`

background-color: #98a7fe !important;
`

interface LinkedButtonsProps {

}

export const PlayerActions: React.FC<LinkedButtonsProps> = () => {


  return (
   <PlayerActionsWrapper>
     <StyledSelect multiple name="Move">
       <StyledOption>↑</StyledOption>
       <StyledOption>↓</StyledOption>
       <StyledOption>→</StyledOption>
       <StyledOption>←</StyledOption>
     </StyledSelect>
     <StyledButton>Attack</StyledButton>
     <StyledButton>Heal</StyledButton>
   </PlayerActionsWrapper>



  );
};
