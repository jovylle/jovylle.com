// Special version of embed-inline.js WITH leaderboard for jovylle.com home page
// This version includes the Reaction Test leaderboard in the welcome screen

(function() {
  'use strict';
  
  if (window.jovylleInlineWidgetLoaded) return;
  window.jovylleInlineWidgetLoaded = true;

  // Read the existing embed-inline.js and inject it with leaderboard
  const script = document.createElement('script');
  script.src = '/widget/embed-inline.js';
  script.async = true;
  
  // Copy all data attributes from the calling script
  const callingScript = document.currentScript;
  if (callingScript) {
    Array.from(callingScript.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        script.setAttribute(attr.name, attr.value);
      }
    });
  }
  
  // Mark this as the home version
  script.setAttribute('data-show-leaderboard', 'true');
  
  document.body.appendChild(script);
  
  // After widget loads, inject leaderboard HTML
  const checkWidget = setInterval(() => {
    if (window.JovylleInlineWidget) {
      clearInterval(checkWidget);
      console.log('🎮 Widget API detected, preparing to inject leaderboard...');
      
      setTimeout(() => {
        try {
          // Find the widget's shadow root
          const widgetHost = document.querySelector('[data-jovylle-inline-widget]');
          if (!widgetHost || !widgetHost.shadowRoot) {
            console.warn('🎮 Widget host or shadow root not found');
            return;
          }
          
          const shadow = widgetHost.shadowRoot;
          const chatWelcome = shadow.getElementById('chatWelcome');
          
          if (!chatWelcome) {
            console.warn('🎮 chatWelcome element not found in shadow DOM');
            return;
          }
          
          console.log('🎮 Found chatWelcome, injecting leaderboard...');
          
          // Create leaderboard section
          const leaderboardSection = document.createElement('div');
          leaderboardSection.className = 'mystery-widget-section';
          leaderboardSection.style.marginTop = '12px';
          leaderboardSection.innerHTML = `
            <h4 style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#495057; display:flex; align-items:center; justify-content:space-between;">
              <span class="icon-inline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
              </span>
              <span style="flex:1">Reaction Test</span>
              <button class="play-button" type="button" style="padding:4px 8px; background:#6c757d; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:11px; font-weight:500;">Play</button>
            </h4>
            <div class="leaderboard" id="homeLeaderboard">Loading...</div>
          `;
          
          // Insert leaderboard after the Quick Links section
          chatWelcome.appendChild(leaderboardSection);
          console.log('🎮 Leaderboard HTML injected successfully');
          
          // Add play button handler
          const playBtn = leaderboardSection.querySelector('.play-button');
          if (playBtn) {
            playBtn.addEventListener('click', () => window.open('https://fast.jovylle.com', '_blank'));
          }
          
          // Load leaderboard data
          const leaderboardEl = shadow.getElementById('homeLeaderboard');
          if (leaderboardEl) {
            loadLeaderboard(leaderboardEl);
          } else {
            console.warn('🎮 homeLeaderboard element not found after injection');
          }
        } catch (e) {
          console.error('🎮 Error adding leaderboard:', e);
        }
      }, 1000);
    }
  }, 100);
  
  async function loadLeaderboard(el) {
    if (!el) return;
    
    el.innerHTML = '<div style="text-align:center;color:#6c757d;font-size:12px;padding:4px;">Loading...</div>';
    
    try {
      let data;
      
      // Try local API first
      try {
        const r = await fetch('/api/leaderboard');
        if (r.ok) {
          data = await r.json();
        }
      } catch {}
      
      // Fallback to direct API
      if (!data) {
        const r = await fetch('https://fast.jovylle.com/reaction/top.json');
        data = await r.json();
      }
      
      const top = (data.top || []).slice(0, 3);
      
      if (!top.length) throw new Error('no data');
      
      el.innerHTML = top.map((p, i) => `
        <div class="leaderboard-row">
          <span class="rank-num">${i + 1}.</span>
          <span>${p.playerName}</span>
          <span>${p.ms}ms</span>
        </div>
      `).join('');
      
    } catch (err) {
      el.innerHTML = '<div style="text-align:center;color:#dc3545;font-size:12px;padding:4px;">Leaderboard unavailable</div>';
    }
  }
  
  console.log('🎮 Home version with leaderboard loaded');
})();

