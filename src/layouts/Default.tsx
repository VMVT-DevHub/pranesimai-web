import styled from 'styled-components';
import { device } from '../styles';

const Default = ({
  children,
  title,
  description,
  maxWidth = 900,
  topComponent,
}: {
  title: string;
  description: string;
  children?: any;
  maxWidth?: number;
  topComponent?: JSX.Element;
}) => {
  return (
    <Container>
      <InnerContainer maxWidth={maxWidth}>
        {topComponent}
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
  padding: 12px;
`;

const InnerContainer = styled.div<{ maxWidth: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  margin: auto;
  width: ${({ maxWidth }) => `${maxWidth}px`};
  padding: 56px;

  @media ${device.mobileM} {
    padding: 56px 12px;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.title};
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`;
