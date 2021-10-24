// Externals
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Message } from 'retro-ui';

import { addPlayerPos } from '../MapUtil';
import { useContext } from '../../../../contexts';

const TitleWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`;

const MapWrap = styled.div`
--pixel-bg: darkgrey;
	/* ☝️ Inner background color */
	
	--pixel-border: black;
	/* ☝️ Inner border color */
	
	--pixel-border-2: white;
	/* ☝️ Middle border color */
	
	--pixel-border-3: var(--pixel-border);
	/* ☝️ Outer border color */
	
	--pixel: .125rem;
	/* ☝️ Pixel size */
  
  display: flex;
  justify-content: center;
  background: var(--pixel-bg);
	box-shadow:
		
	0 calc(var(--pixel) * -3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
	0 calc(var(--pixel) * 3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
	0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
	0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
	0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
	0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
	0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
	0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
	
	calc(var(--pixel) * -1) 0 0 0 var(--pixel-border),
	var(--pixel) 0 0 0 var(--pixel-border),
	0 calc(var(--pixel) * -2) 0 0 var(--pixel-border),
	0 calc(var(--pixel) * 2) 0 0 var(--pixel-border),
	0 calc(var(--pixel) * -5) 0 calc(var(--pixel) * -1) var(--pixel-border),
	0 calc(var(--pixel) * 5) 0 calc(var(--pixel) * -1) var(--pixel-border),
	0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -2) var(--pixel-border),
	0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -2) var(--pixel-border),
	0 calc(var(--pixel) * -10) 0 calc(var(--pixel) * -4) var(--pixel-border),
	0 calc(var(--pixel) * 10) 0 calc(var(--pixel) * -4) var(--pixel-border),
	0 calc(var(--pixel) * -13) 0 calc(var(--pixel) * -6) var(--pixel-border),
	0 calc(var(--pixel) * 13) 0 calc(var(--pixel) * -6) var(--pixel-border),
	
	calc(var(--pixel) * -2) 0 0 0 var(--pixel-border-2),
	calc(var(--pixel) * 2) 0 0 0 var(--pixel-border-2),
	0 calc(var(--pixel) * -1) 0 var(--pixel) var(--pixel-border-2), 
	0 var(--pixel) 0 var(--pixel) var(--pixel-border-2),
	0 calc(var(--pixel) * -4) 0 0 var(--pixel-border-2),
	0 calc(var(--pixel) * 4) 0 0 var(--pixel-border-2),
	0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
	0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
	0 calc(var(--pixel) * -8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
	0 calc(var(--pixel) * 8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
	0 calc(var(--pixel) * -11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
	0 calc(var(--pixel) * 11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
	0 calc(var(--pixel) * -14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),
	0 calc(var(--pixel) * 14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),
	
	calc(var(--pixel) * -3) 0 0 0 var(--pixel-border-3),
	calc(var(--pixel) * 3) 0 0 0 var(--pixel-border-3),
	0 0 0 calc(var(--pixel) * 2) var(--pixel-border-3),
	0 calc(var(--pixel) * -3) 0 var(--pixel) var(--pixel-border-3),
	0 calc(var(--pixel) * 3) 0 var(--pixel) var(--pixel-border-3),
	0 calc(var(--pixel) * -5) 0 0 var(--pixel-border-3),
	0 calc(var(--pixel) * 5) 0 0 var(--pixel-border-3),
	0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
	0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
	0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -2) var(--pixel-border-3), 
	0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
	0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -4) var(--pixel-border-3), 
	0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
	0 calc(var(--pixel) * -15) 0 calc(var(--pixel) * -6) var(--pixel-border-3), 
	0 calc(var(--pixel) * 15) 0 calc(var(--pixel) * -6) var(--pixel-border-3);
`;

const Title = styled(Message)`
  width: 50%;
  color: #fff;
  text-align: center;
  font-size: large;
`;

interface MapsProps {
  originalMap: string;
  guildOneState: any;
  guildTwoState: any;
}

export const SplitMap: React.FC<MapsProps> = ({
  originalMap,
  guildOneState,
  guildTwoState,

}) => {
  const {
    context: {  ddndService },
  } = useContext();
  const [guildOneMap, setGuildOneMap] = useState('');
  const [guildTwoMap, setGuildTwoMap] = useState('');
  const [guilds,setGuild]=useState(null)
  useEffect(()=>{
    async function fetchData(){
      const guildData=await ddndService.getGuilds()
      console.log('guildData',guildData)
      const guild1name=await ddndService.getGuildName(guildData[0])
      const guild2name=await ddndService.getGuildName(guildData[1])
      console.log('works?',guild1name)
      console.log('guild2',guild2name)
      setGuild([guild1name,guild2name])

    }
    fetchData()
  },[])

  useEffect(() => {
    setGuildOneMap(addPlayerPos(originalMap, guildOneState.room, 'red'));
    setGuildTwoMap(addPlayerPos(originalMap, guildTwoState.room, 'blue'));
  }, [guildOneMap, guildTwoMap]);

  return (
    <div>
      <TitleWrap>
        <Title>{guilds && guilds[0]}</Title>
        <Title>{guilds && guilds[1]}</Title>
      </TitleWrap>
      <MapWrap>
        <div dangerouslySetInnerHTML={{ __html: guildOneMap }} />
        <div dangerouslySetInnerHTML={{ __html: guildTwoMap }} />
      </MapWrap>
    </div>
  );
};
