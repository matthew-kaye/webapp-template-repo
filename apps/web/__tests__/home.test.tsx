import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home page', () => {
  it('renders the Hello World copy', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  });
});
