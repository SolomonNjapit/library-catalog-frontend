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
3. Set `VITE_API_BASE_URL` to the API's base path. The example uses `/api`; Vite forwards catalog requests to `http://localhost:3000` after removing `/api`, while auth, borrow-request, booking, and profile requests retain `/api`.
4. Start the app:
   ```bash
   npm run dev
   ```

The catalog uses API filtering. `GET /books` receives `search`, `genre`, and `page` parameters; `GET /genres` supplies filter options; and `GET /books/:id` supplies detail data. Server filtering keeps combined genre and search queries consistent.

## Reading list persistence

The reading list is stored in this browser's `localStorage` under `fieldnotes-reading-list`. This keeps saved books available after refresh without requiring account authentication or adding writes to the catalog API. Authentication credentials use a session token in `sessionStorage` when the API returns one; cookie-based API sessions are also sent with `credentials: include`.

## Authentication API

The app expects `POST /api/auth/login`, `POST /api/auth/register`, and `GET /api/users/profile`. The dev proxy forwards these paths to the API. Login and registration accept JSON `{ email, password }` and `{ username, email, password }`, respectively. The API returns the user and sets an httpOnly session cookie; errors are shown in the forms. All API requests use a shared helper that includes browser credentials and surfaces server error messages.

The reading list remains in localStorage. Borrow requests are sent from saved books to `POST /api/borrow-requests`; booking form submissions go to `POST /api/bookings` and show server conflict messages. Librarians can manage books, borrow requests, and bookings on the role-protected `/admin/books`, `/admin/borrow-requests`, and `/admin/bookings` pages.

The backend calculates late-return fines as $0.25 per started 24-hour period and rejects time overlaps for the same space/date; touching booking endpoints are allowed.

## Assignment 4 screen recording

- [Watch the catalog demo](./demo.webm)

The recording demonstrates browsing, selecting a genre, searching, and opening a book detail page.

## Assignment 5 screen recording

- [Watch the reading list, authentication, and booking demo](./demo-assignment5.webm)

The recording demonstrates saving a book, refreshing the reading list, removing the book, being redirected from the protected booking route while signed out, seeing a login failure, signing in, and filling out the booking form.

## Borrow lifecycle and booking conflict recording

- [Watch the borrow, late-return fine, and booking-conflict demo](./demo-borrow-booking-admin.webm)

The recording uses the API flow to create a request from the reading list, return it late as a librarian, display the server-calculated fine, and demonstrate a conflicting booking being rejected.
