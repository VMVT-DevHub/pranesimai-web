import styled from 'styled-components';
import { Survey } from '../../types';
import { getIconUrl } from '../../utils';

const InfoCard = ({
  info,
  onClick,
  isActive,
}: {
  info: Survey | any;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const { icon, title, description } = info;
  const iconUrl = typeof icon === 'string' ? <AppIcon src={getIconUrl(icon)} /> : icon;
  return (
    <Container onClick={onClick} $isActive={isActive}>
      <Circle />
      {iconUrl}
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
};

export default InfoCard;

const AppIcon = styled.img`
  height: 54px;
`;

const Circle = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  position: absolute;
  top: 12px;
  left: 12px;
`;

const Container = styled.div<{ $isActive: boolean }>`
  padding: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  border-radius: 4px;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  ${({ $isActive, theme }) =>
    $isActive &&
    `
    background-color: #f5f6fe;
    border: 1px solid ${theme.colors.primary};

    ${Circle} {
      border: 4px solid  ${theme.colors.primary}};
  }

  `};

  :hover {
    background-color: #f5f6fe;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover ${Circle} {
    border: ${({ theme }) => `4px solid  ${theme.colors.primary}`};
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.6rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.label};
`;
