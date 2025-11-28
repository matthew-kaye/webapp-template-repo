const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string;
  created_at: string;
}

export interface CreateBookmarkRequest {
  title: string;
  url: string;
  tags: string;
}

export class BookmarksApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async createBookmark(bookmark: CreateBookmarkRequest): Promise<Bookmark> {
    const response = await fetch(`${this.baseUrl}/bookmarks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    });

    if (!response.ok) {
      throw new Error('Failed to create bookmark');
    }

    return response.json();
  }

  async updateBookmark(id: string, bookmark: CreateBookmarkRequest): Promise<Bookmark> {
    const response = await fetch(`${this.baseUrl}/bookmarks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    });

    if (!response.ok) {
      throw new Error('Failed to update bookmark');
    }

    return response.json();
  }

  async listBookmarks(tag?: string, query?: string): Promise<Bookmark[]> {
    const params = new URLSearchParams();
    if (tag) params.append('tag', tag);
    if (query) params.append('q', query);

    const response = await fetch(`${this.baseUrl}/bookmarks?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch bookmarks');
    }

    return response.json();
  }

  async deleteBookmark(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/bookmarks/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete bookmark');
    }
  }

  async deleteAllBookmarks(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/bookmarks`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete all bookmarks');
    }
  }
}

export const bookmarksApi = new BookmarksApi();

