import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routes } from './testRoutes';

// Minimal router for smoke test
const router = createMemoryRouter(routes);

test('renders Home heading', () => {
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/Your Characters/i)).toBeInTheDocument();
});