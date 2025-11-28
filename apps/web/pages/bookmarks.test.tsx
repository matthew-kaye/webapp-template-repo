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
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', title: 'Example Bookmark', url: 'https://example.com' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
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
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
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

  describe('Bookmark List', () => {
    it('displays list of bookmarks', async () => {
      const bookmarks = [
        {
          id: '1',
          title: 'Example Bookmark 1',
          url: 'https://example.com/1',
          tags: 'web,development',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Example Bookmark 2',
          url: 'https://example.com/2',
          tags: 'design,resources',
          created_at: '2024-01-16T10:30:00Z'
        }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => bookmarks
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
      });

      expect(screen.getByTestId('bookmark-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('bookmark-title-1')).toHaveTextContent('Example Bookmark 1');
      expect(screen.getByTestId('bookmark-title-2')).toHaveTextContent('Example Bookmark 2');
    });

    it('filters bookmarks by tag', async () => {
      const user = userEvent.setup();
      const allBookmarks = [
        {
          id: '1',
          title: 'Web Development',
          url: 'https://web.dev',
          tags: 'web,development',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Design Resources',
          url: 'https://design.com',
          tags: 'design,resources',
          created_at: '2024-01-16T10:30:00Z'
        }
      ];

      const filteredBookmarks = [allBookmarks[0]];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => allBookmarks
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => filteredBookmarks
        });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      const tagFilter = screen.getByTestId('bookmark-tag-filter');
      await user.type(tagFilter, 'web');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/bookmarks?tag=web`);
      });

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
        expect(screen.queryByTestId('bookmark-item-2')).not.toBeInTheDocument();
      });
    });

    it('searches bookmarks by query', async () => {
      const user = userEvent.setup();
      const allBookmarks = [
        {
          id: '1',
          title: 'React Documentation',
          url: 'https://react.dev',
          tags: 'web,react',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Vue Guide',
          url: 'https://vuejs.org',
          tags: 'web,vue',
          created_at: '2024-01-16T10:30:00Z'
        }
      ];

      const filteredBookmarks = [allBookmarks[0]];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => allBookmarks
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => filteredBookmarks
        });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('bookmark-search-input');
      await user.type(searchInput, 'React');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        expect(global.fetch).toHaveBeenCalledWith(`${apiUrl}/bookmarks?q=React`);
      });

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
        expect(screen.queryByTestId('bookmark-item-2')).not.toBeInTheDocument();
      });
    });
  });
});

