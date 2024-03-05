import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import Checkbox from '../components/buttons/Checkbox';
import Datepicker from '../components/fields/DatePicker';
import DragAndDropUploadField from '../components/fields/DragAndDropUploadField';
import MapField from '../components/fields/MapField';
import MultiSelect from '../components/fields/MultiSelect';
import SelectField from '../components/fields/SelectField';
import TextAreaField from '../components/fields/TextAreaField';
import TextField from '../components/fields/TextField';
import FullscreenLoader from '../components/other/FullscreenLoader';
import Default from '../layouts/Default';
import { Option, Question } from '../types';
import { ButtonColors, buttonLabels, isEmpty, QuestionType, slugs } from '../utils';
import api from '../utils/api';

const Survey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageId = searchParams.get('pageId') || '';
  const [values, setValues] = useState<{ [key: number]: any }>({});
  const { data: currentResponse, isLoading } = useQuery({
    queryKey: ['currentResponse', pageId],
    queryFn: () => api.getCurrentResponse(pageId),
  });

  useEffect(() => {
    if (!currentResponse?.values) return;

    setValues(currentResponse?.values);
  }, [currentResponse?.values]);

  const renderField = (question: Question, onChange, values) => {
    const { condition, title, hint, options } = question;
    const fieldValue = values?.[question.id];

    if (!!condition && values?.[condition.question] !== condition.value) return <></>;

    const getCommonProps = {
      onChange,
      value: fieldValue,
      label: title,
      bottomLabel: hint,
    };
    const geSelectProps = {
      ...getCommonProps,
      getOptionLabel: (option: Option) => option.title,
      options,
    };

    switch (question.type) {
      case QuestionType.SELECT:
        return (
          <SelectField
            {...geSelectProps}
            value={options.find((option) => option.id === fieldValue)}
            onChange={(value) => onChange(value.id)}
          />
        );
      case QuestionType.MULTISELECT:
        return (
          <MultiSelect
            {...geSelectProps}
            value={options.filter((option) => fieldValue?.includes(option.id))}
            onChange={(values) => onChange(values.map((value) => value.id))}
          />
        );
      case QuestionType.INPUT:
        return <TextField {...getCommonProps} />;
      case QuestionType.EMAIL:
        return <TextField {...getCommonProps} type="email" />;
      case QuestionType.TEXT:
        return <TextAreaField {...getCommonProps} />;
      case QuestionType.DATE:
        return <Datepicker {...getCommonProps} />;
      case QuestionType.DATETIME:
        return <Datepicker {...getCommonProps} />;
      case QuestionType.CHECKBOX:
        return <Checkbox {...getCommonProps} />;
      case QuestionType.LOCATION:
        return <MapField {...getCommonProps} />;
      case QuestionType.RADIO:
        return (
          <ButtonsGroup
            {...geSelectProps}
            onChange={(value) => onChange(value.id)}
            isSelected={(options) => options.id === fieldValue}
          />
        );
      case QuestionType.FILES:
        return (
          <DragAndDropUploadField
            {...geSelectProps}
            files={[]}
            onUpload={(files) => Promise.resolve(console.log(files))}
          />
        );
      default:
        return null;
    }
  };

  const submitResponseMutation = useMutation({
    mutationFn: (params: { [key: string]: any }) => api.submitResponse(pageId, { values: params }),
    onSuccess: (data) => {
      navigate({ search: `pageId=${data.nextResponse}` });
    },
  });

  const handleSubmit = () => {
    submitResponseMutation.mutateAsync(values);
  };

  if (isLoading || !currentResponse?.page) return <FullscreenLoader />;

  const { title, description } = currentResponse?.page;
  const questions = currentResponse?.questions || [];
  const showBackButton = !!currentResponse?.previousResponse;

  const isDisabledSubmit =
    submitResponseMutation.isPending ||
    questions.some((question) => {
      return (
        question.required &&
        (!question?.condition ||
          values?.[question.condition.question] === question.condition.value) &&
        !values[question.id]
      );
    });

  return (
    <Default title={title} description={description}>
      <Container>
        {questions?.map((question) =>
          renderField(question, (value) => setValues({ ...values, [question.id]: value }), values),
        )}

        {isEmpty(questions) ? (
          <ButtonContainer>
            <Button
              disabled={isDisabledSubmit}
              loading={submitResponseMutation.isPending}
              onClick={() => navigate(slugs.surveys)}
            >
              {buttonLabels.close}
            </Button>
          </ButtonContainer>
        ) : (
          <ButtonsContainer $showBackButton={showBackButton}>
            {showBackButton && (
              <Button
                disabled={submitResponseMutation.isPending}
                variant={ButtonColors.TRANSPARENT}
                onClick={() => {
                  navigate({ search: `pageId=${currentResponse?.previousResponse}` });
                }}
              >
                {buttonLabels.back}
              </Button>
            )}
            <Button
              disabled={isDisabledSubmit}
              loading={submitResponseMutation.isPending}
              onClick={() => handleSubmit()}
            >
              {buttonLabels.continueFilling}
            </Button>
          </ButtonsContainer>
        )}
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

const ButtonsContainer = styled.div<{ $showBackButton: boolean }>`
  display: flex;
  margin-top: 55px;
  justify-content: ${({ $showBackButton }) => ($showBackButton ? 'space-between' : 'flex-end')};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 55px;
`;

export default Survey;
