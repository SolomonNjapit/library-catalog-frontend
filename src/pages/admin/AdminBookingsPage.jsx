import useApiResource from "../../hooks/useApiResource.js";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function AdminBookingsPage() {
  const { data: bookings, loading, error } = useApiResource("/bookings");

  return (
    <section className="admin-page">
      <header className="admin-heading"><div><span className="eyebrow">Librarian tools</span><h1>Space bookings</h1></div></header>
      {loading ? (
        <section className="state-panel" role="status"><span className="loading-mark" aria-hidden="true" /><h2>Loading bookings...</h2></section>
      ) : error ? (
        <section className="state-panel error-panel" role="alert"><h2>Bookings could not be loaded.</h2><p>{error}</p></section>
      ) : bookings.length === 0 ? (
        <section className="state-panel"><h2>No bookings yet.</h2><p>Patron space bookings will appear here.</p></section>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Space</th><th>Date</th><th>Time</th><th>Patron</th></tr></thead>
            <tbody>{bookings.map((booking) => (
              <tr key={booking._id ?? booking.id}>
                <td>{booking.space}</td><td>{formatDate(booking.date)}</td>
                <td>{booking.startTime}–{booking.endTime}</td>
                <td>{booking.user?.username ?? booking.user?.email ?? "Patron unavailable"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
