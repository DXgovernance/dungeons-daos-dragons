// Externals
import React from 'react';

import styled from 'styled-components'

const PlayerDataWrapper=styled.div`
width:50%;
`


interface LinkedButtonsProps {

}

export const PlayerData: React.FC<LinkedButtonsProps> = () => {


  return (
 <PlayerDataWrapper>
   Player Data
 </PlayerDataWrapper>



  );
};
