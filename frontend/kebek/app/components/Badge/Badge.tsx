import * as React from 'react';
import { styled, Box } from '@mui/system';
import BadgeUnstyled from '@mui/base/BadgeUnstyled';

export const StyledBadge = styled(BadgeUnstyled)`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  position: relative;
  display: inline-block;
  line-height: 1;
  cursor: pointer;

  & .MuiBadge-badge {
    z-index: auto;
    min-width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 400;
    font-size: 11px;
    line-height: 20px;
    white-space: nowrap;
    background: #ff4d4f;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-dot {
    padding: 0;
    z-index: auto;
    min-width: 6px;
    width: 6px;
    height: 6px;
    background: #ff4d4f;
    border-radius: 100%;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-anchorOriginTopRightCircular {
    position: absolute;
    top: 5px;
    right: 2px;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
  }
`;

function BadgeContent() {
  return (
    <Box
      component="span"
      sx={{
        width: 9,
        height: 9,
        borderRadius: '2px',
        background: '#EB5757',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
}

export default BadgeContent