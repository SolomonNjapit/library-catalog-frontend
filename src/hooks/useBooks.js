import { useEffect, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export default function useBooks({ search, genre, page = 1 }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (page) params.set("page", String(page));

      try {
        const response = await fetch(`${API_BASE_URL}/books${params.size ? `?${params}` : ""}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
        const payload = await response.json();
        const items = Array.isArray(payload)
          ? payload
          : payload.books ?? payload.data ?? payload.items ?? payload.results ?? [];
        setBooks(items);
        setPagination(
          payload.pagination ??
            (payload.totalCount !== undefined || payload.totalPages !== undefined
              ? {
                  total: payload.totalCount,
                  limit: payload.limit,
                  page: payload.page ?? page,
                  totalPages: payload.totalPages,
                }
              : null),
        );
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "The catalog could not be loaded.");
          setBooks([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchBooks();
    return () => controller.abort();
  }, [search, genre, page]);

  return { books, loading, error, pagination };
}
