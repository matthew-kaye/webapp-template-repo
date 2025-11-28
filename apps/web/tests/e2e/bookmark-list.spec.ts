import { test, expect } from '@playwright/test';
import { BookmarksPage } from './page-objects/bookmarks.page';

test.describe('List Bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    await page.request.delete(`${apiUrl}/bookmarks`);
  });

  test('should display list of bookmarks', async ({ page }) => {
    const bookmarkPage = new BookmarksPage(page);

    await bookmarkPage.goto();

    await bookmarkPage.createBookmark({
      title: 'Example Bookmark',
      tags: 'web,development'
    });

    await expect(bookmarkPage.successMessage).toBeVisible();

    await bookmarkPage.waitForBookmarkToAppear('Example Bookmark');
    await expect(bookmarkPage.bookmarkList).toBeVisible();
    
    const titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).toContain('Example Bookmark');
  });

  test('should filter bookmarks by tag', async ({ page }) => {
    const bookmarkPage = new BookmarksPage(page);

    await bookmarkPage.goto();

    await bookmarkPage.createBookmark({
      title: 'Web Development',
      url: 'https://web.dev',
      tags: 'web,development'
    });

    await expect(bookmarkPage.successMessage).toBeVisible();

    await bookmarkPage.createBookmark({
      title: 'Design Resources',
      url: 'https://design.com',
      tags: 'design,resources'
    });

    await expect(bookmarkPage.successMessage).toBeVisible();

    await bookmarkPage.waitForBookmarkToAppear('Web Development');
    await bookmarkPage.waitForBookmarkToAppear('Design Resources');

    await bookmarkPage.filterByTag('web');
    await page.waitForTimeout(1000);
    await bookmarkPage.waitForBookmarkToAppear('Web Development');

    const titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).toContain('Web Development');
    expect(titles).not.toContain('Design Resources');
  });

  test('should search bookmarks by title and URL', async ({ page }) => {
    const bookmarkPage = new BookmarksPage(page);

    await bookmarkPage.goto();

    await bookmarkPage.createBookmark({
      title: 'React Documentation',
      url: 'https://react.dev',
      tags: 'web,react'
    });

    await expect(bookmarkPage.successMessage).toBeVisible();

    await bookmarkPage.createBookmark({
      title: 'Vue Guide',
      url: 'https://vuejs.org',
      tags: 'web,vue'
    });

    await expect(bookmarkPage.successMessage).toBeVisible();

    await bookmarkPage.waitForBookmarkToAppear('React Documentation');
    await bookmarkPage.waitForBookmarkToAppear('Vue Guide');

    await bookmarkPage.search('React');
    await page.waitForTimeout(1000);
    await bookmarkPage.waitForBookmarkToAppear('React Documentation');

    let titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).toContain('React Documentation');
    expect(titles).not.toContain('Vue Guide');

    await bookmarkPage.search('vuejs');
    await page.waitForTimeout(1000);
    await bookmarkPage.waitForBookmarkToAppear('Vue Guide');

    titles = await bookmarkPage.getBookmarkTitles();
    expect(titles).toContain('Vue Guide');
    expect(titles).not.toContain('React Documentation');
  });
});

