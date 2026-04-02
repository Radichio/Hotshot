/* ============================================================
   HOT SHOT ENTERTAINMENT — tools.js
   Date Availability Checker + Playlist Builder
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // DATE AVAILABILITY CHECKER
  // ============================================================
  const dateInput  = document.getElementById('date-check-input');
  const dateBtn    = document.getElementById('date-check-btn');
  const dateResult = document.getElementById('date-result');

  if (dateInput && dateBtn) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    dateBtn.addEventListener('click', checkDate);
    dateInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkDate(); });
  }

  function checkDate() {
    const val = dateInput.value;
    if (!val) return;

    const selected   = new Date(val + 'T00:00:00');
    const now        = new Date(); now.setHours(0,0,0,0);
    const booked     = SITE_CONFIG.bookedDates || [];
    const holds      = SITE_CONFIG.holdDates   || [];

    dateResult.className = 'date-result show';
    dateResult.innerHTML = '';

    const resultCta = document.getElementById('date-result-cta');
    if (resultCta) resultCta.style.display = 'none';

    if (selected < now) {
      dateResult.classList.add('past');
      dateResult.innerHTML = `<span>⏎ Please select a future date.</span>`;
      return;
    }

    const formatted = selected.toLocaleDateString('en-CA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    if (booked.includes(val)) {
      dateResult.classList.add('booked');
      dateResult.innerHTML = `
        <span>✗ <strong>${formatted}</strong> is currently booked. Reach out — I may be able to help connect you with a trusted colleague.</span>
      `;
      if (resultCta) {
        resultCta.style.display = 'block';
        resultCta.innerHTML = `<a href="#contact" class="btn btn-ghost" style="padding:10px 20px;font-size:0.8rem;">Get in Touch Anyway</a>`;
      }
    } else if (holds.includes(val)) {
      dateResult.classList.add('hold');
      dateResult.innerHTML = `
        <span>⏸ <strong>${formatted}</strong> has a tentative hold — inquire quickly to get on the list!</span>
      `;
      if (resultCta) {
        resultCta.style.display = 'block';
        resultCta.innerHTML = `<a href="#contact" class="btn btn-primary" style="padding:10px 20px;font-size:0.8rem;" onclick="prefillDate('${val}')">Inquire Now →</a>`;
      }
    } else {
      dateResult.classList.add('available');
      dateResult.innerHTML = `
        <span>✓ Great news — <strong>${formatted}</strong> is currently available!</span>
      `;
      if (resultCta) {
        resultCta.style.display = 'block';
        resultCta.innerHTML = `<a href="#contact" class="btn btn-primary" style="padding:10px 20px;font-size:0.8rem;" onclick="prefillDate('${val}')">Lock In Your Date →</a>`;
      }
    }
  }

  // Pre-fill the contact form date field
  window.prefillDate = function(dateVal) {
    setTimeout(() => {
      const dateField = document.querySelector('input[name="event-date"]');
      if (dateField) dateField.value = dateVal;
    }, 400);
  };

  // ============================================================
  // PLAYLIST BUILDER
  // ============================================================

  // Tab switching
  document.querySelectorAll('.playlist-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.playlist-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.playlist-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel)?.classList.add('active');
    });
  });

  // ── TAB 1: Must-Play Songs ──
  const songs = [];
  const songInput    = document.getElementById('song-input');
  const songCat      = document.getElementById('song-category');
  const songAddBtn   = document.getElementById('song-add-btn');
  const songList     = document.getElementById('song-list');

  function addSong() {
    const title = songInput?.value.trim();
    if (!title) return;
    const cat = songCat?.value || 'Party Starters';
    const song = { title, cat };
    songs.push(song);
    renderSongList();
    songInput.value = '';
    songInput.focus();
  }

  function renderSongList() {
    if (!songList) return;
    songList.innerHTML = '';
    if (songs.length === 0) {
      songList.innerHTML = `<p style="color:var(--color-text-muted);font-size:0.85rem;padding:8px 0;">No songs added yet.</p>`;
      return;
    }
    songs.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'song-item';
      div.innerHTML = `
        <span>${s.title}</span>
        <span class="song-cat">${s.cat}</span>
        <button class="song-remove" data-index="${i}" title="Remove">×</button>
      `;
      div.querySelector('.song-remove').addEventListener('click', () => {
        songs.splice(i, 1);
        renderSongList();
      });
      songList.appendChild(div);
    });
  }

  songAddBtn?.addEventListener('click', addSong);
  songInput?.addEventListener('keydown', e => { if (e.key === 'Enter') addSong(); });
  renderSongList();

  // ── TAB 2: Vibes ──
  const selectedVibes = new Set();
  document.querySelectorAll('.vibe-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const vibe = chip.dataset.vibe;
      if (selectedVibes.has(vibe)) selectedVibes.delete(vibe);
      else selectedVibes.add(vibe);
    });
  });

  // ── TAB 3: Timeline ──
  // Inputs are rendered in HTML — just read values on submit

  // ── SEND PLAYLIST ──
  const sendBtn = document.getElementById('playlist-send-btn');
  sendBtn?.addEventListener('click', () => {
    const timelineFields = document.querySelectorAll('.timeline-row input');
    const timeline = {};
    timelineFields.forEach(f => { timeline[f.name] = f.value; });

    const playlistData = {
      songs,
      vibes: [...selectedVibes],
      timeline
    };

    const hiddenField = document.querySelector('input[name="playlist-data"]');
    if (hiddenField) hiddenField.value = JSON.stringify(playlistData, null, 2);

    // Scroll to contact form
    const contact = document.getElementById('contact');
    if (contact) {
      const top = contact.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    // Pre-fill event type as Wedding
    setTimeout(() => {
      const typeSelect = document.querySelector('select[name="event-type"]');
      if (typeSelect) typeSelect.value = 'Wedding';
      const msgArea = document.querySelector('textarea[name="message"]');
      if (msgArea && !msgArea.value) {
        msgArea.value = "I've put together my playlist preferences using your Playlist Builder — details attached!";
      }
    }, 600);
  });

  // ── CONTACT FORM SUBMISSION ──
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', e => {
    // Netlify handles submission natively
    // We intercept to show success state without page reload
    e.preventDefault();
    const formData = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      form.style.display = 'none';
      document.getElementById('form-success').classList.add('show');
    })
    .catch(() => {
      // Fallback: just submit normally
      form.submit();
    });
  });

});
