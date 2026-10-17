/**
 * ShortsBuddy Creator Hub - Main Application Logic
 * Integrates StorageManager, NICHE_TEMPLATES, UI rendering, script tools, and interactive workflows.
 */

// Application State
const state = {
  searchQuery: '',
  activeNiche: 'All',
  activeStatus: 'All',
  viewMode: 'kanban', // 'kanban' | 'list'
  currentEditingId: null,
  activeModalTab: 'script' // 'script' | 'viral'
};

// Words per second for fast-paced short-form narration (approx. 2.6 words/sec or 155 wpm)
const WORDS_PER_SECOND = 2.6;

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  setupEventListeners();
  renderApp();
}

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderBoard();
    });
  }

  // Niche filter pills
  const nichePillsContainer = document.getElementById('nicheFilterRow');
  if (nichePillsContainer) {
    nichePillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.niche-pill');
      if (!pill) return;
      document.querySelectorAll('.niche-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeNiche = pill.dataset.niche;
      renderBoard();
    });
  }

  // View toggle
  const kanbanBtn = document.getElementById('viewKanbanBtn');
  const listBtn = document.getElementById('viewListBtn');
  if (kanbanBtn && listBtn) {
    kanbanBtn.addEventListener('click', () => {
      state.viewMode = 'kanban';
      kanbanBtn.classList.add('active');
      listBtn.classList.remove('active');
      renderBoard();
    });
    listBtn.addEventListener('click', () => {
      state.viewMode = 'list';
      listBtn.classList.add('active');
      kanbanBtn.classList.remove('active');
      renderBoard();
    });
  }

  // Narration live calculator
  const narrationInput = document.getElementById('modalNarration');
  if (narrationInput) {
    narrationInput.addEventListener('input', updateNarrationStats);
  }

  // Niche selector change in modal
  const modalNiche = document.getElementById('modalNiche');
  if (modalNiche) {
    modalNiche.addEventListener('change', () => {
      updateModalNicheHelpers(modalNiche.value);
    });
  }

  // Modal Tabs
  const tabScriptBtn = document.getElementById('tabScriptBtn');
  const tabViralBtn = document.getElementById('tabViralBtn');
  if (tabScriptBtn && tabViralBtn) {
    tabScriptBtn.addEventListener('click', () => switchModalTab('script'));
    tabViralBtn.addEventListener('click', () => switchModalTab('viral'));
  }

  // Close modals when clicking overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });
}

// ==========================================================================
// Rendering Core
// ==========================================================================
function renderApp() {
  renderMetrics();
  renderBoard();
}

function renderMetrics() {
  const videos = StorageManager.getVideos();
  const counts = {
    idea: 0,
    script: 0,
    editing: 0,
    published: 0
  };

  videos.forEach(v => {
    if (v.status === 'Idea') counts.idea++;
    else if (v.status === 'Script Ready') counts.script++;
    else if (v.status === 'Editing') counts.editing++;
    else if (v.status === 'Published') counts.published++;
  });

  const countIdeaEl = document.getElementById('countIdea');
  const countScriptEl = document.getElementById('countScript');
  const countEditingEl = document.getElementById('countEditing');
  const countPublishedEl = document.getElementById('countPublished');

  if (countIdeaEl) countIdeaEl.textContent = counts.idea;
  if (countScriptEl) countScriptEl.textContent = counts.script;
  if (countEditingEl) countEditingEl.textContent = counts.editing;
  if (countPublishedEl) countPublishedEl.textContent = counts.published;

  // Header quick summary pill
  const totalVideosEl = document.getElementById('headerTotalCount');
  if (totalVideosEl) totalVideosEl.textContent = `${videos.length} Shorts/Reels`;

  // Update active status filter styling on metric cards
  const metricCards = {
    'Idea': document.getElementById('metricCardIdea'),
    'Script Ready': document.getElementById('metricCardScript'),
    'Editing': document.getElementById('metricCardEditing'),
    'Published': document.getElementById('metricCardPublished')
  };

  Object.entries(metricCards).forEach(([status, el]) => {
    if (el) {
      if (state.activeStatus === status) {
        el.classList.add('active-filter');
      } else {
        el.classList.remove('active-filter');
      }
    }
  });

  // Update status filter pills in toolbar
  document.querySelectorAll('.status-pill').forEach(pill => {
    if (pill.dataset.status === state.activeStatus) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Update active status banner
  const banner = document.getElementById('activeFilterBanner');
  const bannerText = document.getElementById('activeFilterText');
  if (banner && bannerText) {
    if (state.activeStatus !== 'All') {
      const filteredVideos = getFilteredVideos();
      banner.style.display = 'flex';
      bannerText.innerHTML = `Showing: <strong>${state.activeStatus}</strong> videos (${filteredVideos.length} total)`;
    } else {
      banner.style.display = 'none';
    }
  }
}

function toggleStatusFilter(status) {
  if (state.activeStatus === status && status !== 'All') {
    state.activeStatus = 'All';
    showToast('Showing all stages', 'info');
  } else {
    state.activeStatus = status;
    if (status === 'Script Ready') {
      showToast('Showing all Script Ready videos 📝', 'info');
    } else if (status !== 'All') {
      showToast(`Showing all "${status}" videos`, 'info');
    } else {
      showToast('Showing all stages', 'info');
    }
  }
  renderApp();
}

function clearStatusFilter() {
  state.activeStatus = 'All';
  showToast('Showing all stages', 'info');
  renderApp();
}

function getFilteredVideos() {
  let videos = StorageManager.getVideos();

  // Filter by Status
  if (state.activeStatus !== 'All') {
    videos = videos.filter(v => v.status === state.activeStatus);
  }

  // Filter by Niche
  if (state.activeNiche !== 'All') {
    videos = videos.filter(v => v.niche === state.activeNiche);
  }

  // Filter by Search Query
  if (state.searchQuery) {
    const q = state.searchQuery;
    videos = videos.filter(v => {
      const titleMatch = (v.title || '').toLowerCase().includes(q);
      const hookMatch = (v.hook || '').toLowerCase().includes(q);
      const narrationMatch = (v.narration || '').toLowerCase().includes(q);
      const sceneMatch = (v.sceneScript || '').toLowerCase().includes(q);
      const endingMatch = (v.ending || '').toLowerCase().includes(q);
      const notesMatch = (v.notes || '').toLowerCase().includes(q);
      const tagMatch = (v.hashtags || []).some(t => t.toLowerCase().includes(q));
      return titleMatch || hookMatch || narrationMatch || sceneMatch || endingMatch || notesMatch || tagMatch;
    });
  }

  return videos;
}

function renderBoard() {
  const board = document.getElementById('boardContainer');
  if (!board) return;

  const videos = getFilteredVideos();

  // If a specific status is active (like Script Ready) or if user switched to list mode
  if (state.activeStatus !== 'All') {
    board.className = 'board-container list-mode';
    renderFocusedStatusView(board, videos, state.activeStatus);
  } else if (state.viewMode === 'list') {
    board.className = 'board-container list-mode';
    renderListView(board, videos);
  } else {
    board.className = 'board-container';
    renderKanbanView(board, videos);
  }
}

function renderFocusedStatusView(board, videos, status) {
  if (videos.length === 0) {
    board.innerHTML = `
      <div class="board-column" style="min-height: auto;">
        <div class="column-header">
          <div class="column-title-group">
            <h2>Stage: ${escapeHTML(status)}</h2>
          </div>
          <span class="column-count">0 Videos</span>
        </div>
        <div class="empty-zone">
          No videos currently in <strong>${escapeHTML(status)}</strong> stage.
          <br><br>
          <button class="btn btn-secondary btn-sm" onclick="clearStatusFilter()">Show All Stages</button>
        </div>
      </div>
    `;
    return;
  }

  board.innerHTML = `
    <div class="board-column" style="min-height: auto;">
      <div class="column-header">
        <div class="column-title-group">
          <h2>${status === 'Script Ready' ? '📝 All Script Ready Videos' : `Stage: ${escapeHTML(status)}`}</h2>
        </div>
        <span class="column-count">${videos.length} Ready to Record</span>
      </div>
      <div class="cards-dropzone" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.25rem;">
        ${videos.map(v => createVideoCardHTML(v, true)).join('')}
      </div>
    </div>
  `;
}

function renderKanbanView(board, videos) {
  const columns = [
    { id: 'Idea', title: '💡 Idea Stage', statusClass: 'idea' },
    { id: 'Script Ready', title: '📝 Script Ready', statusClass: 'script' },
    { id: 'Editing', title: '🎬 In Editing', statusClass: 'editing' },
    { id: 'Published', title: '🚀 Published', statusClass: 'published' }
  ];

  board.innerHTML = columns.map(col => {
    const colVideos = videos.filter(v => v.status === col.id);
    return `
      <div class="board-column" data-status="${col.id}">
        <div class="column-header">
          <div class="column-title-group">
            <span class="status-dot ${col.statusClass}"></span>
            <h2>${col.title}</h2>
          </div>
          <span class="column-count">${colVideos.length}</span>
        </div>
        <div class="cards-dropzone">
          ${colVideos.length > 0 
            ? colVideos.map(v => createVideoCardHTML(v)).join('')
            : `<div class="empty-zone">No shorts in ${col.id} yet.</div>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function renderListView(board, videos) {
  if (videos.length === 0) {
    board.innerHTML = `
      <div class="board-column">
        <div class="empty-zone">No video plans matched your current search and filters.</div>
      </div>
    `;
    return;
  }

  board.innerHTML = `
    <div class="board-column" style="min-height: auto;">
      <div class="column-header">
        <div class="column-title-group">
          <h2>All Filtered Shorts & Reels Plans</h2>
        </div>
        <span class="column-count">${videos.length} Total</span>
      </div>
      <div class="cards-dropzone" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem;">
        ${videos.map(v => createVideoCardHTML(v)).join('')}
      </div>
    </div>
  `;
}

function createVideoCardHTML(v, isExpanded = false) {
  const nicheData = NICHE_TEMPLATES[v.niche] || { icon: '✨', badgeBg: 'rgba(255,255,255,0.1)', badgeColor: '#fff' };
  
  // Calculate speech duration estimate
  const wordCount = (v.narration || '').trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.max(5, Math.round(wordCount / WORDS_PER_SECOND));

  // Determine readiness
  const hasHook = Boolean(v.hook && v.hook.trim());
  const hasScene = Boolean(v.sceneScript && v.sceneScript.trim());
  const hasNarration = Boolean(v.narration && v.narration.trim());
  const hasEnding = Boolean(v.ending && v.ending.trim());

  // Show detailed script breakdown if this video is Script Ready or if expanded view is active
  const showFullScript = isExpanded || v.status === 'Script Ready';

  // Next status progression logic
  let nextStatus = '';
  let nextStatusLabel = '';
  if (v.status === 'Idea') {
    nextStatus = 'Script Ready';
    nextStatusLabel = 'Ready Script ➡️';
  } else if (v.status === 'Script Ready') {
    nextStatus = 'Editing';
    nextStatusLabel = '🎬 Move to In Editing';
  } else if (v.status === 'Editing') {
    nextStatus = 'Published';
    nextStatusLabel = 'Publish! 🚀';
  }

  return `
    <div class="video-card ${v.status === 'Script Ready' ? 'script-ready-card' : ''}" id="card-${v.id}" onclick="handleCardClick(event, '${v.id}')">
      <div class="card-top-row">
        <div class="card-badges">
          <span class="niche-tag" style="background: ${nicheData.badgeBg}; color: ${nicheData.badgeColor};">
            ${nicheData.icon} ${v.niche}
          </span>
          <span class="platform-tag">${v.targetPlatform || 'Both'}</span>
          <span class="platform-tag" style="color: ${v.status === 'Script Ready' ? '#60a5fa' : 'inherit'}; font-weight: 700;">
            ● ${v.status}
          </span>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary btn-icon-only" title="View Complete Script" onclick="openScriptViewer('${v.id}', event)">
            👁️
          </button>
          <button class="btn btn-secondary btn-icon-only" title="Copy Teleprompter Script" onclick="copyFullScript('${v.id}', event)">
            📋
          </button>
          <button class="btn btn-secondary btn-icon-only" title="Edit Video" onclick="openEditModal('${v.id}', event)">
            ✏️
          </button>
          <button class="btn btn-danger btn-icon-only" title="Delete Plan" onclick="confirmDelete('${v.id}', event)">
            🗑️
          </button>
        </div>
      </div>

      <div class="card-title">${escapeHTML(v.title || 'Untitled Video')}</div>

      ${showFullScript ? `
        <!-- Complete Script Breakdown for Script Ready -->
        <div class="card-script-breakdown">
          <div class="script-section-item">
            <span class="script-section-header hook-title">⚡ 1. Hook (0–3s)</span>
            <div class="script-section-body hook-body">${escapeHTML(v.hook || '(No hook defined yet - click Edit to add)')}</div>
          </div>

          <div class="script-section-item">
            <span class="script-section-header scenes-title">🎬 2. Scenes & Visual Plan</span>
            <div class="script-section-body scenes-body">${escapeHTML(v.sceneScript || '(No scenes written yet - click Edit to add)')}</div>
          </div>

          <div class="script-section-item">
            <span class="script-section-header voice-title">🎙️ 3. Voiceover / Narration Script (${wordCount}w • ~${estimatedSeconds}s)</span>
            <div class="script-section-body voice-body">${escapeHTML(v.narration || '(No narration written yet - click Edit to add)')}</div>
          </div>

          <div class="script-section-item">
            <span class="script-section-header ending-title">🔄 4. Ending & Loop CTA</span>
            <div class="script-section-body ending-body">${escapeHTML(v.ending || '(No ending specified - click Edit to add)')}</div>
          </div>
        </div>

        <div class="card-action-bar-primary">
          <button class="btn-move-editing" onclick="moveToEditing('${v.id}', event)" title="Move video directly to In Editing">
            🎬 Move to In Editing
          </button>
          <button class="btn btn-secondary btn-sm" onclick="copyFullScript('${v.id}', event)" title="Copy script for recording">
            📋 Copy Script
          </button>
          <button class="btn btn-secondary btn-sm" onclick="openEditModal('${v.id}', event)" title="Edit script fields">
            ✏️ Edit
          </button>
          <button class="btn btn-secondary btn-sm" onclick="openScriptViewer('${v.id}', event)" title="Open complete viewer">
            👁️ Reader View
          </button>
        </div>
      ` : `
        <!-- Compact Preview for other stages -->
        ${v.hook ? `
          <div class="card-hook-box">
            <strong>⚡ Hook:</strong> "${escapeHTML(v.hook)}"
          </div>
        ` : ''}

        <div class="script-readiness">
          <span class="readiness-chip ${hasHook ? 'done' : ''}">Hook ${hasHook ? '✓' : '—'}</span>
          <span class="readiness-chip ${hasScene ? 'done' : ''}">Scenes ${hasScene ? '✓' : '—'}</span>
          <span class="readiness-chip ${hasNarration ? 'done' : ''}">Voice ${hasNarration ? '✓' : '—'}</span>
          <span class="readiness-chip ${hasEnding ? 'done' : ''}">Ending ${hasEnding ? '✓' : '—'}</span>
        </div>

        <div class="card-meta-row">
          <span class="duration-pill" title="Estimated narration time at short-form speech pace">
            ⏱️ ~${estimatedSeconds}s (${wordCount}w)
          </span>
          ${nextStatus ? `
            <button class="status-advance-btn" onclick="quickAdvanceStatus('${v.id}', '${nextStatus}', event)">
              ${nextStatusLabel}
            </button>
          ` : `
            <span style="color: #10b981; font-weight: 700; font-size: 0.75rem;">🎉 Live</span>
          `}
        </div>
      `}
    </div>
  `;
}

// ==========================================================================
// Dedicated Script Viewer Modal
// ==========================================================================
function openScriptViewer(id, event) {
  if (event) event.stopPropagation();
  const v = StorageManager.getVideoById(id);
  if (!v) return;

  const nicheData = NICHE_TEMPLATES[v.niche] || { icon: '✨', badgeBg: 'rgba(255,255,255,0.1)', badgeColor: '#fff', color: '#ff0050' };
  const wordCount = (v.narration || '').trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.max(5, Math.round(wordCount / WORDS_PER_SECOND));

  const modalTitle = document.getElementById('viewModalTitle');
  const badgeRow = document.getElementById('viewModalBadgeRow');
  const modalBody = document.getElementById('viewModalBody');
  const modalFooter = document.getElementById('viewModalFooter');

  if (modalTitle) modalTitle.textContent = v.title || 'Untitled Video';

  if (badgeRow) {
    let statusBg = 'var(--bg-glass-elevated)';
    let statusColor = 'var(--text-primary)';
    if (v.status === 'Idea') { statusBg = 'rgba(245, 158, 11, 0.2)'; statusColor = '#f59e0b'; }
    else if (v.status === 'Script Ready') { statusBg = 'rgba(59, 130, 246, 0.2)'; statusColor = '#3b82f6'; }
    else if (v.status === 'Editing') { statusBg = 'rgba(139, 92, 246, 0.2)'; statusColor = '#8b5cf6'; }
    else if (v.status === 'Published') { statusBg = 'rgba(16, 185, 129, 0.2)'; statusColor = '#10b981'; }

    badgeRow.innerHTML = `
      <span class="niche-tag" style="background: ${nicheData.badgeBg}; color: ${nicheData.badgeColor}; font-size: 0.82rem;">
        ${nicheData.icon} ${v.niche}
      </span>
      <span class="platform-tag" style="font-size: 0.8rem;">${v.targetPlatform || 'Both'}</span>
      <span class="niche-tag" style="background: ${statusBg}; color: ${statusColor}; font-size: 0.82rem;">
        ● ${v.status}
      </span>
      <span class="duration-pill" style="font-size: 0.8rem; margin-left: auto;">
        ⏱️ ~${estimatedSeconds}s Speech (${wordCount} words)
      </span>
    `;
  }

  if (modalBody) {
    modalBody.innerHTML = `
      <!-- Hook Section -->
      <div class="view-script-block">
        <div class="view-script-label hook">
          <span>⚡ 1. Viral Hook (First 0–3 Seconds)</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Retention Anchor</span>
        </div>
        <div class="view-hook-banner">
          "${escapeHTML(v.hook || 'No hook written yet. Click Edit to add one.')}"
        </div>
      </div>

      <!-- Scenes Section -->
      <div class="view-script-block">
        <div class="view-script-label scenes">
          <span>🎬 2. Scene-by-Scene Visual Breakdown</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Camera cues, b-roll & on-screen text</span>
        </div>
        <div class="view-script-text">
          ${escapeHTML(v.sceneScript || 'No scene plan written yet.')}
        </div>
      </div>

      <!-- Voiceover Section -->
      <div class="view-script-block">
        <div class="view-script-label voice">
          <span>🎙️ 3. Spoken Voiceover / Narration Script</span>
          <span class="narration-counter-pill">Words: ${wordCount} • ~${estimatedSeconds}s audio</span>
        </div>
        <div class="view-script-text" style="font-size: 1rem; line-height: 1.7;">
          ${escapeHTML(v.narration || 'No narration written yet.')}
        </div>
      </div>

      <!-- Ending & CTA Section -->
      <div class="view-script-block">
        <div class="view-script-label ending">
          <span>🔄 4. Ending & Loop CTA</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Algorithm loop trigger</span>
        </div>
        <div class="view-script-text" style="font-weight: 500;">
          ${escapeHTML(v.ending || 'No ending specified.')}
        </div>
      </div>

      ${(v.hashtags && v.hashtags.length > 0) || v.description ? `
        <div class="view-script-block">
          <div class="view-script-label" style="color: var(--text-secondary);">
            <span>🏷️ Description & Hashtags</span>
          </div>
          ${v.description ? `<p style="font-size: 0.85rem; color: #cbd5e1; white-space: pre-wrap; margin-bottom: 0.5rem;">${escapeHTML(v.description)}</p>` : ''}
          <div class="hashtag-cloud">
            ${(v.hashtags || []).map(t => `<span class="tag-chip" style="cursor: default;">${escapeHTML(t)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${v.notes ? `
        <div class="view-script-block">
          <div class="view-script-label" style="color: var(--text-muted);">
            <span>📝 Production Notes & Audio</span>
          </div>
          <p style="font-size: 0.85rem; color: #94a3b8; white-space: pre-wrap;">${escapeHTML(v.notes)}</p>
        </div>
      ` : ''}
    `;
  }

  if (modalFooter) {
    let nextStatusActionBtn = '';
    if (v.status === 'Script Ready') {
      nextStatusActionBtn = `
        <button class="btn btn-primary" onclick="moveToEditing('${v.id}', event)">
          🎬 Move to In Editing
        </button>
      `;
    } else if (v.status === 'Idea') {
      nextStatusActionBtn = `
        <button class="btn btn-primary" onclick="quickAdvanceStatus('${v.id}', 'Script Ready', event); closeAllModals();">
          📝 Move to Script Ready
        </button>
      `;
    } else if (v.status === 'Editing') {
      nextStatusActionBtn = `
        <button class="btn btn-primary" onclick="quickAdvanceStatus('${v.id}', 'Published', event); closeAllModals();">
          🚀 Publish Short!
        </button>
      `;
    }

    modalFooter.innerHTML = `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="openEditModal('${v.id}', event)">
          ✏️ Edit Script
        </button>
        <button class="btn btn-secondary" onclick="copyFullScript('${v.id}', event)">
          📋 Copy Teleprompter Script
        </button>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-left: auto; flex-wrap: wrap;">
        ${nextStatusActionBtn}
        <button class="btn btn-secondary" onclick="closeAllModals()">
          Close
        </button>
      </div>
    `;
  }

  document.getElementById('viewScriptModal').classList.add('active');
}

function moveToEditing(id, event) {
  if (event) event.stopPropagation();
  const updated = StorageManager.updateStatus(id, 'Editing');
  if (updated) {
    showToast('Moved to "In Editing"! 🎬 Dashboard counts updated.', 'success');
    closeAllModals();
    renderApp();
  }
}

function handleCardClick(event, id) {
  // If clicked directly on a button inside card, don't trigger script viewer
  if (event.target.closest('button')) return;
  openScriptViewer(id, event);
}

function openCreateModal(defaultNiche = 'Facts') {
  state.currentEditingId = null;
  const titleEl = document.getElementById('modalTitleText');
  if (titleEl) titleEl.textContent = 'Plan Short / Reel';

  const delBtn = document.getElementById('deleteVideoBtn');
  if (delBtn) delBtn.style.display = 'none';

  // Reset form fields
  const titleInput = document.getElementById('modalVideoTitle');
  if (titleInput) titleInput.value = '';

  const nicheSelect = document.getElementById('modalNiche');
  if (nicheSelect) nicheSelect.value = defaultNiche || 'Facts';

  const platformSelect = document.getElementById('modalPlatform');
  if (platformSelect) platformSelect.value = 'Both';

  const statusSelect = document.getElementById('modalStatus');
  if (statusSelect) statusSelect.value = 'Idea';

  const hookInput = document.getElementById('modalHook');
  if (hookInput) hookInput.value = '';

  const sceneInput = document.getElementById('modalSceneScript');
  if (sceneInput) sceneInput.value = '';

  const narrationInput = document.getElementById('modalNarration');
  if (narrationInput) narrationInput.value = '';

  const endingInput = document.getElementById('modalEnding');
  if (endingInput) endingInput.value = '';

  const hashtagsInput = document.getElementById('modalHashtags');
  if (hashtagsInput) hashtagsInput.value = '';

  const descInput = document.getElementById('modalDescription');
  if (descInput) descInput.value = '';

  const notesInput = document.getElementById('modalNotes');
  if (notesInput) notesInput.value = '';

  updateModalNicheHelpers(defaultNiche || 'Facts');
  updateNarrationStats();
  switchModalTab('script');

  const modal = document.getElementById('scriptModal');
  if (modal) modal.classList.add('active');
}

function openEditModal(id, event) {
  if (event) event.stopPropagation();
  const v = StorageManager.getVideoById(id);
  if (!v) return;

  state.currentEditingId = id;
  const titleEl = document.getElementById('modalTitleText');
  if (titleEl) titleEl.textContent = 'Edit Short / Reel';

  const delBtn = document.getElementById('deleteVideoBtn');
  if (delBtn) delBtn.style.display = 'inline-flex';

  // Populate form fields with existing video data
  const titleInput = document.getElementById('modalVideoTitle');
  if (titleInput) titleInput.value = v.title || '';

  const nicheSelect = document.getElementById('modalNiche');
  if (nicheSelect) nicheSelect.value = v.niche || 'Facts';

  const platformSelect = document.getElementById('modalPlatform');
  if (platformSelect) platformSelect.value = v.targetPlatform || 'Both';

  const statusSelect = document.getElementById('modalStatus');
  if (statusSelect) statusSelect.value = v.status || 'Idea';

  const hookInput = document.getElementById('modalHook');
  if (hookInput) hookInput.value = v.hook || '';

  const sceneInput = document.getElementById('modalSceneScript');
  if (sceneInput) sceneInput.value = v.sceneScript || '';

  const narrationInput = document.getElementById('modalNarration');
  if (narrationInput) narrationInput.value = v.narration || '';

  const endingInput = document.getElementById('modalEnding');
  if (endingInput) endingInput.value = v.ending || '';

  const hashtagsInput = document.getElementById('modalHashtags');
  if (hashtagsInput) {
    hashtagsInput.value = Array.isArray(v.hashtags) ? v.hashtags.join(' ') : (v.hashtags || '');
  }

  const descInput = document.getElementById('modalDescription');
  if (descInput) descInput.value = v.description || '';

  const notesInput = document.getElementById('modalNotes');
  if (notesInput) notesInput.value = v.notes || '';

  updateModalNicheHelpers(v.niche || 'Facts');
  updateNarrationStats();
  switchModalTab('script');

  closeAllModals();
  const modal = document.getElementById('scriptModal');
  if (modal) modal.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function saveVideoModal() {
  const title = document.getElementById('modalVideoTitle').value.trim();
  if (!title) {
    showToast('Please enter a video title!', 'info');
    document.getElementById('modalVideoTitle').focus();
    return;
  }

  const hashtagsRaw = document.getElementById('modalHashtags').value.trim();
  const hashtags = hashtagsRaw
    ? hashtagsRaw.split(/\s+/).map(t => t.startsWith('#') ? t : `#${t}`)
    : [];

  const videoData = {
    title,
    niche: document.getElementById('modalNiche').value,
    targetPlatform: document.getElementById('modalPlatform').value,
    status: document.getElementById('modalStatus').value,
    hook: document.getElementById('modalHook').value.trim(),
    sceneScript: document.getElementById('modalSceneScript').value.trim(),
    narration: document.getElementById('modalNarration').value.trim(),
    ending: document.getElementById('modalEnding').value.trim(),
    description: document.getElementById('modalDescription').value.trim(),
    hashtags,
    notes: document.getElementById('modalNotes').value.trim()
  };

  if (state.currentEditingId) {
    StorageManager.updateVideo(state.currentEditingId, videoData);
    showToast('Plan updated successfully! ✅', 'success');
  } else {
    StorageManager.addVideo(videoData);
    showToast('New Short created! 🚀', 'success');
  }

  closeAllModals();
  renderApp();
}

function deleteCurrentVideo() {
  if (!state.currentEditingId) return;
  if (confirm('Are you sure you want to delete this short plan?')) {
    StorageManager.deleteVideo(state.currentEditingId);
    showToast('Video plan deleted. 🗑️', 'info');
    closeAllModals();
    renderApp();
  }
}

function confirmDelete(id, event) {
  if (event) event.stopPropagation();
  if (confirm('Delete this video idea?')) {
    StorageManager.deleteVideo(id);
    showToast('Video plan removed.', 'info');
    renderApp();
  }
}

function quickAdvanceStatus(id, newStatus, event) {
  if (event) event.stopPropagation();
  StorageManager.updateStatus(id, newStatus);
  showToast(`Moved to "${newStatus}"! 🎯`, 'success');
  renderApp();
}

// ==========================================================================
// Script Writing Helpers & Niche Tools
// ==========================================================================
function updateNarrationStats() {
  const text = document.getElementById('modalNarration').value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const estimatedSeconds = Math.round(words / WORDS_PER_SECOND);

  const counterEl = document.getElementById('narrationWordCounter');
  if (counterEl) {
    let paceNote = 'Great pace';
    if (estimatedSeconds > 60) paceNote = '⚠️ Over 60s (Too long for Shorts)';
    else if (estimatedSeconds > 45) paceNote = 'Full-length (~50s)';
    else if (estimatedSeconds < 15 && words > 0) paceNote = 'Fast Bite (~15s)';

    counterEl.textContent = `Words: ${words} • ~${estimatedSeconds}s audio (${paceNote})`;
  }
}

function suggestHook() {
  const niche = document.getElementById('modalNiche').value;
  const template = NICHE_TEMPLATES[niche];
  if (!template || !template.hooks.length) return;

  const currentHook = document.getElementById('modalHook').value;
  const availableHooks = template.hooks.filter(h => h !== currentHook);
  const randomHook = availableHooks[Math.floor(Math.random() * availableHooks.length)] || template.hooks[0];

  document.getElementById('modalHook').value = randomHook;
  showToast(`Hook inspired by ${niche}! ⚡`, 'info');
}

function suggestEnding() {
  const endings = [
    "Which one shocked you the most? Drop your comment below! Loop starts now.",
    "Share this with that ONE friend who needs to see this! Follow for more.",
    "Did I miss anything? Let me know in the comments! Follow for daily shorts.",
    "What would YOU do in this situation? Hit subscribe so you never miss part 2!",
    "Save this Reel so you don't forget it later! Follow for daily gems."
  ];
  const randomEnding = endings[Math.floor(Math.random() * endings.length)];
  document.getElementById('modalEnding').value = randomEnding;
  showToast('Ending & CTA applied! 🔄', 'info');
}

function updateModalNicheHelpers(niche) {
  const template = NICHE_TEMPLATES[niche];
  if (!template) return;

  // Update hashtag cloud
  const cloud = document.getElementById('modalHashtagCloud');
  if (cloud) {
    cloud.innerHTML = template.hashtags.map(tag => `
      <span class="tag-chip" onclick="toggleHashtag('${tag}')">${tag}</span>
    `).join('');
  }

  // Update Title Idea list
  const titleList = document.getElementById('modalTitleIdeas');
  if (titleList) {
    titleList.innerHTML = template.titleFormulas.map(formula => `
      <div class="template-snippet-item" onclick="applyTitleFormula('${escapeSingleQuote(formula)}')">
        <span>${escapeHTML(formula)}</span>
        <span class="copy-mini-badge">Use 👆</span>
      </div>
    `).join('');
  }
}

function toggleHashtag(tag) {
  const input = document.getElementById('modalHashtags');
  const currentTags = input.value.trim().split(/\s+/).filter(Boolean);
  if (currentTags.includes(tag)) {
    input.value = currentTags.filter(t => t !== tag).join(' ');
  } else {
    currentTags.push(tag);
    input.value = currentTags.join(' ');
  }
  showToast(`Toggled ${tag}`, 'info');
}

function applyTitleFormula(formula) {
  document.getElementById('modalVideoTitle').value = formula;
  showToast('Title formula applied! Customize the [brackets]. ✍️', 'success');
}

function fillDescriptionTemplate() {
  const niche = document.getElementById('modalNiche').value;
  const template = NICHE_TEMPLATES[niche];
  if (!template) return;

  document.getElementById('modalDescription').value = template.descriptionTemplate;
  showToast('Niche description template applied! 📝', 'info');
}

function switchModalTab(tab) {
  state.activeModalTab = tab;
  const scriptContent = document.getElementById('tabContentScript');
  const viralContent = document.getElementById('tabContentViral');
  const tabScriptBtn = document.getElementById('tabScriptBtn');
  const tabViralBtn = document.getElementById('tabViralBtn');

  if (tab === 'script') {
    scriptContent.style.display = 'flex';
    viralContent.style.display = 'none';
    tabScriptBtn.classList.add('active');
    tabViralBtn.classList.remove('active');
  } else {
    scriptContent.style.display = 'none';
    viralContent.style.display = 'flex';
    tabScriptBtn.classList.remove('active');
    tabViralBtn.classList.add('active');
  }
}

// ==========================================================================
// Copying & Teleprompter Helper
// ==========================================================================
function copyFullScript(id, event) {
  if (event) event.stopPropagation();
  const v = StorageManager.getVideoById(id);
  if (!v) return;

  const scriptText = `
=== ${v.title.toUpperCase()} ===
[Platform: ${v.targetPlatform} | Niche: ${v.niche} | Status: ${v.status}]

⚡ [HOOK - First 3 Seconds]:
${v.hook || '(No hook defined yet)'}

🎬 [SCENE-BY-SCENE VISUALS]:
${v.sceneScript || '(No scenes specified)'}

🎙️ [VOICEOVER / NARRATION]:
${v.narration || '(No narration text)'}

🔄 [ENDING & CTA]:
${v.ending || '(No ending specified)'}

🏷️ [HASHTAGS]:
${(v.hashtags || []).join(' ')}
  `.trim();

  copyTextToClipboard(scriptText, 'Full teleprompter script copied to clipboard! 📋');
}

function copyModalScript() {
  const title = document.getElementById('modalVideoTitle').value || 'Untitled Short';
  const hook = document.getElementById('modalHook').value;
  const scenes = document.getElementById('modalSceneScript').value;
  const narration = document.getElementById('modalNarration').value;
  const ending = document.getElementById('modalEnding').value;

  const scriptText = `
=== ${title.toUpperCase()} ===

⚡ HOOK:
${hook || '(None)'}

🎬 SCENES:
${scenes || '(None)'}

🎙️ NARRATION:
${narration || '(None)'}

🔄 ENDING & CTA:
${ending || '(None)'}
  `.trim();

  copyTextToClipboard(scriptText, 'Script copied for Teleprompter! 🎙️');
}

// ==========================================================================
// Standalone Viral Templates Modal
// ==========================================================================
function openTemplateModal() {
  const container = document.getElementById('templateLibraryGrid');
  if (!container) return;

  container.innerHTML = Object.entries(NICHE_TEMPLATES).map(([key, t]) => `
    <div class="template-card">
      <h4 style="color: ${t.color}">${t.icon} ${t.name}</h4>
      <div>
        <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">High-Retention Hooks:</strong>
        <div class="template-snippet-list" style="margin-top: 0.35rem;">
          ${t.hooks.slice(0, 3).map(h => `
            <div class="template-snippet-item" onclick="copyTextToClipboard('${escapeSingleQuote(h)}', 'Hook copied!')">
              <span>"${escapeHTML(h)}"</span>
              <span class="copy-mini-badge">Copy</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Viral Title Formulas:</strong>
        <div class="template-snippet-list" style="margin-top: 0.35rem;">
          ${t.titleFormulas.slice(0, 2).map(tf => `
            <div class="template-snippet-item" onclick="copyTextToClipboard('${escapeSingleQuote(tf)}', 'Title formula copied!')">
              <span>${escapeHTML(tf)}</span>
              <span class="copy-mini-badge">Copy</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Hashtag Pack:</strong>
        <div class="hashtag-cloud" style="margin-top: 0.35rem;">
          ${t.hashtags.map(tag => `
            <span class="tag-chip" onclick="copyTextToClipboard('${tag}', 'Tag copied!')">${tag}</span>
          `).join('')}
        </div>
      </div>

      <button class="btn btn-secondary btn-sm" style="margin-top: 0.5rem;" onclick="startShortWithNiche('${key}')">
        🚀 Plan New Short in ${key}
      </button>
    </div>
  `).join('');

  document.getElementById('templateModal').classList.add('active');
}

function startShortWithNiche(niche) {
  closeAllModals();
  openCreateModal(niche);
}

// ==========================================================================
// Backup, Export & Reset
// ==========================================================================
function openBackupModal() {
  document.getElementById('backupModal').classList.add('active');
}

function exportDataFile() {
  const json = StorageManager.exportDataJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shortsbuddy_backup_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup file downloaded! 💾', 'success');
}

function importDataFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const res = StorageManager.importDataJSON(e.target.result);
    if (res.success) {
      showToast(`Restored ${res.count} shorts successfully! 📥`, 'success');
      closeAllModals();
      renderApp();
    } else {
      showToast('Error importing file: ' + res.error, 'info');
    }
  };
  reader.readAsText(file);
}

function resetToDefaultStarter() {
  if (confirm('Reset to starter video plans? This will replace current items with default templates.')) {
    StorageManager.resetDefaults();
    showToast('Reset to starter video templates! ✨', 'success');
    closeAllModals();
    renderApp();
  }
}

// ==========================================================================
// Utility Helpers
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function copyTextToClipboard(text, successMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage, 'success');
    }).catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage, 'success');
  } catch (err) {
    showToast('Failed to copy text', 'info');
  }
  document.body.removeChild(textArea);
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeSingleQuote(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'");
}
