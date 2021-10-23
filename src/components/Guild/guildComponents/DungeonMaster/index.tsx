// Externals
import React from 'react';
import styled from 'styled-components'
import { PlayerActions } from './PlayerActions';
import { PlayerDataV2 } from './PlayerDatav2';


const UserInfoWrap=styled.div`
display:flex;
width:100%;
align-items: center;
`


interface LinkedButtonsProps {

}

export const DungeonMaster: React.FC<LinkedButtonsProps> = () => {


  return (
    <UserInfoWrap>
      <div>DungeonMaster</div>
    </UserInfoWrap>



  );
};
