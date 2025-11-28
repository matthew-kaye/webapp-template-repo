import { useState, FormEvent } from 'react';

interface CreateBookmarkFormProps {
  onSubmit: (bookmark: { title: string; url: string; tags: string }) => Promise<void>;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CreateBookmarkForm({
  onSubmit,
  onSuccess,
  onError
}: CreateBookmarkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await onSubmit({ title, url, tags });
      setTitle('');
      setUrl('');
      setTags('');
      onSuccess?.();
    } catch {
      onError?.();
    }
  };

  return (
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
  );
}

