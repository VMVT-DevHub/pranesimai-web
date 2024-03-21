import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { buttonLabels } from '../../utils';
import { ButtonColors, IconName } from '../../utils/constants';
import Icon from '../other/Icons';
import Button from './Button';

const BackButton = ({ backUrl }: { backUrl?: string }) => {
  const navigate = useNavigate();

  if (!backUrl) return <></>;

  return (
    <StyledButton
      leftIcon={<StyledBackIcon name={IconName.back} />}
      variant={ButtonColors.TRANSPARENT}
      onClick={() => navigate(backUrl)}
      type="button"
      height={32}
      color="black"
    >
      {buttonLabels.backToStart}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  min-width: 0px;
  margin-top: 20px;
  padding-left: 0;
  width: fit-content;
  border: none;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledBackIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.6rem;
  align-self: center;
  color: ${({ theme }) => theme.colors.primary};
`;

export default BackButton;
