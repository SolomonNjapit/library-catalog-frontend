import { useState } from "react";

const spaces = ["Reading Room", "Quiet Study", "Community Table"];

function getLocalDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function BookingForm() {
  const [space, setSpace] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setConfirmation("");
    setError("");
    if (startTime && endTime && endTime <= startTime) {
      setError("End time must be later than start time.");
      return;
    }
    setConfirmation(`Your ${space} request for ${date}, ${startTime}–${endTime} is ready.`);
  }

  return (
    <form className="form-card booking-form" onSubmit={handleSubmit}>
      <p className="form-note">Choose a space and time. Booking requests will be enabled soon.</p>
      {error && <p className="form-feedback form-error" role="alert">{error}</p>}
      {confirmation && <p className="form-feedback form-success" role="status">{confirmation}</p>}
      <label htmlFor="booking-space">Space</label>
      <select id="booking-space" required value={space} onChange={(event) => setSpace(event.target.value)}>
        <option value="">Choose a space</option>
        {spaces.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <label htmlFor="booking-date">Date</label>
      <input id="booking-date" type="date" required min={getLocalDate()} value={date} onChange={(event) => setDate(event.target.value)} />
      <div className="time-fields">
        <div>
          <label htmlFor="booking-start">Start time</label>
          <input id="booking-start" type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        </div>
        <div>
          <label htmlFor="booking-end">End time</label>
          <input id="booking-end" type="time" required value={endTime} onChange={(event) => setEndTime(event.target.value)} />
        </div>
      </div>
      <button className="primary-button" type="submit">Review request</button>
    </form>
  );
}
