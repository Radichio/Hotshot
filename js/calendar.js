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

  function loadDates() {
    const dates = {};
    if (typeof SITE_CONFIG !== 'undefined') {
      (SITE_CONFIG.bookedDates || []).forEach(d => dates[d] = 'booked');
      (SITE_CONFIG.holdDates   || []).forEach(d => dates[d] = 'hold');
    }
    return dates;
  }

  function buildMonth(year, month, dates, interactive, onDateClick) {
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
      cell.textContent = d;
      cell.dataset.date = dateStr;

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

  // Build paginated carousel calendar
  function buildCalendar(containerId, dates, interactive, onDateClick) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const today = new Date();
    const startYear  = today.getFullYear();
    const startMonth = today.getMonth();

    // Build full list of months (current month → +36 months)
    const allMonths = [];
    for (let i = 0; i < 37; i++) {
      const d = new Date(startYear, startMonth + i, 1);
      allMonths.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    // Determine visible count based on screen width
    function getVisible() {
      return window.innerWidth >= 1024 ? 5
           : window.innerWidth >= 640  ? 3
           : 1;
    }

    let currentIndex = 0;

    // Carousel wrapper
    const carousel = document.createElement('div');
    carousel.className = 'cal-carousel';

    // Nav row
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

    // Month track
    const track = document.createElement('div');
    track.className = 'cal-track';
    carousel.appendChild(track);

    container.appendChild(carousel);

    function render() {
      const visible = getVisible();
      track.innerHTML = '';

      // Clamp index
      currentIndex = Math.max(0, Math.min(currentIndex, allMonths.length - visible));

      // Update nav label
      const first = allMonths[currentIndex];
      const last  = allMonths[Math.min(currentIndex + visible - 1, allMonths.length - 1)];
      if (first.year === last.year) {
        navLabel.textContent = `${MONTHS[first.month]} – ${MONTHS[last.month]} ${first.year}`;
      } else {
        navLabel.textContent = `${MONTHS[first.month]} ${first.year} – ${MONTHS[last.month]} ${last.year}`;
      }

      // Show months
      for (let i = currentIndex; i < currentIndex + visible && i < allMonths.length; i++) {
        const { year, month } = allMonths[i];
        const monthEl = buildMonth(year, month, dates, interactive, onDateClick);
        monthEl.style.flex = `0 0 calc(${100/visible}% - ${(visible-1)*12/visible}px)`;
        track.appendChild(monthEl);
      }

      // Button states
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

    // Re-render on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    });

    render();
  }

  return { buildCalendar, loadDates, fmt };

})();
