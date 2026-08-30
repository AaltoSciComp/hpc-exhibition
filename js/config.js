// ---------------------------------------------------------------------------
// NEXT DISPLAY EVENT — update this whenever a new date is confirmed.
// This is the only file that needs editing to announce the next exhibition.
// ---------------------------------------------------------------------------
window.NEXT_EVENT = {
  title: "Aalto Day One 2026",
  dateLabel: "September 1, 2026, 15:30–19:30",
  location: "Alvar Aalto Park, Aalto University",
  url: "https://www.aalto.fi/en/events/aalto-day-one-2026-aalto-university-opening-of-the-academic-year",
};
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  var e = window.NEXT_EVENT;
  if (!e) return;

  var titleEl = document.getElementById('event-title');
  var dateEl = document.getElementById('event-date');
  var locEl = document.getElementById('event-location');
  var linkEl = document.getElementById('event-link');

  if (titleEl) titleEl.textContent = e.title;
  if (dateEl) dateEl.textContent = e.dateLabel;
  if (locEl) locEl.textContent = e.location;
  if (linkEl) linkEl.href = e.url;
});
