import { test, expect } from '@playwright/test';
import { BookmarkCreatePage } from './page-objects/bookmark-create.page';

test.describe('Create Bookmark', () => {
  test('should create a bookmark and show success message', async ({ page }) => {
    const bookmarkPage = new BookmarkCreatePage(page);
    
    await bookmarkPage.goto();

    const bookmark = {
      title: 'Example Bookmark',
      url: 'https://example.com',
      tags: 'web,development'
    };

    await bookmarkPage.createBookmark(bookmark);

    await expect(bookmarkPage.successMessage).toBeVisible();
    await expect(bookmarkPage.successMessage).toContainText('Bookmark created successfully');
  });
});

