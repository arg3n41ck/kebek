import React from 'react'
import styled from '@emotion/styled'

const CustomButton = styled.button`
  background: #ff0000;  
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ff0000;
    color: #fff;
  }
`;


const Button = () => {
  return (
    <div>
      <CustomButton/>
    </div>
  )
}

export default Button
