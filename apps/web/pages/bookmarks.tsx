import { useState, FormEvent, useEffect, useCallback } from 'react';
import Head from 'next/head';
import BookmarkList from '../components/BookmarkList';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string;
  created_at: string;
}

export default function Bookmarks() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchBookmarks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (tagFilter) params.append('tag', tagFilter);
      if (searchQuery) params.append('q', searchQuery);

      const response = await fetch(`${apiUrl}/bookmarks?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  }, [apiUrl, tagFilter, searchQuery]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/bookmarks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          url,
          tags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create bookmark');
      }

      setShowSuccess(true);
      setTitle('');
      setUrl('');
      setTags('');
      setTimeout(() => setShowSuccess(false), 3000);
      await fetchBookmarks();
    } catch {
      setShowError(true);
    }
  };

  const handleTagFilterChange = (value: string) => {
    setTagFilter(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterKeyDown = () => {
    fetchBookmarks();
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/bookmarks/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchBookmarks();
      }
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>
      <main className="page">
        <section className="hero">
          <h1>Manage Bookmarks</h1>
          
          {showSuccess && (
            <div data-testid="bookmark-success-message" className="success-message">
              Bookmark created successfully
            </div>
          )}

          {showError && (
            <div data-testid="bookmark-error-message" className="error-message">
              Failed to create bookmark
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Create Bookmark</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    data-testid="bookmark-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    data-testid="bookmark-url-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="tags" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    data-testid="bookmark-tags-input"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="comma-separated tags"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  data-testid="bookmark-submit-button"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#0066cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Create Bookmark
                </button>
              </form>
            </div>

            <div>
              <BookmarkList
                bookmarks={bookmarks}
                tagFilter={tagFilter}
                searchQuery={searchQuery}
                onTagFilterChange={handleTagFilterChange}
                onSearchChange={handleSearchChange}
                onFilterKeyDown={handleFilterKeyDown}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </section>
      </main>
  </>
  );
}

