import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import arrow from '../../assets/icons/left-arrow 1.svg';
import Box from '@mui/material/Box';
import { $api } from '../../services/api';
import { CircularProgress, Stack } from '@mui/material';
import { localeContext } from '../../providers/LocaleProvider';
import Loader from "../../components/Loader/Loader"

const Faq = () => {
  const [faqData, setFaqData] = useState(null);
  const { locale } = React.useContext(localeContext);
  const navigate = useNavigate();

  useEffect(() => {
    $api
      .get('/support/faq/')
      .then(({ data }) =>
        setFaqData(locale === 'ru' ? data.results[1] : data.results[0])
      );
  }, [locale]);

  if (!faqData) {
    return <Loader />
  }

  return (
    <FaqStyle>
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
      <Title>Вопросы</Title>
      <List>
        {!!faqData?.qa?.length &&
          faqData.qa.map((item) => (
            <Item key={item.id}>
              <ItemTitle>{item.question}</ItemTitle>
              <ItemDescription>{item.answer}</ItemDescription>
            </Item>
          ))}
      </List>
    </FaqStyle>
  );
};

const StackS = styled(Stack)`
  min-height: 73vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FaqStyle = styled.div`
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

export default Faq;
