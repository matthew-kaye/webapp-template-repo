import { test, expect } from '@playwright/test';
import { BookmarksPage } from './page-objects/bookmarks.page';

test.describe('Create Bookmark', () => {
  test.beforeEach(async ({ page }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    await page.request.delete(`${apiUrl}/bookmarks`);
  });

  test('should create a bookmark and show success message', async ({ page }) => {
    const bookmarkPage = new BookmarksPage(page);
    
    await bookmarkPage.goto();

    await bookmarkPage.createBookmark({
      title: 'Example Bookmark',
      tags: 'web,development'
    });

    await expect(bookmarkPage.successMessage).toBeVisible();
    await expect(bookmarkPage.successMessage).toContainText('Bookmark created successfully');
  });
});

