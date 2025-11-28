import { Page, Locator } from '@playwright/test';

export class BookmarkCreatePage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly urlInput: Locator;
  readonly tagsInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId('bookmark-title-input');
    this.urlInput = page.getByTestId('bookmark-url-input');
    this.tagsInput = page.getByTestId('bookmark-tags-input');
    this.submitButton = page.getByTestId('bookmark-submit-button');
    this.successMessage = page.getByTestId('bookmark-success-message');
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

  async createBookmark(bookmark: {
    title: string;
    url: string;
    tags: string;
  }) {
    await this.fillTitle(bookmark.title);
    await this.fillUrl(bookmark.url);
    await this.fillTags(bookmark.tags);
    await this.submit();
  }
}

