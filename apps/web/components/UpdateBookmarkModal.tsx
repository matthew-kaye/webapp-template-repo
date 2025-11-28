import { useState, FormEvent, useEffect } from 'react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string;
  created_at: string;
}

interface UpdateBookmarkModalProps {
  bookmark: Bookmark | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, bookmark: { title: string; url: string; tags: string }) => Promise<void>;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function UpdateBookmarkModal({
  bookmark,
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  onError
}: UpdateBookmarkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
      setTags(bookmark.tags);
    }
  }, [bookmark]);

  if (!isOpen || !bookmark) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await onSubmit(bookmark.id, { title, url, tags });
      onSuccess?.();
      onClose();
    } catch {
      onError?.();
    }
  };

  return (
    <div
      data-testid="bookmark-update-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Edit Bookmark</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="update-title" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Title
            </label>
            <input
              id="update-title"
              type="text"
              data-testid="bookmark-update-title-input"
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
            <label htmlFor="update-url" style={{ display: 'block', marginBottom: '0.5rem' }}>
              URL
            </label>
            <input
              id="update-url"
              type="url"
              data-testid="bookmark-update-url-input"
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
            <label htmlFor="update-tags" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Tags
            </label>
            <input
              id="update-tags"
              type="text"
              data-testid="bookmark-update-tags-input"
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ccc',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="bookmark-update-submit-button"
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
              Update Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

