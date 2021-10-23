// Externals
import React from 'react';
import styled from 'styled-components';
import { UserInfo } from './guildComponents/UserInfo';


const GuildWrap=styled.div`
display:flex;
flex-direction: column;
`



interface LinkedButtonsProps {

}

export const GuildMain: React.FC<LinkedButtonsProps> = () => {


  return (
    <GuildWrap>

      {/*map goes here*/}
      <div>Here</div>
      <UserInfo/>

    </GuildWrap>


  );
};
