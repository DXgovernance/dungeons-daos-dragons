// Externals
import React from 'react';
import styled from 'styled-components'
import { PlayerData } from './PlayerData';
import { PlayerActions } from './PlayerActions';


const UserInfoWrap=styled.div`
display:flex;
flex:1;
`


interface LinkedButtonsProps {

}

export const UserInfo: React.FC<LinkedButtonsProps> = () => {


  return (
   <UserInfoWrap>
     <PlayerData/>
     <PlayerActions/>
   </UserInfoWrap>



  );
};
