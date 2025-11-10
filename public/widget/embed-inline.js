// Jovylle Quick Menu Widget - Inline (no iframe). Uses Shadow DOM for style isolation.
(function() {
  'use strict';

  if (window.jovylleInlineWidgetLoaded) return;
  window.jovylleInlineWidgetLoaded = true;

  const script = document.currentScript;
  const position = script?.getAttribute('data-position') || 'bottom-right';
  const size = script?.getAttribute('data-size') || 'medium';
  const initialThemeAttr = script?.getAttribute('data-theme');
  const openOnLoad = script?.getAttribute('data-open') === 'true';
  const density = script?.getAttribute('data-density') || 'comfortable';
  const hideChat = script?.getAttribute('data-hide-chat') === 'true';
  const hidePortfolio = script?.getAttribute('data-hide-portfolio') === 'true';
  const showOnly = script?.getAttribute('data-show-only');

  const sizes = {
    small: { w: 280, h: 380 },
    medium: { w: 320, h: 420 },
    large: { w: 360, h: 520 },
  };
  const dims = sizes[size] || sizes.medium;

  // Root host (isolated via shadow DOM)
  const host = document.createElement('div');
  host.setAttribute('data-jovylle-inline-widget', '');
  host.style.cssText = `
    position: fixed; z-index: 2147483647; width: ${dims.w}px; height: ${dims.h}px;
  `;
  const posMap = {
    'bottom-right': () => { host.style.bottom = '20px'; host.style.right = '20px'; },
    'bottom-left':  () => { host.style.bottom = '20px'; host.style.left  = '20px'; },
    'top-right':    () => { host.style.top    = '20px'; host.style.right = '20px'; },
    'top-left':     () => { host.style.top    = '20px'; host.style.left  = '20px'; },
  };
  (posMap[position] || posMap['bottom-right'])();
  // Ensure full panel is visible when anchored to the top (button offset is 80px)
  if (position === 'top-right' || position === 'top-left') {
    host.style.height = `${dims.h + 80}px`;
  } else {
    host.style.height = `${dims.h}px`;
  }

  const shadow = host.attachShadow({ mode: 'open' });

  // Styles (copied/adapted from mystery-widget.html, tuned for shadow root)
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .mystery-widget { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .comfortable { --pad-header: 8px 12px; --tab-gap: 8px; --tab-pad: 8px 10px; --pad-content: 8px 12px; --section-mb: 8px; --link-pad: 8px 12px; --leader-pad: 6px 12px; }
    .compact { --pad-header: 4px 8px; --tab-gap: 6px; --tab-pad: 6px 8px; --pad-content: 4px 8px; --section-mb: 4px; --link-pad: 4px 8px; --leader-pad: 4px 8px; }
    .mystery-widget-button {
      width: 60px; height: 60px; border-radius: 50%;
      background: #ffffff;
      border: 3px dashed var(--widget-border, #e9ecef);
      cursor: pointer; display:flex; align-items:center; justify-content:center;
      color: #6c757d; transition: opacity .15s ease, transform .15s ease; user-select: none;
      position: absolute; bottom: 0; right: 0;
    }
    .mystery-widget-button:hover { opacity: .9; transform: translateY(2px); }
    .mystery-widget-button svg { width: 20px; height: 20px; }

    .mystery-widget-container {
      position: absolute; bottom: 80px; right: 0; width: ${dims.w}px;
      background: var(--widget-bg, #ffffff); border-radius: 8px;
      border: 3px dashed var(--widget-border, #e9ecef);
      opacity: 0; transform: translateY(8px) scale(.98);
      transition: opacity .2s ease, transform .2s ease; overflow: hidden;
      display: flex; flex-direction: column; max-height: calc(100% - 80px);
    }
    .open { opacity: 1; transform: translateY(0) scale(1); }
    .mystery-widget-header { background: #f8f9fa; padding: var(--pad-header); border-bottom: 1px solid #e9ecef; display:flex; align-items:center; justify-content: space-between; }
    .mystery-widget-title { margin:0; font-size:16px; font-weight:600; color:#495057; }
    .mystery-widget-tabs { display:flex; gap: var(--tab-gap); }
    .mystery-widget-tab { padding: var(--tab-pad); background:#ffffff; border:3px dashed #dee2e6; border-radius:4px; cursor:pointer; font-size:12px; font-weight:500; color:#6c757d; transition: background-color .2s ease, color .2s ease; }
    .mystery-widget-tab svg { width: 14px; height: 14px; stroke: currentColor; }
    .quick-btn { padding: var(--tab-pad); background:#ffffff; border:3px dashed #dee2e6; border-radius:4px; cursor:pointer; font-size:12px; font-weight:500; color:#6c757d; transition: background-color .2s ease, color .2s ease; }
    .mystery-widget-tab.active { color:#495057; background:#e9ecef; border-color:#adb5bd; }
    .mystery-widget-content { padding: var(--pad-content); flex: 1; overflow-y:auto; }
    .mystery-widget-section { margin-bottom: var(--section-mb); }
    .mystery-widget-link { display:block; padding: var(--link-pad); margin-bottom:4px; text-decoration:none; color:#495057; font-size:16px; transition:all .2s ease; border-bottom:3px dashed #e9ecef; }
    .mystery-widget-link:hover { background:#f8f9fa; transform: translateX(2px); }
    .leaderboard-row { display:flex; justify-content:space-between; padding: var(--leader-pad); border-bottom:1px dashed #e9ecef; }
    .icon-inline { display:inline-flex; vertical-align:middle; margin-right:6px; }
    .icon-inline svg { width: 16px; height: 16px; }
    .rank-num { display:inline-flex; align-items:center; justify-content:center; width:20px; }
    .chat-message { margin-bottom:8px; padding:8px 12px; border-radius:8px; max-width:85%; word-wrap:break-word; border:3px dashed #e9ecef; }
    .chat-message.user { align-self:flex-end; background:#f0f4f8; color:#0f172a; border-color:#dee2e6; }
    .chat-message.assistant { align-self:flex-start; background:#ffffff; color:#495057; border-color:var(--widget-border, #e9ecef); }

    /* Notifications */
    .notification-badge { position:absolute; top:-4px; right:-4px; background:#dc3545; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px; min-width:18px; text-align:center; }
    .notification-item { padding:12px; margin-bottom:8px; border-radius:6px; border:2px solid; position:relative; }
    .notification-item.info { background:#e7f5ff; border-color:#4dabf7; color:#1971c2; }
    .notification-item.success { background:#d3f9d8; border-color:#51cf66; color:#2b8a3e; }
    .notification-item.warning { background:#fff3bf; border-color:#ffd43b; color:#e67700; }
    .notification-item.error { background:#ffe0e0; border-color:#ff6b6b; color:#c92a2a; }
    .notification-item-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
    .notification-item-title { font-weight:600; font-size:13px; }
    .notification-item-body { font-size:12px; line-height:1.4; }
    .notification-item-close { background:transparent; border:none; cursor:pointer; font-size:16px; font-weight:700; opacity:.6; padding:0; line-height:1; width:16px; height:16px; }
    .notification-item-close:hover { opacity:1; }
    .notification-item-time { font-size:10px; opacity:.7; margin-top:4px; }
    .notification-empty { text-align:center; color:#6c757d; padding:32px 12px; font-size:14px; }

    /* Dark theme */
    :host(.dark-theme) .mystery-widget-container { --widget-bg:#1a1a1a; --widget-border:#404040; }
    :host(.dark-theme) .mystery-widget-button { background:#1a1a1a; color:#cccccc; border-color:#404040; }
    :host(.dark-theme) .mystery-widget-header { background:#2d2d2d; border-bottom:1px solid #404040; }
    :host(.dark-theme) .mystery-widget-title { color:#ffffff; }
    :host(.dark-theme) .mystery-widget-section h4 { color:#ffffff; }
    :host(.dark-theme) .leaderboard-row { color:#cccccc; border-bottom-color:#404040; }
    :host(.dark-theme) .play-button { background:#555555 !important; }
    :host(.dark-theme) .mystery-widget-tab { background:#2d2d2d; border-color:#404040; color:#cccccc; }
    :host(.dark-theme) .quick-btn { background:#2d2d2d; border-color:#404040; color:#cccccc; }
    :host(.dark-theme) .mystery-widget-tab.active { background:#404040; border-color:#555555; color:#ffffff; }
    :host(.dark-theme) .mystery-widget-link { color:#cccccc; border-bottom-color:#404040; }
    :host(.dark-theme) .mystery-widget-link:hover { background:#2d2d2d; }
    :host(.dark-theme) .chat-message.user { background:#2a2a2a; color:#e5e7eb; border-color:#404040; }
    :host(.dark-theme) .chat-message.assistant { background:#1a1a1a; color:#cccccc; border-color:#404040; }
    :host(.dark-theme) .notification-item.info { background:#1a3a52; border-color:#2980b9; color:#74c0fc; }
    :host(.dark-theme) .notification-item.success { background:#1a3a2e; border-color:#27ae60; color:#8ce99a; }
    :host(.dark-theme) .notification-item.warning { background:#4a3a1a; border-color:#f39c12; color:#ffe066; }
    :host(.dark-theme) .notification-item.error { background:#4a1a1a; border-color:#e74c3c; color:#ffa8a8; }
    :host(.dark-theme) .notification-empty { color:#999999; }

    @media (prefers-reduced-motion: reduce) {
      .mystery-widget-button, .mystery-widget-container, .mystery-widget-tab, .mystery-widget-link { transition: none !important; transform: none !important; }
    }
  `;

  const container = document.createElement('div');
  container.className = 'mystery-widget ' + (density === 'compact' ? 'compact' : 'comfortable');
  container.innerHTML = `
    <button class="mystery-widget-button" type="button" aria-label="Toggle quick menu" aria-expanded="false" aria-controls="widgetContainer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z"/>
      </svg>
    </button>
    <div class="mystery-widget-container" id="widgetContainer">
      <div class="mystery-widget-header">
        <h3 class="mystery-widget-title">Quick Menu</h3>
        <div class="mystery-widget-tabs">
          <button class="mystery-widget-tab active" data-tab="links" type="button">Links</button>
          <button class="mystery-widget-tab" data-tab="notifications" type="button" style="position:relative; display:none;">
            Alerts
            <span class="notification-badge" id="notificationBadge" style="display:none;">0</span>
          </button>
          <button class="mystery-widget-tab" data-tab="chat" type="button">AI Chat</button>
        </div>
        <button class="mystery-widget-tab" data-action="theme" type="button" title="Toggle theme">☾</button>
      </div>
      <div class="mystery-widget-content">
        <div id="linksTab" class="mystery-widget-tab-content">
          <div class="mystery-widget-section">
            <h4 style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#495057;">
              <span class="icon-inline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 7 0l2 2a5 5 0 0 1-7 7l-2-2"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l2-2"/></svg></span>
              Quick Links
            </h4>
            <a href="https://jovylle.com" class="mystery-widget-link" target="_blank">
              <span class="icon-inline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3z"/><path d="M8 7V5h8v2"/></svg></span>
              Portfolio
            </a>
          </div>
          <div class="mystery-widget-section">
            <h4 style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#495057; display:flex; align-items:center; justify-content:space-between;">
              <span class="icon-inline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></span>
              <span style="flex:1">Reaction Test</span>
              <button class="play-button" type="button" style="padding:4px 8px; background:#6c757d; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:11px; font-weight:500;">Play</button>
            </h4>
            <div class="leaderboard" id="leaderboard"></div>
          </div>
        </div>
        <div id="notificationsTab" class="mystery-widget-tab-content" style="display:none;">
          <div class="notifications-container" id="notificationsContainer">
            <div class="notification-empty">No notifications yet</div>
          </div>
        </div>
        <div id="chatTab" class="mystery-widget-tab-content" style="display:none;">
          <div class="chat-container" style="min-height:260px; display:flex; flex-direction:column;">
            <div class="chat-messages" id="chatMessages" style="flex:1; overflow-y:auto; padding:0; background:transparent; border:none; margin-bottom:8px; border-radius:0;"></div>
            <div class="typing-indicator" id="typingIndicator" style="display:none; padding:8px 12px; color:#6c757d; font-style:italic; font-size:13px;">AI is typing...</div>
            <div class="chat-quick" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
              <button class="quick-btn" data-quick="Summarize my highlights">Summarize highlights</button>
              <button class="quick-btn" data-quick="What are my top 3 strengths?">Top 3 strengths</button>
              <button class="quick-btn" data-quick="What can you build for a small business?">What can you build?</button>
            </div>
            <div class="chat-input-container" style="display:flex; gap:8px;">
              <input class="chat-input" id="chatInput" placeholder="Ask about skills, projects, etc..." style="flex:1; padding:8px 12px; border:1px solid #dee2e6; border-radius:6px; font-size:14px; outline:none;" />
              <button class="chat-send" type="button" style="padding:8px 16px; background:#6c757d; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:500;">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(container);
  document.body.appendChild(host);

  // Behavior
  const state = {
    isOpen: false,
    currentTab: 'links',
    skills: ['JavaScript','Vue.js','Nuxt.js','Node.js','TypeScript','Tailwind CSS'],
    projects: [ { name: 'Portfolio' }, { name: 'Reaction Test Game' } ],
    notifications: [],
    unreadCount: 0,
  };

  function setTheme(theme) {
    if (theme === 'dark') host.classList.add('dark-theme'); else host.classList.remove('dark-theme');
    localStorage.setItem('jovylle-widget-theme', theme);
  }
  const savedTheme = localStorage.getItem('jovylle-widget-theme');
  const initTheme = initialThemeAttr || savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(initTheme);

  const button = shadow.querySelector('.mystery-widget-button');
  const panel = shadow.getElementById('widgetContainer');
  const tabButtons = shadow.querySelectorAll('.mystery-widget-tab[data-tab]');
  const themeBtn = shadow.querySelector('[data-action="theme"]');
  const playBtn = shadow.querySelector('.play-button');
  const chatSendBtn = shadow.querySelector('.chat-send');
  const chatInput = shadow.getElementById('chatInput');
  const chatMessages = shadow.getElementById('chatMessages');
  const typingIndicator = shadow.getElementById('typingIndicator');
  const highlightsList = shadow.getElementById('highlightsList');
  const quickButtons = shadow.querySelectorAll('.quick-btn[data-quick]');
  const notificationsContainer = shadow.getElementById('notificationsContainer');
  const notificationBadge = shadow.getElementById('notificationBadge');

  function open() { state.isOpen = true; panel.classList.add('open'); button.setAttribute('aria-expanded','true'); }
  function close() { state.isOpen = false; panel.classList.remove('open'); button.setAttribute('aria-expanded','false'); }
  function toggle() { state.isOpen ? close() : open(); }

  button.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener('click', (e) => {
    const path = e.composedPath ? e.composedPath() : [];
    const clickedInside = Array.isArray(path) ? path.includes(host) : host.contains(e.target);
    if (state.isOpen && !clickedInside) close();
  });

  tabButtons.forEach((tb) => {
    tb.addEventListener('click', () => switchTab(tb.getAttribute('data-tab')));
  });

  function switchTab(tab) {
    state.currentTab = tab;
    tabButtons.forEach(el => el.classList.remove('active'));
    const current = Array.from(tabButtons).find(el => el.getAttribute('data-tab') === tab);
    if (current) current.classList.add('active');
    shadow.getElementById('linksTab').style.display = tab === 'links' ? 'block' : 'none';
    shadow.getElementById('notificationsTab').style.display = tab === 'notifications' ? 'block' : 'none';
    shadow.getElementById('chatTab').style.display = tab === 'chat' ? 'block' : 'none';
    // Mark notifications as read when viewing
    if (tab === 'notifications') {
      state.unreadCount = 0;
      updateNotificationBadge();
      saveNotificationsToStorage();
    }
  }

  function svgMoon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'}
  function svgSun(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'}
  // initialize theme icon
  themeBtn.innerHTML = (initTheme === 'dark') ? svgSun() : svgMoon();
  themeBtn.addEventListener('click', () => {
    const current = localStorage.getItem('jovylle-widget-theme') || initTheme || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
    themeBtn.innerHTML = (next === 'dark') ? svgSun() : svgMoon();
  });

  playBtn.addEventListener('click', () => window.open('https://fast.jovylle.com', '_blank'));

  // Apply position to button and panel inside the host
  (function applyPosition(){
    // Reset
    Object.assign(button.style, { top: '', bottom: '', left: '', right: '' });
    Object.assign(panel.style, { top: '', bottom: '', left: '', right: '' });
    if (position === 'top-right') {
      button.style.top = '0';
      button.style.right = '0';
      panel.style.top = '80px';
      panel.style.right = '0';
    } else if (position === 'top-left') {
      button.style.top = '0';
      button.style.left = '0';
      panel.style.top = '80px';
      panel.style.left = '0';
    } else if (position === 'bottom-left') {
      button.style.bottom = '0';
      button.style.left = '0';
      panel.style.bottom = '80px';
      panel.style.left = '0';
    } else { // bottom-right default
      button.style.bottom = '0';
      button.style.right = '0';
      panel.style.bottom = '80px';
      panel.style.right = '0';
    }
  })();

  async function loadLeaderboard() {
    const el = shadow.getElementById('leaderboard');
    el.innerHTML = '<div style="text-align:center;color:#6c757d;font-size:16px;padding:4px;">Loading leaderboard...</div>';
    try {
      let data;
      try {
        const r = await fetch('/api/leaderboard');
        if (!r.ok) throw new Error('local api');
        data = await r.json();
      } catch {
        const rr = await fetch('https://fast.jovylle.com/reaction/top.json');
        data = await rr.json();
      }
      const top = (data.top || []).slice(0,3);
      if (!top.length) throw new Error('no data');
      el.innerHTML = top.map((p,i)=>`<div class="leaderboard-row"><span class="rank-num">${i+1}.</span><span>${p.playerName}</span><span>${p.ms}ms</span></div>`).join('');
    } catch {
      el.innerHTML = '<div style="text-align:center;color:#dc3545;font-size:16px;padding:4px;">Leaderboard unavailable</div>';
    }
  }
  loadLeaderboard();

  async function loadHighlights() {
    try {
      const res = await fetch('https://pocket.uft1.com/data/highlights.json');
      const data = await res.json();
      state.highlights = Array.isArray(data.highlights) ? data.highlights : [];
      if (highlightsList) {
        const top = state.highlights.slice(0, 3);
        highlightsList.innerHTML = top.map(h => `
          <a ${h.link ? `href="${h.link}" target="_blank"` : ''} class="mystery-widget-link">
            <strong>${h.title}</strong> · <span style="color:#6c757d;">${h.tag || ''}</span>
          </a>
        `).join('');
      }
    } catch (e) {
      if (highlightsList) highlightsList.innerHTML = '<div style="color:#6c757d; font-size:14px;">Highlights unavailable</div>';
    }
  }
  loadHighlights();

  async function sendChatMessage() {
    const message = chatInput.value.trim(); if (!message) return;
    addChatMessage(message, 'user'); chatInput.value = ''; chatSendBtn.disabled = true; typingIndicator.style.display = 'block';
    try {
      let apiUrl = '/.netlify/functions/chatbot';
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') apiUrl = '/api/chatbot';
      const resp = await fetch(apiUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message, skills: state.skills, projects: state.projects, highlights: state.highlights }) });
      const data = await resp.json();
      const ai = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
      typingIndicator.style.display = 'none';
      addChatMessage(ai, 'assistant');
    } catch (e) {
      typingIndicator.style.display = 'none';
      addChatMessage("Sorry, I'm having trouble right now.", 'assistant');
    } finally { chatSendBtn.disabled = false; }
  }
  function addChatMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'chat-message ' + who;
    div.textContent = text;
    chatMessages.appendChild(div);
    // Ensure newest message is visible within the scroll container only
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  chatSendBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e)=>{ if (e.key === 'Enter') sendChatMessage(); });
  quickButtons.forEach(btn => btn.addEventListener('click', () => { chatInput.value = btn.getAttribute('data-quick') || ''; sendChatMessage(); }));

  // Apply configuration flags
  (function applyConfig(){
    if (hideChat) {
      const chatTabBtn = Array.from(tabButtons).find(b=>b.getAttribute('data-tab')==='chat');
      if (chatTabBtn) chatTabBtn.style.display = 'none';
      shadow.getElementById('chatTab').style.display = 'none';
      switchTab('links');
    }
    if (hidePortfolio) {
      const link = shadow.querySelector('.mystery-widget-link');
      if (link) link.style.display = 'none';
    }
    if (showOnly) {
      const allowed = showOnly.split(',');
      if (!allowed.includes('chat')) {
        const chatTabBtn = Array.from(tabButtons).find(b=>b.getAttribute('data-tab')==='chat');
        if (chatTabBtn) chatTabBtn.style.display = 'none';
        shadow.getElementById('chatTab').style.display = 'none';
      }
    }
    // Hide quick link pointing to the current host
    Array.from(shadow.querySelectorAll('a.mystery-widget-link[href]')).forEach(a => {
      try {
        const href = a.getAttribute('href');
        const targetHost = new URL(href, location.href).hostname.replace(/^www\./,'');
        const currentHost = location.hostname.replace(/^www\./,'');
        if (targetHost === currentHost) {
          a.style.display = 'none';
        }
      } catch {}
    });
  })();

  // ===== Notification System =====
  function updateNotificationBadge() {
    const notifTab = Array.from(tabButtons).find(b => b.getAttribute('data-tab') === 'notifications');
    
    // Hide entire tab if no notifications
    if (state.notifications.length === 0) {
      if (notifTab) notifTab.style.display = 'none';
      notificationBadge.style.display = 'none';
      // Switch to links tab if currently on notifications
      if (state.currentTab === 'notifications') {
        switchTab('links');
      }
      return;
    }
    
    // Show tab when there are notifications
    if (notifTab) notifTab.style.display = '';
    
    // Update badge
    if (state.unreadCount > 0) {
      notificationBadge.textContent = state.unreadCount > 99 ? '99+' : state.unreadCount;
      notificationBadge.style.display = 'block';
    } else {
      notificationBadge.style.display = 'none';
    }
  }

  function saveNotificationsToStorage() {
    try {
      localStorage.setItem('jovylle-widget-notifications', JSON.stringify({
        notifications: state.notifications,
        unreadCount: state.unreadCount
      }));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage:', e);
    }
  }

  function loadNotificationsFromStorage() {
    try {
      const saved = localStorage.getItem('jovylle-widget-notifications');
      if (saved) {
        const data = JSON.parse(saved);
        state.notifications = data.notifications || [];
        state.unreadCount = data.unreadCount || 0;
        renderNotifications();
        updateNotificationBadge();
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage:', e);
    }
  }

  function renderNotifications() {
    if (state.notifications.length === 0) {
      notificationsContainer.innerHTML = '<div class="notification-empty">No notifications yet</div>';
      return;
    }
    
    notificationsContainer.innerHTML = state.notifications.map((notif, index) => {
      const timeStr = notif.timestamp ? new Date(notif.timestamp).toLocaleString() : '';
      return `
        <div class="notification-item ${notif.type || 'info'}" data-notif-id="${notif.id}">
          <div class="notification-item-header">
            <div class="notification-item-title">${notif.title || 'Notification'}</div>
            <button class="notification-item-close" data-notif-index="${index}" type="button" aria-label="Close notification">×</button>
          </div>
          ${notif.message ? `<div class="notification-item-body">${notif.message}</div>` : ''}
          ${timeStr ? `<div class="notification-item-time">${timeStr}</div>` : ''}
        </div>
      `;
    }).join('');
    
    // Add close button handlers
    notificationsContainer.querySelectorAll('.notification-item-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-notif-index'));
        removeNotification(index);
      });
    });
  }

  function addNotification(notification) {
    // Validate notification object
    if (!notification || typeof notification !== 'object') {
      console.error('Invalid notification object');
      return;
    }
    
    const notif = {
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: notification.type || 'info', // info, success, warning, error
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: notification.timestamp || Date.now(),
      persistent: notification.persistent !== false, // default true
    };
    
    state.notifications.unshift(notif); // Add to beginning
    state.unreadCount++;
    
    // Limit to 50 notifications
    if (state.notifications.length > 50) {
      state.notifications = state.notifications.slice(0, 50);
    }
    
    renderNotifications();
    updateNotificationBadge();
    saveNotificationsToStorage();
    
    // Auto-remove non-persistent notifications after 10 seconds if not viewing
    if (!notif.persistent && state.currentTab !== 'notifications') {
      setTimeout(() => {
        const idx = state.notifications.findIndex(n => n.id === notif.id);
        if (idx !== -1) removeNotification(idx);
      }, 10000);
    }
    
    return notif.id;
  }

  function removeNotification(indexOrId) {
    let index = indexOrId;
    if (typeof indexOrId === 'string') {
      index = state.notifications.findIndex(n => n.id === indexOrId);
    }
    
    if (index >= 0 && index < state.notifications.length) {
      state.notifications.splice(index, 1);
      renderNotifications();
      updateNotificationBadge();
      saveNotificationsToStorage();
    }
  }

  function clearAllNotifications() {
    state.notifications = [];
    state.unreadCount = 0;
    renderNotifications();
    updateNotificationBadge();
    saveNotificationsToStorage();
  }

  function getNotifications() {
    return [...state.notifications];
  }

  // Load saved notifications on init
  loadNotificationsFromStorage();
  
  // Hide Alerts tab initially if no notifications
  updateNotificationBadge();

  // Expose minimal API
  window.JovylleInlineWidget = {
    open, close, toggle, switchTab, setTheme,
    // Notification API
    addNotification,
    removeNotification,
    clearAllNotifications,
    getNotifications,
    get state() { return { ...state }; }
  };

  if (openOnLoad) open();
})();


