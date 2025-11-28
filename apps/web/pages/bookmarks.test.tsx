import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Bookmarks from './bookmarks';

// Mock fetch globally
global.fetch = jest.fn();

describe('Bookmarks page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the bookmarks form', () => {
    render(<Bookmarks />);
    
    expect(screen.getByRole('heading', { name: /manage bookmarks/i })).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-url-input')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-tags-input')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-submit-button')).toBeInTheDocument();
  });

  it('shows success message after successful API call', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Example Bookmark', url: 'https://example.com' })
    });

    render(<Bookmarks />);

    const titleInput = screen.getByTestId('bookmark-title-input');
    const urlInput = screen.getByTestId('bookmark-url-input');
    const submitButton = screen.getByTestId('bookmark-submit-button');

    await user.type(titleInput, 'Example Bookmark');
    await user.type(urlInput, 'https://example.com');
    await user.click(submitButton);

    await waitFor(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/bookmarks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Example Bookmark',
          url: 'https://example.com',
          tags: ''
        })
      });
    });

    await waitFor(() => {
      const successMessage = screen.getByTestId('bookmark-success-message');
      expect(successMessage).toBeVisible();
      expect(successMessage).toHaveTextContent('Bookmark created successfully');
    });
  });

  it('shows error message after failed API call', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid bookmark data' })
    });

    render(<Bookmarks />);

    const titleInput = screen.getByTestId('bookmark-title-input');
    const urlInput = screen.getByTestId('bookmark-url-input');
    const submitButton = screen.getByTestId('bookmark-submit-button');

    await user.type(titleInput, 'Example Bookmark');
    await user.type(urlInput, 'https://example.com');
    await user.click(submitButton);

    await waitFor(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/bookmarks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Example Bookmark',
          url: 'https://example.com',
          tags: ''
        })
      });
    });

    await waitFor(() => {
      const errorMessage = screen.getByTestId('bookmark-error-message');
      expect(errorMessage).toBeVisible();
      expect(errorMessage).toHaveTextContent('Failed to create bookmark');
    });
  });
});

