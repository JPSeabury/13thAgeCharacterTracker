import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import CharacterWizard from '../pages/Wizard/CharacterWizard';
import CharacterSheet from '../pages/CharacterSheet';
import PrintView from '../pages/PrintView';

export const router = createBrowserRouter([
  { path: '/', element: <Layout />, children: [
    { index: true, element: <Home /> },
    { path: 'wizard', element: <CharacterWizard /> },
    { path: 'character/:id', element: <CharacterSheet /> },
    { path: 'print/:id', element: <PrintView /> },
  ]},
]);