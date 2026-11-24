import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadGenres() {
      setLoading(true);
      setError("");
      try {
        const payload = await api.get("/genres", { signal: controller.signal });
        const items = Array.isArray(payload)
          ? payload
          : payload.genres ?? payload.data ?? payload.items ?? [];
        setGenres(items);
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError("Genres could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadGenres();
    return () => controller.abort();
  }, []);

  const options = genres.map((genre) =>
    typeof genre === "string"
      ? { value: genre, label: genre }
      : { value: genre._id ?? genre.id ?? genre.slug ?? "", label: genre.name ?? genre.label },
  ).filter((genre) => genre.value && genre.label);

  const uniqueOptions = [...new Map(options.map((genre) => [genre.value, genre])).values()];

  return (
    <section className="genre-filter" aria-label="Filter by genre">
      <label htmlFor="genre">Genre</label>
      <div className="genre-select-wrap">
        <select
          id="genre"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={loading}
        >
          <option value="">All genres</option>
          {uniqueOptions.map((genre) => (
            <option key={genre.value} value={genre.value}>{genre.label}</option>
          ))}
        </select>
      </div>
      {error && <span className="filter-error" role="alert">{error}</span>}
      {!loading && !error && uniqueOptions.length === 0 && (
        <span className="filter-error" role="status">No genres are available.</span>
      )}
    </section>
  );
}
