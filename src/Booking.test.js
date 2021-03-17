import { render, screen } from '@testing-library/react';
import Booking from './Booking';

test('renders learn react link', () => {
  render(<Booking />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
