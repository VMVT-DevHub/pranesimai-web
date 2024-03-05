import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import InfoCard from '../components/cards/InfoCard';
import Icon from '../components/other/Icons';
import Default from '../layouts/Default';
import { buttonLabels, descriptions, IconName, slugs, titles } from '../utils';

enum AuthTypes {
  AUTHENTICATED = 'AUTHENTICATED',
  ANONYM = 'ANONYM',
}

const AuthTypeSelection = () => {
  const [selectedSurveyAuthType, setSelectedSurveyAuthType] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageId = searchParams.get('pageId') || '';

  const handleSubmit = () => {
    navigate({ pathname: slugs.survey, search: `pageId=${pageId}` });
  };

  const info = [
    {
      title: titles.anonym,
      description: descriptions.anonym,
      icon: <Icon name={IconName.anonym} />,
      value: AuthTypes.ANONYM,
    },
    {
      title: titles.authenticated,
      description: descriptions.authenticated,
      icon: <Icon name={IconName.user} />,
      value: AuthTypes.AUTHENTICATED,
    },
  ];

  return (
    <Default title={titles.surveyType} description={descriptions.surveyType}>
      <Container>
        <ContentContainer>
          {info?.map((item) => (
            <InfoCard
              info={item}
              onClick={() => setSelectedSurveyAuthType(item.value)}
              isActive={selectedSurveyAuthType == item.value}
            />
          ))}
        </ContentContainer>
        <ButtonContainer>
          <Button disabled={!selectedSurveyAuthType} onClick={() => handleSubmit()}>
            {buttonLabels.next}
          </Button>
        </ButtonContainer>
      </Container>
    </Default>
  );
};

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 32px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1;
  align-items: center;
  gap: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export default AuthTypeSelection;
