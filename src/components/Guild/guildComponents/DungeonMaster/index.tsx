// Externals
import React from 'react';
import styled from 'styled-components'

import { Box } from 'retro-ui'


const UserInfoWrap=styled.div`
display:flex;
width:100%;
align-items: center;
flex-direction: column;
`
const Guild=styled(Box)`
width:50%
`
const GuildsWrapper=styled.div`
display: flex;
width:100%;
align-items: center;
grid-gap:2px;
`
const GuildName=styled.div`
  font-family: 'Press Start 2P';
`
const GuildActions=styled(Box)`
flex-direction: column;
margin-left:auto;
width:50%;
`
interface LinkedButtonsProps {

}

export const DungeonMaster: React.FC<LinkedButtonsProps> = () => {


  return (
    <UserInfoWrap>
      <Box style={{marginBottom:"15px"}}>DungeonMaster</Box>
      <GuildsWrapper>
        <Guild>
          <GuildName>Guild name 1</GuildName>
          <GuildActions>
            <div>Move</div>
            <div>Attack</div>
          </GuildActions>
        </Guild>
        <Guild>
          <GuildName>Guild name 2</GuildName>
          <GuildActions>
            <div>Move</div>
            <div>Attack</div>
          </GuildActions>
        </Guild>
      </GuildsWrapper>

    </UserInfoWrap>



  );
};
