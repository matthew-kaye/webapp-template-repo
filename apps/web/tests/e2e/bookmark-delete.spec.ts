import { test, expect } from '@playwright/test';
import { BookmarksPage } from './page-objects/bookmarks.page';

test.describe('Delete Bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    await page.request.delete(`${apiUrl}/bookmarks`);
  });

  test('should delete a bookmark when delete button is clicked', async ({ page }) => {
    const bookmarkPage = new BookmarksPage(page);

    await bookmarkPage.goto();

    await bookmarkPage.createBookmark({ title: 'Bookmark to Delete' });
    await bookmarkPage.waitForBookmarkToAppear('Bookmark to Delete');
    await bookmarkPage.createBookmark({ title: 'Bookmark to Keep' });
    await bookmarkPage.waitForBookmarkToAppear('Bookmark to Keep');

    let titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).toContain('Bookmark to Delete');
    expect(titles).toContain('Bookmark to Keep');

    await bookmarkPage.deleteFirstBookmark();
    await page.waitForTimeout(1000);
    await bookmarkPage.waitForBookmarkToAppear('Bookmark to Keep');

    titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).not.toContain('Bookmark to Delete');
    expect(titles).toContain('Bookmark to Keep');
  });
});
