// Externals
import React from 'react';
import styled from 'styled-components';
import { Box } from 'retro-ui';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 2px;
  padding: 10px;
`;
export const Progress = styled.div<{
  width: number;
  outcomeIndex?: number;
  selected?: boolean;
}>`
  background-color: green;
  border-radius: 4px;
  height: 100%;
  transition: width 0.25s ease-out, background-color 0.25s ease-out;
  width: ${props => props.width}%;
`;
const ProgressBar = styled.div<{ height?: number }>`
  background-color: #f5f5f5;
  border-radius: 4px;
  height: ${props => (props.height ? props.height : 6)}px;
  overflow: hidden;
`;

interface LinkedButtonsProps {}

export const PlayerInfo: React.FC<LinkedButtonsProps> = () => {

  return (
    <StyledWrapper>
      <ProgressBar>
        <Progress width={80} />
      </ProgressBar>
      <Box>Health: 40</Box>
      <Box>Victory Points: 0</Box>
      <Box>Hit Points: 8</Box>
    </StyledWrapper>
  );
};
