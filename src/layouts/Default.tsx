import styled from 'styled-components';
import BackButton from '../components/buttons/BackButton';
import { device } from '../styles';

const Default = ({
  children,
  title,
  description,
  maxWidth = 900,
  topComponent,
  backUrl,
}: {
  title: string;
  backUrl?: string;
  description: string;
  children?: any;
  maxWidth?: number;
  topComponent?: JSX.Element;
}) => {
  return (
    <MainContainer>
      <Container maxWidth={maxWidth}>
        <BackButton backUrl={backUrl} />
        <InnerContainer>
          {topComponent}
          <Title>{title}</Title>
          <SubTitle>{description}</SubTitle>
          {children}
        </InnerContainer>
      </Container>
    </MainContainer>
  );
};
export default Default;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.title};
  margin-bottom: 16px;
`;
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
`;

const Container = styled.div<{ maxWidth: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: auto;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;

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
