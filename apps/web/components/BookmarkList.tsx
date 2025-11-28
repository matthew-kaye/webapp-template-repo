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
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
}

export default function BookmarkList({
  bookmarks,
  tagFilter,
  searchQuery,
  onTagFilterChange,
  onSearchChange,
  onFilterKeyDown,
  onDelete,
  onEdit
}: BookmarkListProps) {
  return (
    <section>
      <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Bookmarks</h2>

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
              {!bookmarks || bookmarks.length === 0 ? (
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
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div
                    data-testid={`bookmark-title-${bookmark.id}`}
                    style={{ fontSize: '1.1rem', fontWeight: 'bold', flex: 1 }}
                  >
                    {bookmark.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}
                  >
                    <button
                      data-testid={`bookmark-edit-${bookmark.id}`}
                      onClick={() => onEdit(bookmark)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        color: '#0066cc',
                        padding: '0.25rem 0.5rem',
                        lineHeight: '1'
                      }}
                      aria-label="Edit bookmark"
                    >
                      Edit
                    </button>
                    <button
                      data-testid={`bookmark-delete-${bookmark.id}`}
                      onClick={() => onDelete(bookmark.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#999',
                        padding: '0.25rem 0.5rem',
                        lineHeight: '1'
                      }}
                      aria-label="Delete bookmark"
                    >
                      ×
                    </button>
                  </div>
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

