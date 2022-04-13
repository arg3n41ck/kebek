import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Footer() {
  return (
    <FooterWrapper>
      <Card>
        <CardContentS
          sx={{
            padding: "0 30px !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ color: "#6B7280", fontSize: 18 }}>© 2021 Kebek.kz</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FooterItem>
              <Link to={"/privacy-policy"}>Политика конфиденциальности</Link>
            </FooterItem>
            <FooterItem>
              <Link to={"/user-agreement"}>Пользовательское соглашение</Link>
            </FooterItem>
            <FooterItem>
              <Link to={"/contacts"}>Контакты</Link>
            </FooterItem>
            <FooterItem>
              <Link to={"/faq"}>Вопросы</Link>
            </FooterItem>
          </div>
        </CardContentS>
      </Card>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  width: 100%;
  margin-bottom: 5px;
  @media screen and (max-width: 650px) {
    display: none;
  }
`;

const CardContentS = styled(CardContent)`
  height: 93px;
  @media screen and (max-width: 1370px) {
    height: 83px;
  }
  @media screen and (max-width: 992px) {
    height: 76px;
  }
`;

const FooterItem = styled.div`
  a {
    font-size: 16px;
    color: #6b7280;
    cursor: pointer;
    margin: 0 0 0 30px;
    font-weight: 400;
    @media screen and (max-width: 1370px) {
      font-size: 15px;
      margin: 0 0 0 24px;
    }
    @media screen and (max-width: 992px) {
      font-size: 12px;
      margin: 0 0 0 10px;
    }
  }
`;

export default Footer;
