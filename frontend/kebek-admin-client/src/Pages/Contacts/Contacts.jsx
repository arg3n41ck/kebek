import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { localeContext } from '../../providers/LocaleProvider';

import facebook from '../../../src/assets/contacts/facebook.svg';
import insta from '../../assets/contacts/insta.svg';
import arrow from '../../static/icons/left-arrow 1.svg';
import Box from '@mui/material/Box';
import { CircularProgress, Stack } from '@mui/material';

const Contacts = () => {
  const { t } = React.useContext(localeContext);

  const navigate = useNavigate();
  return (
    <>
      <ContactsStyle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate(-1)}
        >
          <img src={arrow} alt='' />
          <h5 style={{ margin: '0 0 0 10px', fontWeight: 600 }}>Назад</h5>
        </Box>
        <Title>Контакты</Title>
        <List>
          <Item>
            <ItemTitle>{t.contacts.title1}</ItemTitle>
            <ItemDescription>{t.contacts.title2}</ItemDescription>
            <ItemTitle>{t.contacts.title3}</ItemTitle>
            <ItemDescription>{t.contacts.title4}</ItemDescription>
            <ItemTitle>Социальные сети</ItemTitle>
            <div>
              <a style={{ margin: '0 10px 0 0' }} href='https://m.facebook.com/Kebek-Kazakhstan-107409368463657/'>
                <img src={facebook} alt='facebook' />
              </a>
              <a href='https://www.instagram.com/kebek_kz/'>
                <img src={insta} alt='insta' />
              </a>
            </div>
          </Item>
        </List>
      </ContactsStyle>
    </>
  );
};
const StackS = styled(Stack)`
  min-height: 73vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContactsStyle = styled.div`
  min-height: 73vh;
`;

const Title = styled.h1`
  font-family: Rubik, sans-serif;
  font-size: 35px;
  line-height: 140%;
  color: #092f33;
  font-weight: 600;
  margin: 30px 0;
`;
const List = styled.ul`
  margin: 0 !important;
  padding: 0 !important;
  max-width: 900px;
`;
const Item = styled.div`
  margin-bottom: 50px;
`;

const ItemTitle = styled.h4`
  font-family: Rubik, sans-serif;
  font-size: 25px;
  line-height: 140%;
  color: #092f33;
  font-weight: 600;
`;
const ItemDescription = styled(ItemTitle)`
  font-weight: 300;
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 30px;
`;

export default Contacts;
