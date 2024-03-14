import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import InfoCard from '../components/cards/InfoCard';
import FullscreenLoader from '../components/other/FullscreenLoader';
import Default from '../layouts/Default';
import { buttonLabels, descriptions, slugs, titles } from '../utils';
import api from '../utils/api';

const Surveys = () => {
  const navigate = useNavigate();
  const [selectedSurveyId, setSelectedSurveyId] = useState(-1);
  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => api.getAllSurveys(),
  });

  const startSurveyMutation = useMutation({
    mutationFn: () => api.startSurvey({ survey: selectedSurveyId, auth: false }),

    onSuccess: (data) => {
      navigate({ pathname: slugs.auth, search: `pageId=${data.lastResponse}` });
    },
  });

  const env = import.meta.env;

  return (
    <Default title={titles.surveyType} description={descriptions.surveyType}>
      <Container>
        {isLoading && <FullscreenLoader />}
        <form action={`${env.VITE_PROXY_URL}/sessions/start`} method="POST">
          <input type="hidden" name="survey" value={selectedSurveyId} />
          <input type="hidden" name="auth" value="false" />
          <ContentContainer>
            {surveys?.map((survey) => (
              <InfoCard
                info={survey}
                onClick={() => setSelectedSurveyId(survey.id)}
                isActive={selectedSurveyId == survey.id}
              />
            ))}
          </ContentContainer>
          <ButtonContainer>
            <Button
              disabled={selectedSurveyId < 0 || startSurveyMutation.isPending}
              loading={startSurveyMutation.isPending}
              type="submit"
            >
              {buttonLabels.next}
            </Button>
          </ButtonContainer>
        </form>
      </Container>
    </Default>
  );
};

const ContentContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 32px;
  width: 100%;
`;

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
  margin-top: 20px;
  width: 100%;
`;

export default Surveys;
