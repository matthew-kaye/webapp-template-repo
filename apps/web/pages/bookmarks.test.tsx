import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Bookmarks from './bookmarks';
import { bookmarksApi } from '../lib/bookmarks-api';

jest.mock('../lib/bookmarks-api');

const mockBookmarksApi = bookmarksApi as jest.Mocked<typeof bookmarksApi>;

describe('Bookmarks page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBookmarksApi.listBookmarks.mockResolvedValue([]);
  });

  it('renders the bookmarks form', async () => {
    mockBookmarksApi.listBookmarks.mockResolvedValueOnce([]);
    render(<Bookmarks />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /manage bookmarks/i })).toBeInTheDocument();
    });

    expect(screen.getByTestId('bookmark-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-url-input')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-tags-input')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-submit-button')).toBeInTheDocument();
  });

  describe('create', () => {
    it('shows success message after successful API call', async () => {
      const user = userEvent.setup();
      mockBookmarksApi.listBookmarks.mockResolvedValueOnce([]);
      mockBookmarksApi.createBookmark.mockResolvedValueOnce({
        id: '1',
        title: 'Example Bookmark',
        url: 'https://example.com',
        tags: '',
        created_at: '2024-01-15T10:30:00Z',
      });
      mockBookmarksApi.listBookmarks.mockResolvedValueOnce([]);

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-title-input')).toBeInTheDocument();
      });

      const titleInput = screen.getByTestId('bookmark-title-input');
      const urlInput = screen.getByTestId('bookmark-url-input');
      const submitButton = screen.getByTestId('bookmark-submit-button');

      await user.type(titleInput, 'Example Bookmark');
      await user.type(urlInput, 'https://example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockBookmarksApi.createBookmark).toHaveBeenCalledWith({
          title: 'Example Bookmark',
          url: 'https://example.com',
          tags: '',
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
      mockBookmarksApi.listBookmarks.mockResolvedValueOnce([]);
      mockBookmarksApi.createBookmark.mockRejectedValueOnce(new Error('Failed to create bookmark'));

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-title-input')).toBeInTheDocument();
      });

      const titleInput = screen.getByTestId('bookmark-title-input');
      const urlInput = screen.getByTestId('bookmark-url-input');
      const submitButton = screen.getByTestId('bookmark-submit-button');

      await user.type(titleInput, 'Example Bookmark');
      await user.type(urlInput, 'https://example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockBookmarksApi.createBookmark).toHaveBeenCalledWith({
          title: 'Example Bookmark',
          url: 'https://example.com',
          tags: '',
        });
      });

      await waitFor(() => {
        const errorMessage = screen.getByTestId('bookmark-error-message');
        expect(errorMessage).toBeVisible();
        expect(errorMessage).toHaveTextContent('Failed to create bookmark');
      });
    });
  });

  describe('update', () => {
    it('opens modal and populates form when edit button is clicked', async () => {
      const user = userEvent.setup();
      const bookmarks = [
        {
          id: '1',
          title: 'Original Title',
          url: 'https://original.com',
          tags: 'original',
          created_at: '2024-01-15T10:30:00Z',
        },
      ];

      mockBookmarksApi.listBookmarks.mockResolvedValueOnce(bookmarks);

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
      });

      const editButton = screen.getByTestId('bookmark-edit-1');
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-update-modal')).toBeVisible();
      });

      expect(screen.getByTestId('bookmark-update-title-input')).toHaveValue('Original Title');
      expect(screen.getByTestId('bookmark-update-url-input')).toHaveValue('https://original.com');
      expect(screen.getByTestId('bookmark-update-tags-input')).toHaveValue('original');
      expect(screen.getByRole('heading', { name: /edit bookmark/i })).toBeInTheDocument();
    });

    it('updates bookmark and shows success message', async () => {
      const user = userEvent.setup();
      const bookmarks = [
        {
          id: '1',
          title: 'Original Title',
          url: 'https://original.com',
          tags: 'original',
          created_at: '2024-01-15T10:30:00Z',
        },
      ];

      mockBookmarksApi.listBookmarks.mockResolvedValueOnce(bookmarks);
      mockBookmarksApi.updateBookmark.mockResolvedValueOnce({
        id: '1',
        title: 'Updated Title',
        url: 'https://updated.com',
        tags: 'updated',
        created_at: '2024-01-15T10:30:00Z',
      });
      mockBookmarksApi.listBookmarks.mockResolvedValueOnce([
        {
          id: '1',
          title: 'Updated Title',
          url: 'https://updated.com',
          tags: 'updated',
          created_at: '2024-01-15T10:30:00Z',
        },
      ]);

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
      });

      const editButton = screen.getByTestId('bookmark-edit-1');
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-update-modal')).toBeVisible();
      });

      const titleInput = screen.getByTestId('bookmark-update-title-input');
      const urlInput = screen.getByTestId('bookmark-update-url-input');
      const tagsInput = screen.getByTestId('bookmark-update-tags-input');
      const submitButton = screen.getByTestId('bookmark-update-submit-button');

      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');
      await user.clear(urlInput);
      await user.type(urlInput, 'https://updated.com');
      await user.clear(tagsInput);
      await user.type(tagsInput, 'updated');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockBookmarksApi.updateBookmark).toHaveBeenCalledWith('1', {
          title: 'Updated Title',
          url: 'https://updated.com',
          tags: 'updated',
        });
      });

      await waitFor(() => {
        const successMessage = screen.getByTestId('bookmark-success-message');
        expect(successMessage).toBeVisible();
        expect(successMessage).toHaveTextContent('Bookmark updated successfully');
      });
    });

    it('shows error message when update fails', async () => {
      const user = userEvent.setup();
      const bookmarks = [
        {
          id: '1',
          title: 'Original Title',
          url: 'https://original.com',
          tags: 'original',
          created_at: '2024-01-15T10:30:00Z',
        },
      ];

      mockBookmarksApi.listBookmarks.mockResolvedValueOnce(bookmarks);
      mockBookmarksApi.updateBookmark.mockRejectedValueOnce(new Error('Failed to update bookmark'));

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
      });

      const editButton = screen.getByTestId('bookmark-edit-1');
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-update-modal')).toBeVisible();
      });

      const submitButton = screen.getByTestId('bookmark-update-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('bookmark-error-message');
        expect(errorMessage).toBeVisible();
        expect(errorMessage).toHaveTextContent('Failed to update bookmark');
      });
    });
  });

  describe('delete', () => {
    it('deletes a bookmark when delete button is clicked', async () => {
      const user = userEvent.setup();
      const bookmarks = [
        {
          id: '1',
          title: 'Bookmark 1',
          url: 'https://example.com/1',
          tags: 'web',
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          title: 'Bookmark 2',
          url: 'https://example.com/2',
          tags: 'design',
          created_at: '2024-01-16T10:30:00Z',
        },
      ];

      const remainingBookmarks = [bookmarks[1]];

      mockBookmarksApi.listBookmarks.mockResolvedValueOnce(bookmarks);
      mockBookmarksApi.deleteBookmark.mockResolvedValueOnce(undefined);
      mockBookmarksApi.listBookmarks.mockResolvedValueOnce(remainingBookmarks);

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('bookmark-item-2')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('bookmark-delete-1');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockBookmarksApi.deleteBookmark).toHaveBeenCalledWith('1');
      });

      await waitFor(() => {
        expect(screen.queryByTestId('bookmark-item-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('bookmark-item-2')).toBeInTheDocument();
      });
    });
  });

  describe('list', () => {
    it('displays list of bookmarks', async () => {
      const bookmarks = [
        {
          id: '1',
          title: 'Example Bookmark 1',
          url: 'https://example.com/1',
          tags: 'web,development',
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          title: 'Example Bookmark 2',
          url: 'https://example.com/2',
          tags: 'design,resources',
          created_at: '2024-01-16T10:30:00Z',
        },
      ];

      mockBookmarksApi.listBookmarks.mockResolvedValueOnce(bookmarks);

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
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          title: 'Design Resources',
          url: 'https://design.com',
          tags: 'design,resources',
          created_at: '2024-01-16T10:30:00Z',
        },
      ];

      const filteredBookmarks = [allBookmarks[0]];

      let callCount = 0;
      mockBookmarksApi.listBookmarks.mockImplementation((tag?: string) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(allBookmarks);
        }
        if (tag === 'web') {
          return Promise.resolve(filteredBookmarks);
        }
        return Promise.resolve([]);
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
          expect(screen.getByTestId('bookmark-item-2')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const tagFilter = screen.getByTestId('bookmark-tag-filter');
      await user.clear(tagFilter);
      await user.type(tagFilter, 'web');
      await user.keyboard('{Enter}');

      await waitFor(
        () => {
          expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
          expect(screen.queryByTestId('bookmark-item-2')).not.toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('searches bookmarks by query', async () => {
      const user = userEvent.setup();
      const allBookmarks = [
        {
          id: '1',
          title: 'React Documentation',
          url: 'https://react.dev',
          tags: 'web,react',
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          title: 'Vue Guide',
          url: 'https://vuejs.org',
          tags: 'web,vue',
          created_at: '2024-01-16T10:30:00Z',
        },
      ];

      const filteredBookmarks = [allBookmarks[0]];

      let callCount = 0;
      mockBookmarksApi.listBookmarks.mockImplementation((tag?: string, query?: string) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(allBookmarks);
        }
        if (query === 'React') {
          return Promise.resolve(filteredBookmarks);
        }
        return Promise.resolve([]);
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByTestId('bookmark-list')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
          expect(screen.getByTestId('bookmark-item-2')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const searchInput = screen.getByTestId('bookmark-search-input');
      await user.clear(searchInput);
      await user.type(searchInput, 'React');
      await user.keyboard('{Enter}');

      await waitFor(
        () => {
          expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
          expect(screen.queryByTestId('bookmark-item-2')).not.toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });
});
