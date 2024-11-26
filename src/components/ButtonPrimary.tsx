import { styled } from "styled-components";

export const ButtonPrimary = styled.button`
  height: 30px;
  padding: 0 10px;
  border: none;
  border-radius: 0;
  background-color: dodgerblue;
  color: #d2e8ff;
  cursor: pointer;

  &[disabled] {
    background-color: #ddd;
    color: #999;
    cursor: not-allowed;
  }
`;
