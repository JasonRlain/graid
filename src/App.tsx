import styled from "styled-components";
import Table from "./components/table";

function App() {
  return (
    <Wrapper>
      <h2>Table</h2>
      <Table />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  height: 100%;
  /* width: 100%; */
  background: grey;
  padding: 2rem;
  /* overflow-y: hidden; */
`;
