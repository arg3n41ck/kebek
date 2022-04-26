import React from "react";
import BadgeUnstyled from "@mui/base/BadgeUnstyled";
import { styled } from "@mui/system";

export const StyledBadge = styled(BadgeUnstyled)`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  position: relative;
  display: inline-block;
  line-height: 1;

  & .MuiBadge-badge {
    z-index: auto !important;
    min-width: 20px !important;
    height: 20px !important;
    margin-top: -8px !important;
    padding: 0 4px !important;
    color: #fff !important;
    font-weight: 400 !important;
    font-size: 12px !important;
    line-height: 20px !important;
    white-space: nowrap !important;
    text-align: center !important;
    background: #ff4d4f !important;
    border-radius: 10px !important;
    box-shadow: 0 0 0 1px #fff !important;
  }

  & .MuiBadge-dot {
    padding: 0 !important;
    z-index: auto !important;
    min-width: 8px !important;
    width: 11px !important;
    height: 11px !important;
    background: #ff4d4f !important;
    margin-top: 11px !important;
    border-radius: 100% !important;
    box-shadow: 0 0 0 1px #fff !important;
  }

  & .MuiBadge-anchorOriginTopRight {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
  }
`;

function Badge() {
  return <StyledBadge badgeContent={""}></StyledBadge>;
}

export default Badge;
