import styled from 'styled-components';
import { device } from '../styles';

const Default = ({
  children,
  title,
  description,
}: {
  title: string;
  description: string;
  children?: any;
}) => {
  return (
    <Container>
      <InnerContainer>
        <Title>{title}</Title>
        <SubTitle>{description}</SubTitle>
        {children}
      </InnerContainer>
    </Container>
  );
};
export default Default;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.title};
  margin-bottom: 16px;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px 0;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: white;
  width: 100%;
  @media ${device.desktop} {
    width: 750px;
    margin: auto;
    padding: 56px;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.title};
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`;
