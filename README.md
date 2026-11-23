# Fieldnotes Library

A responsive React catalog for browsing, filtering, and searching a library API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example:
   ```bash
   cp .env.example .env
   ```
3. Set `VITE_API_BASE_URL` to the running library API. The example uses `/api`; Vite forwards `/api` requests to `http://localhost:3000`.
4. Start the app:
   ```bash
   npm run dev
   ```

The catalog uses API filtering. `GET /books` receives `search`, `genre`, and `page` parameters; `GET /genres` supplies filter options; and `GET /books/:id` supplies detail data. Server filtering keeps combined genre and search queries consistent.

## Screen recording

- [Watch the catalog demo](./demo.webm)

The recording demonstrates browsing, selecting a genre, searching, and opening a book detail page.
