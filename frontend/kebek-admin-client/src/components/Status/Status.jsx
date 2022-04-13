import React, { useEffect, useState } from "react";
import { statusList } from "./constants";
import styled from "styled-components";

const Status = ({ statusName }) => {
  const [actualStatus, setActualStatus] = useState(null);
  const checkStatus = (s) => {
    return statusList.find((item) => item.encryptedName === s);
  };

  useEffect(() => {
    setActualStatus(checkStatus(statusName));
  });

  if (!actualStatus) return null;
  return (
    <StatusS bg={actualStatus.bg} color={actualStatus.color}>
      {actualStatus.name}
    </StatusS>
  );
};

const StatusS = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  height: 100%;
  width: 100%;
  font-weight: 600 !important;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  font-family: Rubik, sans-serif;
`;

export default Status;
