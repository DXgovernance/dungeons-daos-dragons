// Externals
import React from 'react';
import styled from 'styled-components';

import { Input } from 'retro-ui';

const UserInfoWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;
interface LinkedButtonsProps {}

export const InitGame: React.FC<LinkedButtonsProps> = () => {
  return (
    <UserInfoWrap>
      <Input name="input" id="test" />
    </UserInfoWrap>
  );
};
