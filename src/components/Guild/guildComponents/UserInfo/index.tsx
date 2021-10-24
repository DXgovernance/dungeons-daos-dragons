// Externals
import React from 'react';
import styled from 'styled-components'
import { PlayerActions } from './PlayerActions';
import { PlayerDataV2 } from './PlayerDatav2';


const UserInfoWrap=styled.div`
  display:flex;
  width:80%;
  align-items: center;
  justify-content: space-between;
  margin: 25px auto 10px auto
`
interface LinkedButtonsProps {

}

export const UserInfo: React.FC<LinkedButtonsProps> = () => {
  return (
   <UserInfoWrap>
     <PlayerDataV2/>
     <PlayerActions/>
   </UserInfoWrap>
  );
};
