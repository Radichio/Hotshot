/* ============================================================
   HOT SHOT ENTERTAINMENT — tools.js
   Date Availability Checker + Playlist Builder
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // PUBLIC AVAILABILITY CALENDAR
  // ============================================================
  if (typeof CAL !== 'undefined' && document.getElementById('public-calendar')) {
    const dates = CAL.loadDates();
    CAL.buildCalendar('public-calendar', dates, false, null);
  }

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

  // ── TIMELINE SEND ──
  const timelineSendBtn = document.getElementById('timeline-send-btn');
  timelineSendBtn?.addEventListener('click', () => {
    const rows = document.querySelectorAll('.tl-input');
    const timeline = {};
    rows.forEach(r => { if (r.value) timeline[r.name] = r.value; });

    if (Object.keys(timeline).length === 0) {
      alert('Please fill in at least one time before sending.');
      return;
    }

    const hiddenField = document.querySelector('input[name="playlist-data"]');
    const existing = hiddenField?.value ? JSON.parse(hiddenField.value) : {};
    existing.timeline_times = timeline;
    if (hiddenField) hiddenField.value = JSON.stringify(existing, null, 2);

    const contact = document.getElementById('contact');
    if (contact) {
      const top = contact.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => {
      const msgArea = document.querySelector('textarea[name="message"]');
      if (msgArea && !msgArea.value) {
        msgArea.value = "I've mapped out my event timeline — details attached!";
      }
    }, 600);
  });

  // ── CONTACT FORM SUBMISSION ──
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch('https://formspree.io/f/xkopqryo', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        form.style.display = 'none';
        document.getElementById('form-success').classList.add('show');
      } else {
        response.json().then(data => {
          alert('There was a problem submitting the form. Please try again or email cory@hotshotent.com directly.');
        });
      }
    })
    .catch(() => {
      alert('There was a problem submitting the form. Please try again or email cory@hotshotent.com directly.');
    });
  });

});
