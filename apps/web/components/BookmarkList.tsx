interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string;
  created_at: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  tagFilter: string;
  searchQuery: string;
  onTagFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onFilterKeyDown: () => void;
}

export default function BookmarkList({
  bookmarks,
  tagFilter,
  searchQuery,
  onTagFilterChange,
  onSearchChange,
  onFilterKeyDown
}: BookmarkListProps) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Bookmarks</h2>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label htmlFor="tag-filter" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Filter by Tag
          </label>
          <input
            id="tag-filter"
            type="text"
            data-testid="bookmark-tag-filter"
            value={tagFilter}
            onChange={(e) => onTagFilterChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onFilterKeyDown();
              }
            }}
            placeholder="Enter tag to filter"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ flex: '1', minWidth: '200px' }}>
          <label htmlFor="search" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Search
          </label>
          <input
            id="search"
            type="text"
            data-testid="bookmark-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onFilterKeyDown();
              }
            }}
            placeholder="Search by title or URL"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      <div data-testid="bookmark-list">
        {bookmarks.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No bookmarks found</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                data-testid={`bookmark-item-${bookmark.id}`}
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div
                  data-testid={`bookmark-title-${bookmark.id}`}
                  style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}
                >
                  {bookmark.title}
                </div>
                <div
                  data-testid={`bookmark-url-${bookmark.id}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'none' }}
                  >
                    {bookmark.url}
                  </a>
                </div>
                <div
                  data-testid={`bookmark-tags-${bookmark.id}`}
                  style={{ fontSize: '0.9rem', color: '#666' }}
                >
                  Tags: {bookmark.tags}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

