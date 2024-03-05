import { Navigate, Route, Routes } from 'react-router-dom';
import { routes, slugs } from './utils';

function App() {
  return (
    <Routes>
      <Route>
        {routes.map((route, index) => (
          <Route key={`route-${index}`} path={route.slug} element={route.component} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={slugs.surveys} />} />
    </Routes>
  );
}

export default App;
