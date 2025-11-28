import { useState, FormEvent } from 'react';
import Head from 'next/head';

export default function Bookmarks() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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
      // Reset form
      setTitle('');
      setUrl('');
      setTags('');
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setShowError(true);
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

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                data-testid="bookmark-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="url">URL</label>
              <input
                id="url"
                type="url"
                data-testid="bookmark-url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                type="text"
                data-testid="bookmark-tags-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="comma-separated tags"
              />
            </div>

            <button type="submit" data-testid="bookmark-submit-button">
              Create Bookmark
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

