export default function SearchBar({ value, onChange }) {
  return (
    <section className="search-section" aria-label="Search the catalog">
      <label htmlFor="catalog-search">Search</label>
      <div className="search-wrap">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          id="catalog-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Title or author"
          autoComplete="off"
        />
      </div>
    </section>
  );
}
