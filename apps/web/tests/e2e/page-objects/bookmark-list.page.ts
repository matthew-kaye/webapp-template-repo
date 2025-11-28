import { Page, Locator } from '@playwright/test';

export class BookmarkListPage {
  readonly page: Page;
  readonly bookmarkList: Locator;
  readonly tagFilterInput: Locator;
  readonly searchInput: Locator;
  readonly bookmarkItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookmarkList = page.getByTestId('bookmark-list');
    this.tagFilterInput = page.getByTestId('bookmark-tag-filter');
    this.searchInput = page.getByTestId('bookmark-search-input');
    this.bookmarkItems = page.getByTestId('bookmark-item');
  }

  async goto() {
    await this.page.goto('/bookmarks');
  }

  async filterByTag(tag: string) {
    await this.tagFilterInput.fill(tag);
    await this.tagFilterInput.press('Enter');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getBookmarkTitles(): Promise<string[]> {
    const items = await this.page.locator('[data-testid^="bookmark-item-"]').all();
    const titles: string[] = [];
    for (const item of items) {
      const title = await item.locator('[data-testid^="bookmark-title-"]').textContent();
      if (title) titles.push(title);
    }
    return titles;
  }

  async waitForBookmarkToAppear(title: string, timeout = 5000): Promise<void> {
    await this.page.waitForFunction(
      (titleText) => {
        const items = Array.from(document.querySelectorAll('[data-testid^="bookmark-item-"]'));
        return items.some(item => {
          const titleElement = item.querySelector('[data-testid^="bookmark-title-"]');
          return titleElement?.textContent?.includes(titleText);
        });
      },
      title,
      { timeout }
    );
  }
}

