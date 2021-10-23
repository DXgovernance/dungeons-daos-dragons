
import EmptySlot, { DarkenSlot } from './empty-slot';
import styled from 'styled-components'
import React from 'react';

import BootsOutline  from './assets/boots-outline.png';
import HelmetOutline from './assets/helmet-outline.png';
import BodyOutline   from './assets/body-outline.png';
import GlovesOutline from './assets/gloves-outline.png';
import PantsOutline  from './assets/pants-outline.png';
import RingOutline   from './assets/ring-outline.png';
import SwordOutline  from './assets/sword-outline.png';
import Character     from './assets/equipment-character.png';
import Armor from './armorImages/leather-armor.png'

import './styles.scss';

const StyledWrapper=styled.div`
width:40%;
`

interface LinkedButtonsProps {

}

export const PlayerData: React.FC<LinkedButtonsProps> = () => {

  const weapon=false
  const ring=false
  const armor=false

  return (
    <StyledWrapper className='equipped-items__character'
         style={{backgroundImage: `url(${Character})`}}>

      <EmptySlot className='white-border equipped-items__helmet'>
        {
          armor  ?
            <button className='equipped-items__slot'
                    //onClick={() => unequipItem(armor.helmet)}
                    style={{ backgroundImage: `url('${Armor}')` }}>
              <DarkenSlot />
            </button>
            :
            <div className='equipped-items__slot'
                 style={{ backgroundImage: `url('${HelmetOutline}')` }} />
        }
      </EmptySlot>

      <EmptySlot className='white-border equipped-items__body'>
        {
          armor  ?
            <button className='equipped-items__slot'
                    //onClick={() => unequipItem(armor.body)}
                    style={{ backgroundImage: `url('${Armor}')` }}>
              <DarkenSlot />
            </button>
            :
            <div className='equipped-items__slot'
                 style={{ backgroundImage: `url('${BodyOutline}')` }} />
        }
      </EmptySlot>

      <div className='flex-row flex-end'>
        <EmptySlot className='equipped-items__gloves--left'>
          {
            armor &&
            <div style={{
              height: 40,
              width: 40,
              backgroundImage: `url('${Armor}')`
            }}>
              <DarkenSlot />
            </div>
          }
        </EmptySlot>
        <EmptySlot className='white-border equipped-items__pants'>
          {
            armor ?
              <button className='equipped-items__slot'
                      //onClick={() => unequipItem(armor.pants)}
                      style={{ backgroundImage: `url('${Armor}')` }}>
                <DarkenSlot />
              </button>
              :
              <div className='equipped-items__slot'
                   style={{ backgroundImage: `url('${PantsOutline}')` }} />
          }
        </EmptySlot>
        <EmptySlot className='white-border equipped-items__gloves--right'>
          {
            armor  ?
              <button className='equipped-items__slot'
                    //  onClick={() => unequipItem(armor.gloves)}
                      style={{ backgroundImage: `url('${Armor}')` }}>
                <DarkenSlot />
              </button>
              :
              <div className='equipped-items__slot'
                   style={{ backgroundImage: `url('${GlovesOutline}')` }} />
          }
        </EmptySlot>
      </div>

      <div className='flex-row space-between'>
        <EmptySlot className='white-border equipped-items__ring'>
          {
            ring ?
              <button className='equipped-items__slot'
                      //onClick={() => unequipItem(ring)}
                      style={{ backgroundImage: `url('${Armor}')` }}>
                <DarkenSlot />
              </button>
              :
              <div className='equipped-items__slot'
                   style={{ backgroundImage: `url('${RingOutline}')` }} />
          }
        </EmptySlot>

        <EmptySlot className='white-border equipped-items__weapon'>
          {
            weapon ?
              <button className='equipped-items__slot'
                    //  onClick={() => unequipItem(weapon)}
                      style={{ backgroundImage: `url('${Armor}')` }}>
                <DarkenSlot />
              </button>
              :
              <div className='equipped-items__slot'
                   style={{ backgroundImage: `url('${SwordOutline}')` }} />
          }
        </EmptySlot>
      </div>

      <div className='flex-row space-between'>
        <EmptySlot className='equipped-items__boots--left'>
          {
            armor &&
            <div style={{
              height: 40,
              width: 40,
              backgroundImage: `url('${Armor}')`
            }}>
              <DarkenSlot />
            </div>
          }
        </EmptySlot>
        <EmptySlot className='white-border equipped-items__boots--right'>
          {
            armor  ?
              <button className='equipped-items__slot'
                     // onClick={() => unequipItem(armor.boots)}
                      style={{ backgroundImage: `url('${Armor}')` }}>
                <DarkenSlot />
              </button>
              :
              <div className='equipped-items__slot'
                   style={{ backgroundImage: `url('${BootsOutline}')` }} />
          }
        </EmptySlot>
      </div>

    </StyledWrapper>
  );
};


