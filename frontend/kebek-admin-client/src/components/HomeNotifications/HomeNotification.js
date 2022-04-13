import React from "react";
import { CardContent, Typography } from "@mui/material";
import classes from "../../Pages/Home/Home.module.scss";
import styled from "styled-components";
import Status from "../Status/Status";
import { format, parseISO } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { StyledBadge } from "../Badge/Badge";

function HomeNotification({ data, date }) {
  return (
    <div style={{ cursor: "pointer" }} className={classes.card__items}>
      <div>
        <CardContent className={"d-flex align-items-start"}>
          {!data?.read && <StyledBadge variant="dot" />}
          <div style={{ marginLeft: 20 }} className={"d-flex flex-column"}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              {`${data.title}`}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#828282" }}>
              {data?.content}
            </Typography>
          </div>
        </CardContent>
        <CardContent style={{ paddingTop: 0 }}>
          <div
            style={{ marginLeft: 20 }}
            className={"d-flex align-items-center"}
          >
            <StatusNotificationWrapper
              className={"text-center p-1"}
              style={{
                maxWidth: 120,
                marginRight: 10,
                width: "100%",
                borderRadius: 3,
              }}
            >
              <Status statusName={data?.orderStatus} />
            </StatusNotificationWrapper>
            <Typography sx={{ fontSize: 14, color: "#092F33" }}>
              {date && format(parseISO(`${date}`), "dd-MM-yyyy")}
            </Typography>
          </div>
        </CardContent>
        <hr style={{ margin: 5 }} />
      </div>
    </div>
  );
}
const StatusNotificationWrapper = styled.div`
  div {
    font-size: 14px;
    font-weight: 400;
    height: 30px;
  }
`;

export default HomeNotification;
