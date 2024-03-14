import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import Default from '../layouts/Default';
import { buttonLabels, descriptions, slugs, titles } from '../utils';

const End = () => {
  const navigate = useNavigate();

  return (
    <Default title={titles.end} description={descriptions.end} maxWidth={672}>
      <Container>
        <ButtonContainer>
          <Button onClick={() => navigate(slugs.surveys)}>{buttonLabels.close}</Button>
        </ButtonContainer>
      </Container>
    </Default>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 55px;
`;

export default End;
