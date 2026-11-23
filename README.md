# Fieldnotes Library

A responsive React catalog for browsing, searching, and saving books, with account authentication and a protected space-booking form.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example:
   ```bash
   cp .env.example .env
   ```
3. Set `VITE_API_BASE_URL` to the API's base path. The example uses `/api`; Vite forwards catalog requests to `http://localhost:3000` after removing `/api`, while auth/profile requests retain `/api`.
4. Start the app:
   ```bash
   npm run dev
   ```

The catalog uses API filtering. `GET /books` receives `search`, `genre`, and `page` parameters; `GET /genres` supplies filter options; and `GET /books/:id` supplies detail data. Server filtering keeps combined genre and search queries consistent.

## Reading list persistence

The reading list is stored in this browser's `localStorage` under `fieldnotes-reading-list`. This keeps saved books available after refresh without requiring account authentication or adding writes to the catalog API. Authentication credentials use a session token in `sessionStorage` when the API returns one; cookie-based API sessions are also sent with `credentials: include`.

## Authentication API

The app expects `POST /api/auth/login`, `POST /api/auth/register`, and `GET /api/users/profile`. The dev proxy forwards these paths to the API. Login and registration accept JSON `{ email, password }` and `{ name, email, password }`, respectively. The API should return a user and/or an access token, or set a session cookie; errors are shown in the forms.

The space booking form currently holds its fields in React state only. It validates that the end time follows the start time and does not send a booking request.

The Assignment 5 browser recording uses a local fixture API to demonstrate both successful and failed auth responses. The catalog API repository used for Assignment 4 does not currently implement the auth/profile routes, so update the Vite proxy target or set `VITE_API_BASE_URL` to an API that provides the routes above to verify real account authentication.

## Assignment 4 screen recording

- [Watch the catalog demo](./demo.webm)

The recording demonstrates browsing, selecting a genre, searching, and opening a book detail page.

## Assignment 5 screen recording

- [Watch the reading list, authentication, and booking demo](./demo-assignment5.webm)

The recording demonstrates saving a book, refreshing the reading list, removing the book, being redirected from the protected booking route while signed out, seeing a login failure, signing in, and filling out the booking form.
