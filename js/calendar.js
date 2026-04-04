/* ============================================================
   HOT SHOT ENTERTAINMENT — calendar.js
   Shared calendar logic for admin manager + public view
   ============================================================ */

const CAL = (() => {

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Status values
  const STATUS = { AVAILABLE: 'available', BOOKED: 'booked', HOLD: 'hold' };

  // Load dates from SITE_CONFIG if available, otherwise empty
  function loadDates() {
    const dates = {};
    if (typeof SITE_CONFIG !== 'undefined') {
      (SITE_CONFIG.bookedDates || []).forEach(d => dates[d] = STATUS.BOOKED);
      (SITE_CONFIG.holdDates   || []).forEach(d => dates[d] = STATUS.HOLD);
    }
    return dates;
  }

  // Format date as YYYY-MM-DD
  function fmt(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  // Build a single month grid
  function buildMonth(year, month, dates, interactive, onDateClick) {
    const today = new Date();
    today.setHours(0,0,0,0);

    const wrap = document.createElement('div');
    wrap.className = 'cal-month';

    const heading = document.createElement('div');
    heading.className = 'cal-month-heading';
    heading.textContent = `${MONTHS[month]} ${year}`;
    wrap.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'cal-grid';

    // Day headers
    DAYS.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-header';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    // Empty cells before first day
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-cell cal-empty';
      grid.appendChild(empty);
    }

    // Day cells
    const daysInMonth = new Date(year, month+1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = fmt(year, month, d);
      const status  = dates[dateStr] || STATUS.AVAILABLE;
      const cellDate = new Date(year, month, d);
      const isPast   = cellDate < today;

      const cell = document.createElement('div');
      cell.className = `cal-cell cal-${status}${isPast ? ' cal-past' : ''}`;
      cell.textContent = d;
      cell.dataset.date = dateStr;
      cell.dataset.status = status;

      if (interactive && !isPast) {
        cell.addEventListener('click', () => onDateClick(dateStr, cell));
      } else if (!interactive && status === STATUS.AVAILABLE && !isPast) {
        cell.classList.add('cal-clickable');
        cell.addEventListener('click', () => {
          // Scroll to contact form and pre-fill date
          const contactDate = document.getElementById('fevent-date');
          if (contactDate) contactDate.value = dateStr;
          const contact = document.getElementById('contact');
          if (contact) {
            const top = contact.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      }

      grid.appendChild(cell);
    }

    wrap.appendChild(grid);
    return wrap;
  }

  // Build full multi-year calendar
  function buildCalendar(containerId, dates, interactive, onDateClick) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const today = new Date();
    const startYear = today.getFullYear();
    const endYear   = startYear + 2;

    for (let year = startYear; year <= endYear; year++) {
      const yearDiv = document.createElement('div');
      yearDiv.className = 'cal-year';

      const yearHeading = document.createElement('div');
      yearHeading.className = 'cal-year-heading';
      yearHeading.textContent = year;
      yearDiv.appendChild(yearHeading);

      const monthsGrid = document.createElement('div');
      monthsGrid.className = 'cal-months-grid';

      const startMonth = (year === startYear) ? today.getMonth() : 0;
      for (let month = startMonth; month < 12; month++) {
        monthsGrid.appendChild(buildMonth(year, month, dates, interactive, onDateClick));
      }

      yearDiv.appendChild(monthsGrid);
      container.appendChild(yearDiv);
    }
  }

  return { buildCalendar, loadDates, STATUS, fmt };

})();
