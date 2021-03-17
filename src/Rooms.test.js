import { render, screen } from '@testing-library/react';
import Rooms from './Rooms';

test('renders learn react link', () => {
  render(<Rooms />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
