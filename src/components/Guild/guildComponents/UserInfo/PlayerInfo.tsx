// Externals
import React from 'react';
import styled from 'styled-components';
import { Box } from 'retro-ui'

const StyledWrapper=styled.div`
display: flex;
flex-direction: column;
grid-gap:2px;
`


interface LinkedButtonsProps {

}

export const PlayerInfo: React.FC<LinkedButtonsProps> = () => {


  return (
    <StyledWrapper>
      <Box>Health:22</Box>
      <Box>Score: 36</Box>
      <Box>Some: 12</Box>

    </StyledWrapper>


  );
};
