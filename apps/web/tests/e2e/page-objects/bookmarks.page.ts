import { Page, Locator, expect } from '@playwright/test';

export class BookmarksPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly urlInput: Locator;
  readonly tagsInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly bookmarkList: Locator;
  readonly tagFilterInput: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId('bookmark-title-input');
    this.urlInput = page.getByTestId('bookmark-url-input');
    this.tagsInput = page.getByTestId('bookmark-tags-input');
    this.submitButton = page.getByTestId('bookmark-submit-button');
    this.successMessage = page.getByTestId('bookmark-success-message');
    this.errorMessage = page.getByTestId('bookmark-error-message');
    this.bookmarkList = page.getByTestId('bookmark-list');
    this.tagFilterInput = page.getByTestId('bookmark-tag-filter');
    this.searchInput = page.getByTestId('bookmark-search-input');
  }

  async goto() {
    await this.page.goto('/bookmarks');
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillUrl(url: string) {
    await this.urlInput.fill(url);
  }

  async fillTags(tags: string) {
    await this.tagsInput.fill(tags);
  }

  async submit() {
    await this.submitButton.click();
  }

  async createBookmark(bookmark: { title: string; url?: string; tags?: string }) {
    await this.fillTitle(bookmark.title);
    await this.fillUrl(bookmark.url || 'https://example.com');
    await this.fillTags(bookmark.tags || 'test');
    await this.submit();
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
    await this.page
      .waitForSelector('[data-testid^="bookmark-item-"]', { timeout: 5000 })
      .catch(() => {});
    const items = await this.page.locator('[data-testid^="bookmark-item-"]').all();
    const titles: string[] = [];
    for (const item of items) {
      const title = await item.locator('[data-testid^="bookmark-title-"]').textContent();
      if (title) titles.push(title.trim());
    }
    return titles;
  }

  async waitForBookmarkToAppear(title: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(`[data-testid^="bookmark-title-"]:has-text("${title}")`, {
      timeout,
    });
  }

  async deleteBookmarkWithTitle(title: string): Promise<void> {
    const bookmarkItem = this.page.locator(
      `[data-testid^="bookmark-item-"]:has([data-testid^="bookmark-title-"]:has-text("${title}"))`,
    );
    const deleteButton = bookmarkItem.locator('[data-testid^="bookmark-delete-"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await expect(bookmarkItem).not.toBeVisible();
  }

  async editBookmarkWithTitle(title: string): Promise<void> {
    const bookmarkItem = this.page.locator(
      `[data-testid^="bookmark-item-"]:has([data-testid^="bookmark-title-"]:has-text("${title}"))`,
    );
    const editButton = bookmarkItem.locator('[data-testid^="bookmark-edit-"]');
    await expect(editButton).toBeVisible();
    await editButton.click();
    await expect(this.page.getByTestId('bookmark-update-modal')).toBeVisible();
  }

  async updateBookmark(bookmark: { title: string; url?: string; tags?: string }): Promise<void> {
    const titleInput = this.page.getByTestId('bookmark-update-title-input');
    const urlInput = this.page.getByTestId('bookmark-update-url-input');
    const tagsInput = this.page.getByTestId('bookmark-update-tags-input');
    const submitButton = this.page.getByTestId('bookmark-update-submit-button');

    await titleInput.fill(bookmark.title);
    await urlInput.fill(bookmark.url || 'https://example.com');
    await tagsInput.fill(bookmark.tags || 'test');
    await submitButton.click();
  }
}
