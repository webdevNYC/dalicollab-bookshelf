// API client for Cloudflare Workers
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-worker.your-subdomain.workers.dev';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchBooks(query: string) {
    return this.request(`/api/bookshelf/search?q=${encodeURIComponent(query)}`);
  }

  async generateCover(title: string, author: string) {
    return this.request('/api/bookshelf/generate-cover', {
      method: 'POST',
      body: JSON.stringify({ title, author }),
    });
  }

  async saveShelf(books: any[], spines: any[]) {
    return this.request('/api/bookshelf/save', {
      method: 'POST',
      body: JSON.stringify({ books, spines }),
    });
  }

  getDownloadUrl(id: string): string {
    return `${this.baseUrl}/api/bookshelf/download/${id}`;
  }
}

export const apiClient = new ApiClient();