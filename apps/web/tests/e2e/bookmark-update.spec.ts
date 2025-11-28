import { test, expect } from '@playwright/test';
import { BookmarksPage } from './page-objects/bookmarks.page';

test.describe('Update Bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    await page.request.delete(`${apiUrl}/bookmarks`);
  });

  test('should update a bookmark when edit button is clicked and form is submitted', async ({
    page,
  }) => {
    const bookmarkPage = new BookmarksPage(page);

    await bookmarkPage.goto();

    await bookmarkPage.createBookmark({ title: 'Original Title', url: 'https://original.com' });
    await bookmarkPage.waitForBookmarkToAppear('Original Title');

    await bookmarkPage.editBookmarkWithTitle('Original Title');
    await bookmarkPage.updateBookmark({
      title: 'Updated Title',
      url: 'https://updated.com',
      tags: 'updated'
    });

    await bookmarkPage.waitForBookmarkToAppear('Updated Title');
    const titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).toContain('Updated Title');
    expect(titles).not.toContain('Original Title');
  });
});

