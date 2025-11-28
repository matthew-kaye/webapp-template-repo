import { test, expect } from '@playwright/test';
import { BookmarkCreatePage } from './page-objects/bookmark-create.page';
import { BookmarkListPage } from './page-objects/bookmark-list.page';

test.describe('List Bookmarks', () => {
  test('should display list of bookmarks', async ({ page }) => {
    const createPage = new BookmarkCreatePage(page);
    const listPage = new BookmarkListPage(page);

    await listPage.goto();

    // Create a bookmark first
    await createPage.createBookmark({
      title: 'Example Bookmark',
      url: 'https://example.com',
      tags: 'web,development'
    });

    await expect(createPage.successMessage).toBeVisible();

    // Wait for bookmark to appear in list
    await listPage.waitForBookmarkToAppear('Example Bookmark');
    await expect(listPage.bookmarkList).toBeVisible();
    
    const titles = await listPage.getBookmarkTitles();
    expect(titles).toContain('Example Bookmark');
  });

  test('should filter bookmarks by tag', async ({ page }) => {
    const createPage = new BookmarkCreatePage(page);
    const listPage = new BookmarkListPage(page);

    await listPage.goto();

    // Create bookmarks with different tags
    await createPage.createBookmark({
      title: 'Web Development',
      url: 'https://web.dev',
      tags: 'web,development'
    });

    await createPage.createBookmark({
      title: 'Design Resources',
      url: 'https://design.com',
      tags: 'design,resources'
    });

    // Wait for both bookmarks to appear
    await listPage.waitForBookmarkToAppear('Web Development');
    await listPage.waitForBookmarkToAppear('Design Resources');

    // Filter by tag
    await listPage.filterByTag('web');

    // Wait for filtered results
    await page.waitForTimeout(500);

    // Should only show web bookmarks
    const titles = await listPage.getBookmarkTitles();
    expect(titles).toContain('Web Development');
    expect(titles).not.toContain('Design Resources');
  });

  test('should search bookmarks by title and URL', async ({ page }) => {
    const createPage = new BookmarkCreatePage(page);
    const listPage = new BookmarkListPage(page);

    await listPage.goto();

    // Create bookmarks
    await createPage.createBookmark({
      title: 'React Documentation',
      url: 'https://react.dev',
      tags: 'web,react'
    });

    await createPage.createBookmark({
      title: 'Vue Guide',
      url: 'https://vuejs.org',
      tags: 'web,vue'
    });

    // Wait for both bookmarks to appear
    await listPage.waitForBookmarkToAppear('React Documentation');
    await listPage.waitForBookmarkToAppear('Vue Guide');

    // Search by title
    await listPage.search('React');
    await page.waitForTimeout(500);

    let titles = await listPage.getBookmarkTitles();
    expect(titles).toContain('React Documentation');
    expect(titles).not.toContain('Vue Guide');

    // Search by URL
    await listPage.search('vuejs');
    await page.waitForTimeout(500);

    titles = await listPage.getBookmarkTitles();
    expect(titles).toContain('Vue Guide');
    expect(titles).not.toContain('React Documentation');
  });
});

