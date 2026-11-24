import { useState } from "react";
import { api } from "../../lib/api.js";
import useApiResource from "../../hooks/useApiResource.js";

const statuses = ["pending", "approved", "late", "returned"];
const getId = (value) => value?._id ?? value?.id;

function dateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default function AdminBorrowRequestsPage() {
  const { data: requests, loading, error, refresh } = useApiResource("/borrow-requests");
  const [dueDates, setDueDates] = useState({});
  const [busyId, setBusyId] = useState("");
  const [feedback, setFeedback] = useState("");

  async function updateRequest(request, body) {
    setFeedback("");
    setBusyId(String(getId(request)));
    try {
      const payload = await api.patch(`/borrow-requests/${encodeURIComponent(getId(request))}`, body);
      const updated = payload?.data;
      if (updated?.fine !== undefined && updated.status === "returned") {
        setFeedback(`Request returned. Server-calculated fine: $${Number(updated.fine).toFixed(2)}.`);
      } else {
        setFeedback("Borrow request updated.");
      }
      refresh();
    } catch (requestError) {
      setFeedback(requestError.message || "The borrow request could not be updated.");
    } finally {
      setBusyId("");
    }
  }

  function saveDueDate(request) {
    const dueAt = dueDates[getId(request)];
    if (!dueAt) {
      setFeedback("Choose a due date first.");
      return;
    }
    updateRequest(request, { dueAt: new Date(`${dueAt}T23:59:59.999Z`).toISOString() });
  }

  return (
    <section className="admin-page">
      <header className="admin-heading"><div><span className="eyebrow">Librarian tools</span><h1>Borrow requests</h1></div></header>
      {feedback && <p className="form-feedback" role="status">{feedback}</p>}
      {loading ? (
        <section className="state-panel" role="status"><span className="loading-mark" aria-hidden="true" /><h2>Loading requests...</h2></section>
      ) : error ? (
        <section className="state-panel error-panel" role="alert"><h2>Borrow requests could not be loaded.</h2><p>{error}</p></section>
      ) : requests.length === 0 ? (
        <section className="state-panel"><h2>No borrow requests yet.</h2><p>Requests from patrons will appear here.</p></section>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Book</th><th>Patron</th><th>Requested</th><th>Due date</th><th>Status</th><th>Fine</th></tr></thead>
            <tbody>{requests.map((request) => {
              const id = getId(request);
              return (
                <tr key={id}>
                  <td>{request.book?.title ?? "Book unavailable"}</td>
                  <td>{request.user?.username ?? request.user?.email ?? "Patron unavailable"}</td>
                  <td>{request.requestedAt ? new Date(request.requestedAt).toLocaleDateString() : "—"}</td>
                  <td>
                    <div className="due-date-control">
                      <input aria-label={`Due date for ${request.book?.title ?? "request"}`} type="date" value={dueDates[id] ?? dateInputValue(request.dueAt)} onChange={(event) => setDueDates((current) => ({ ...current, [id]: event.target.value }))} disabled={request.status === "returned"} />
                      {request.status !== "returned" && <button type="button" className="secondary-button" disabled={busyId === String(id)} onClick={() => saveDueDate(request)}>Save</button>}
                    </div>
                  </td>
                  <td><select aria-label={`Status for ${request.book?.title ?? "request"}`} value={request.status} disabled={busyId === String(id) || request.status === "returned"} onChange={(event) => updateRequest(request, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
                  <td>${Number(request.fine ?? 0).toFixed(2)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
