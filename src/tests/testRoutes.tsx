import Layout from '../components/Layout';
import Home from '../pages/Home';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
];