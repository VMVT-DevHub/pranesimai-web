import AuthTypeSelection from '../pages/AuthTypeSelection';
import Survey from '../pages/Survey';
import Surveys from '../pages/Surveys';

export const slugs = {
  surveys: '/pranesimai',
  auth: '/autentifikacija',
  survey: '/pranesimas',
};

export const routes = [
  {
    slug: slugs.surveys,
    component: <Surveys />,
  },
  {
    slug: slugs.auth,
    component: <AuthTypeSelection />,
  },
  {
    slug: slugs.survey,
    component: <Survey />,
  },
];
