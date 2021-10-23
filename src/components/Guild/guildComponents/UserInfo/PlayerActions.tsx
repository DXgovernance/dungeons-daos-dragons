// Externals
import React, { useEffect, useState } from 'react';
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
enum Actions {
  up,
  down,
  left,
  right,
  attack,
  heal

}

export const PlayerActions: React.FC<LinkedButtonsProps> = () => {
    const [action,setAction]=useState<Actions>(Actions.attack)
    useEffect(()=>{
      console.log(action)
    },[action])
  return (
   <PlayerActionsWrapper>
     <StyledSelect multiple name="Move">
       <StyledOption onClick={()=>{
         setAction(Actions.up)
       }}>↑</StyledOption>
       <StyledOption onClick={()=>{
         setAction(Actions.down)
       }}>↓</StyledOption>
       <StyledOption onClick={()=>{
         setAction(Actions.right)
       }}>→</StyledOption>
       <StyledOption onClick={()=>{
         setAction(Actions.left)
       }}>←</StyledOption>
     </StyledSelect>
     <StyledButton onClick={()=>{
        setAction(Actions.attack)
     }}>Attack</StyledButton>
     <StyledButton onClick={()=>{
       setAction(Actions.heal)
     }}>Heal</StyledButton>
   </PlayerActionsWrapper>



  );
};
