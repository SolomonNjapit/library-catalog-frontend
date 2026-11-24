import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

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
        const query = params.size ? `?${params}` : "";
        const payload = await api.get(`/books${query}`, { signal: controller.signal });
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
