import styled from "styled-components";
import AntdFilterModal from "./modal";

export default function Table() {
  return (
    <Wrapper>
      <AntdFilterModal />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 600px;
  background: white;
`;
