/* ============================================================
   HOT SHOT ENTERTAINMENT — calendar.js
   Shared calendar logic — paginated carousel view
   ============================================================ */

const CAL = (() => {

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  function fmt(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  // Returns dates object — backward compatible with public calendar in main.js
  function loadDates() {
    const dates = {};
    if (typeof SITE_CONFIG !== 'undefined') {
      (SITE_CONFIG.bookedDates      || []).forEach(d => dates[d] = 'booked');
      (SITE_CONFIG.holdDates        || []).forEach(d => dates[d] = 'hold');
      (SITE_CONFIG.unavailableDates || []).forEach(d => dates[d] = 'unavailable');
    }
    return dates;
  }

  // Returns bookedLabels object (admin only)
  function loadLabels() {
    if (typeof SITE_CONFIG !== 'undefined') {
      return { ...(SITE_CONFIG.bookedLabels || {}) };
    }
    return {};
  }

  function buildMonth(year, month, dates, labels, interactive, onDateClick) {
    const today = new Date(); today.setHours(0,0,0,0);

    const wrap = document.createElement('div');
    wrap.className = 'cal-month';

    const heading = document.createElement('div');
    heading.className = 'cal-month-heading';
    heading.textContent = `${MONTHS[month]} ${year}`;
    wrap.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'cal-grid';

    DAYS.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-header';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-cell cal-empty';
      grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month+1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr  = fmt(year, month, d);
      const status   = dates[dateStr] || 'available';
      const cellDate = new Date(year, month, d);
      const isPast   = cellDate < today;

      const cell = document.createElement('div');
      cell.className = `cal-cell cal-${status}${isPast ? ' cal-past' : ''}`;
      cell.dataset.date = dateStr;

      // Date number
      const numSpan = document.createElement('span');
      numSpan.className = 'cal-date-num';
      numSpan.textContent = d;
      cell.appendChild(numSpan);

      // Client label — admin interactive view only, booked dates with a name
      if (interactive && status === 'booked' && labels && labels[dateStr]) {
        const lbl = document.createElement('span');
        lbl.className = 'cal-client-label';
        lbl.textContent = labels[dateStr];
        cell.appendChild(lbl);
      }

      if (interactive && !isPast) {
        cell.addEventListener('click', () => onDateClick(dateStr, cell));
      } else if (!interactive && status === 'available' && !isPast) {
        cell.classList.add('cal-clickable');
        cell.addEventListener('click', () => {
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

  // Backward-compatible signature:
  //   Old (public):  buildCalendar(id, dates, interactive, onDateClick)
  //   New (admin):   buildCalendar(id, dates, labels, interactive, onDateClick)
  function buildCalendar(containerId, dates, labelsOrInteractive, interactiveOrCallback, onDateClickOrUndefined) {
    let labels, interactive, onDateClick;
    if (typeof labelsOrInteractive === 'boolean') {
      // old call from main.js / public calendar
      labels      = {};
      interactive = labelsOrInteractive;
      onDateClick = interactiveOrCallback;
    } else {
      labels      = labelsOrInteractive || {};
      interactive = interactiveOrCallback;
      onDateClick = onDateClickOrUndefined;
    }

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const today      = new Date();
    const startYear  = today.getFullYear();
    const startMonth = today.getMonth();

    const allMonths = [];
    for (let i = 0; i < 37; i++) {
      const d = new Date(startYear, startMonth + i, 1);
      allMonths.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    function getVisible() {
      return window.innerWidth >= 1024 ? 5
           : window.innerWidth >= 640  ? 3
           : 1;
    }

    let currentIndex = 0;

    const carousel = document.createElement('div');
    carousel.className = 'cal-carousel';

    const nav = document.createElement('div');
    nav.className = 'cal-nav';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'cal-nav-btn cal-nav-prev';
    prevBtn.innerHTML = '&#8592;';
    prevBtn.setAttribute('aria-label', 'Previous months');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'cal-nav-btn cal-nav-next';
    nextBtn.innerHTML = '&#8594;';
    nextBtn.setAttribute('aria-label', 'Next months');

    const navLabel = document.createElement('div');
    navLabel.className = 'cal-nav-label';

    nav.appendChild(prevBtn);
    nav.appendChild(navLabel);
    nav.appendChild(nextBtn);
    carousel.appendChild(nav);

    const track = document.createElement('div');
    track.className = 'cal-track';
    carousel.appendChild(track);

    container.appendChild(carousel);

    function render() {
      const visible = getVisible();
      track.innerHTML = '';
      currentIndex = Math.max(0, Math.min(currentIndex, allMonths.length - visible));

      const first = allMonths[currentIndex];
      const last  = allMonths[Math.min(currentIndex + visible - 1, allMonths.length - 1)];
      if (first.year === last.year) {
        navLabel.textContent = `${MONTHS[first.month]} – ${MONTHS[last.month]} ${first.year}`;
      } else {
        navLabel.textContent = `${MONTHS[first.month]} ${first.year} – ${MONTHS[last.month]} ${last.year}`;
      }

      for (let i = currentIndex; i < currentIndex + visible && i < allMonths.length; i++) {
        const { year, month } = allMonths[i];
        const monthEl = buildMonth(year, month, dates, labels, interactive, onDateClick);
        monthEl.style.flex = `0 0 calc(${100/visible}% - ${(visible-1)*12/visible}px)`;
        track.appendChild(monthEl);
      }

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= allMonths.length - visible;
      prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - getVisible());
      render();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = Math.min(allMonths.length - getVisible(), currentIndex + getVisible());
      render();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    });

    render();
  }

  // Export all non-available dates as .ics calendar file
  function exportICS(dates, labels) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hot Shot Entertainment//Availability Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Hot Shot Entertainment - Schedule',
      'X-WR-TIMEZONE:America/Winnipeg',
    ];

    Object.keys(dates).sort().forEach(dateStr => {
      const status = dates[dateStr];
      if (status === 'available') return;

      const [y, m, d] = dateStr.split('-').map(Number);
      const dtstart   = `${y}${String(m).padStart(2,'0')}${String(d).padStart(2,'0')}`;
      const nextDate  = new Date(y, m - 1, d + 1);
      const dtend     = `${nextDate.getFullYear()}${String(nextDate.getMonth()+1).padStart(2,'0')}${String(nextDate.getDate()).padStart(2,'0')}`;

      const summary = status === 'booked'
        ? ((labels && labels[dateStr]) ? `BOOKED — ${labels[dateStr]}` : 'BOOKED')
        : status === 'hold' ? 'ON HOLD'
        : 'UNAVAILABLE';

      lines.push('BEGIN:VEVENT');
      lines.push(`DTSTART;VALUE=DATE:${dtstart}`);
      lines.push(`DTEND;VALUE=DATE:${dtend}`);
      lines.push(`SUMMARY:${summary}`);
      lines.push(`UID:${dateStr}-hotshot@hotshotent.com`);
      lines.push('STATUS:TENTATIVE');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'hotshot-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  return { buildCalendar, loadDates, loadLabels, fmt, exportICS };

})();
