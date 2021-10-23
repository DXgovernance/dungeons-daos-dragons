// Externals
import React from 'react';
import styled from 'styled-components';

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
      <div>Health:22</div>
      <div>Score: 36</div>
      <div>Some: 12</div>

    </StyledWrapper>


  );
};
