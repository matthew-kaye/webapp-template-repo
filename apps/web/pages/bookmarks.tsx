import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import BookmarkList from '../components/BookmarkList';
import CreateBookmarkForm from '../components/CreateBookmarkForm';
import UpdateBookmarkModal from '../components/UpdateBookmarkModal';
import { bookmarksApi, Bookmark } from '../lib/bookmarks-api';

export default function Bookmarks() {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tagFilter, setTagFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookmarks = useCallback(async () => {
    try {
      const data = await bookmarksApi.listBookmarks(
        tagFilter ? (tagFilter.trim() || undefined) : undefined,
        searchQuery ? (searchQuery.trim() || undefined) : undefined
      );
      setBookmarks(data || []);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      setBookmarks([]);
    }
  }, [tagFilter, searchQuery]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleCreateBookmark = async (bookmark: { title: string; url: string; tags: string }) => {
    setShowError(false);
    setShowSuccess(false);
    setLastAction('create');

    try {
      await bookmarksApi.createBookmark(bookmark);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await fetchBookmarks();
    } catch {
      setShowError(true);
    }
  };

  const handleUpdateBookmark = async (
    id: string,
    bookmark: { title: string; url: string; tags: string }
  ) => {
    setShowError(false);
    setShowSuccess(false);
    setLastAction('update');

    try {
      await bookmarksApi.updateBookmark(id, bookmark);
      setShowSuccess(true);
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
      await bookmarksApi.deleteBookmark(id);
      await fetchBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
  };

  const handleCloseModal = () => {
    setEditingBookmark(null);
  };

  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>
      <main className="page">
        <section className="hero" style={{ maxWidth: '700px' }}>
          <h1>Manage Bookmarks</h1>
          
          {showSuccess && (
            <div data-testid="bookmark-success-message" className="success-message">
              {lastAction === 'update' ? 'Bookmark updated successfully' : 'Bookmark created successfully'}
            </div>
          )}

          {showError && (
            <div data-testid="bookmark-error-message" className="error-message">
              {lastAction === 'update' ? 'Failed to update bookmark' : 'Failed to create bookmark'}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginTop: '3rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Create Bookmark</h2>
              <CreateBookmarkForm
                onSubmit={handleCreateBookmark}
                onSuccess={() => {}}
                onError={() => setShowError(true)}
              />
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
                onEdit={handleEdit}
              />
            </div>
          </div>
        </section>
      </main>
      <UpdateBookmarkModal
        bookmark={editingBookmark}
        isOpen={editingBookmark !== null}
        onClose={handleCloseModal}
        onSubmit={handleUpdateBookmark}
        onSuccess={() => {}}
        onError={() => setShowError(true)}
      />
    </>
  );
}

