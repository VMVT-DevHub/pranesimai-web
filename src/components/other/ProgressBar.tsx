import styled from 'styled-components';

export const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;

  return (
    <Container>
      <Bar>
        <InnerContainer width={progress > 100 ? 100 : progress} />
      </Bar>
      <Step>{`Žingsnis ${current}/${total}`}</Step>
    </Container>
  );
};

const Bar = styled.div`
  background-color: #f3f6f9;
  width: 100%;
  height: 4px;
  border-radius: 4px;
`;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;
`;

const Step = styled.div`
  font-size: 1.4rem;
`;

const InnerContainer = styled.div<{ width: number }>`
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${({ width }) => `${width}%`};
  height: 4px;
  border-radius: 4px;
`;
