// Externals
import React from 'react';
import styled from 'styled-components';
import avatr   from './assets/avatar.png';
import { PlayerInfo } from './PlayerInfo';


const Wrapper=styled.div`
  display: flex;
   align-items: center;
   padding: 6px;
  width:40%;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 5px;
`

const StyledAvatar=styled.img`
widht:150px;
height:170px;

`

interface LinkedButtonsProps {

}

export const PlayerDataV2: React.FC<LinkedButtonsProps> = () => {

  return (
    <Wrapper>
      <StyledAvatar src={avatr} />
      <PlayerInfo/>
    </Wrapper>
  );
};
