import styled from 'styled-components';
import Loader from './Loader';

const FullscreenLoader = () => (
  <Container>
    <Loader />
  </Container>
);
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
export default FullscreenLoader;
