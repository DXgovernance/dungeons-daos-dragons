// Externals
import React from 'react';
import styled from 'styled-components';
import { UserInfo } from './guildComponents/UserInfo';


const GuildWrap=styled.div`
display:flex;
flex-direction: column;
`
console.log("DDND_ADDRESS", process.env.REACT_APP_DDND_ADDRESS)
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
