import BookingForm from "../components/BookingForm.jsx";

export default function BookingPage() {
  return (
    <section className="auth-page booking-page">
      <span className="eyebrow">Plan your visit</span>
      <h1>Save a seat.</h1>
      <p className="auth-intro">Choose a space and a time that works for you.</p>
      <BookingForm />
    </section>
  );
}
