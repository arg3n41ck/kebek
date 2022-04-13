import React from "react";
import { statusProductList } from "./constants";
import styled from "styled-components";
import green from '../../assets/icons/Ellipse_green.svg';
import grey from '../../assets/icons/Ellipse_sus.svg';
import { localeContext } from "../../providers/LocaleProvider";

const StatusProduct = ({ statusName }) => {
    const [actualStatus, setActualStatus] = React.useState(null);
    const { locale } = React.useContext(localeContext)
    const checkStatus = (s) => {
        return statusProductList.find((item) => item.encryptedName === s);
    };

    React.useEffect(() => {
        setActualStatus(checkStatus(statusName));
    });

    if (!actualStatus) return null;
    return (
        <StatusS color={actualStatus.color}>
            <img style={{ marginTop: -2, marginRight: 8 }} src={actualStatus.encryptedName === "AC" ? green : grey} />
            {locale === "ru" ? actualStatus.pluralName : actualStatus.pluralNameKk}
        </StatusS>
    );
};

const StatusS = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 3px;
  height: 100%;
  width: 100%;
  font-weight: 600 !important;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  font-family: Rubik, sans-serif;
`;

export default StatusProduct;
