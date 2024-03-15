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
import { ProgressBar } from '../components/other/ProgressBar';
import Default from '../layouts/Default';
import { device } from '../styles';
import { Option, Question } from '../types';
import { ButtonColors, buttonLabels, isEmpty, QuestionType, slugs } from '../utils';
import api from '../utils/api';

const Survey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageId = searchParams.get('pageId') || '';
  const [values, setValues] = useState<{ [key: number]: any }>({});
  const {
    data: currentResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['currentResponse', pageId],
    queryFn: () => api.getCurrentResponse(pageId),
    retry: false,
  });

  useEffect(() => {
    if (!isError) return;

    navigate(slugs.surveys);
  }, [isError]);

  useEffect(() => {
    if (!currentResponse?.values) return;

    setValues(currentResponse?.values);
  }, [currentResponse?.values]);

  const handleIsHiddenField = (conditionQuestions: Question, condition: Question['condition']) => {
    if (!conditionQuestions) return false;

    const conditionQuestionValue = values?.[condition.question];

    if (conditionQuestions.type === QuestionType.MULTISELECT) {
      if (!conditionQuestionValue?.includes(condition.value)) return true;
    } else {
      if (conditionQuestionValue !== condition.value) return true;
    }
  };

  const renderField = (
    conditionQuestions: Question,
    currentQuestion: Question,
    onChange,
    values,
  ) => {
    const { condition, title, hint, options } = currentQuestion;
    const fieldValue = values?.[currentQuestion.id];

    if (handleIsHiddenField(conditionQuestions, condition)) {
      return <></>;
    }

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

    const handleUpload = async (newPhotos: File[]) => {
      const files = await api.uploadFiles(newPhotos);
      const oldValues = fieldValue || [];
      onChange([...oldValues, ...files]);
    };

    switch (currentQuestion.type) {
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
            files={fieldValue}
            onUpload={handleUpload}
            onDelete={(files: any) => onChange(files)}
          />
        );
      default:
        return null;
    }
  };

  const submitResponseMutation = useMutation({
    mutationFn: (params: { [key: string]: any }) => api.submitResponse(pageId, { values: params }),
    onSuccess: (data) => {
      const nav = !!data?.nextResponse ? { search: `pageId=${data.nextResponse}` } : slugs.end;

      return navigate(nav);
    },
  });

  const handleSubmit = () => {
    submitResponseMutation.mutateAsync(values);
  };

  if (isLoading || !currentResponse?.page) return <FullscreenLoader />;

  const { title, description } = currentResponse?.page;
  const questions = currentResponse?.questions || [];
  const showBackButton = !!currentResponse?.previousResponse;

  const progress = currentResponse?.page?.progress;

  const mappedQuestionsByIds = questions.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});

  const handleIsRequired = (question: Question) => {
    const { condition, required, id } = question;

    if (!isEmpty(values[id])) return false;

    if (handleIsHiddenField(mappedQuestionsByIds[condition?.question], condition)) return false;

    if (required) return true;
  };

  const isDisabledSubmit = submitResponseMutation.isPending || questions.some(handleIsRequired);

  return (
    <Default
      topComponent={<ProgressBar current={progress.current} total={progress.total} />}
      title={title}
      description={description}
      maxWidth={672}
    >
      <Container>
        {questions?.map((question) =>
          renderField(
            mappedQuestionsByIds[question?.condition?.question],
            question,
            (value) => setValues({ ...values, [question.id]: value }),
            values,
          ),
        )}

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
  flex-wrap: wrap-reverse;
  gap: 10px;
  justify-content: ${({ $showBackButton }) => ($showBackButton ? 'space-between' : 'flex-end')};

  @media ${device.mobileL} {
    flex-wrap: wrap-reverse;
    gap: 10px;
    button {
      width: 100%;
    }
  }
`;

export default Survey;
