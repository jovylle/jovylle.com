// Jovylle Quick Menu Widget Embed Script - Self-Contained & Style-Isolated
(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.jovylleWidgetLoaded) {
        return;
    }
    window.jovylleWidgetLoaded = true;
    
    // Get script element to read data attributes
    const script = document.currentScript;
    const position = script.getAttribute('data-position') || 'bottom-right';
    const size = script.getAttribute('data-size') || 'medium';
    const hideChat = script.getAttribute('data-hide-chat') === 'true';
    const hidePortfolio = script.getAttribute('data-hide-portfolio') === 'true';
    const showOnly = script.getAttribute('data-show-only');
    
    // Build URL with parameters (use local when developing, production from script origin)
    const scriptUrl = new URL(script.src, window.location.href);
    const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname) || /localhost|127\.0\.0\.1/.test(scriptUrl.hostname);
    const baseUrl = isLocal ? '/widget/mystery-widget.html' : `${scriptUrl.origin}/widget/mystery-widget.html`;
    let url = `${baseUrl}?position=${position}&size=${size}`;
    
    if (hideChat) url += '&hideChat=true';
    if (hidePortfolio) url += '&hidePortfolio=true';
    if (showOnly) url += `&showOnly=${encodeURIComponent(showOnly)}`;
    
    // Create iframe with bulletproof styling
    const sizeMap = {
        small: { w: 280, h: 380 },
        medium: { w: 320, h: 420 },
        large: { w: 360, h: 520 }
    };
    const dims = sizeMap[size] || sizeMap.medium;
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.width = String(dims.w);
    iframe.height = String(dims.h);
    iframe.frameBorder = '0';
    iframe.allowTransparency = 'true';
    
    // Position styles based on position parameter
    const positionStyles = {
        'bottom-right': 'bottom: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;',
        'top-right': 'top: 20px; right: 20px;',
        'top-left': 'top: 20px; left: 20px;'
    };
    
    // Bulletproof iframe styling - won't be affected by host CSS
    iframe.style.cssText = `
        position: fixed !important;
        ${positionStyles[position] || positionStyles['bottom-right']}
        z-index: 2147483647 !important;
        border: none !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
        background: transparent !important;
        margin: 0 !important;
        padding: 0 !important;
        outline: none !important;
        resize: none !important;
        overflow: hidden !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
        animation: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        mix-blend-mode: normal !important;
        isolation: isolate !important;
        contain: none !important;
        will-change: auto !important;
        pointer-events: auto !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        width: ${dims.w}px !important;
        height: ${dims.h}px !important;
    `;
    
    // Add to page
    document.body.appendChild(iframe);
    
    // Optional: Add close button functionality with bulletproof styling
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('type', 'button');
    
    // Position close button based on widget position
    const offset = (dims.h + 40);
    const closeBtnStyles = {
        'bottom-right': `bottom: ${offset}px; right: 20px;`,
        'bottom-left': `bottom: ${offset}px; left: 20px;`,
        'top-right': `top: ${offset}px; right: 20px;`,
        'top-left': `top: ${offset}px; left: 20px;`
    };
    
    // Bulletproof close button styling
    closeBtn.style.cssText = `
        position: fixed !important;
        ${closeBtnStyles[position] || closeBtnStyles['bottom-right']}
        z-index: 2147483648 !important;
        width: 30px !important;
        height: 30px !important;
        border-radius: 50% !important;
        background: #dc3545 !important;
        color: white !important;
        border: none !important;
        cursor: pointer !important;
        font-size: 16px !important;
        font-weight: bold !important;
        display: none !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
        outline: none !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        transition: all 0.2s ease !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        line-height: 1 !important;
        text-align: center !important;
        vertical-align: middle !important;
    `;
    
    closeBtn.onclick = function() {
        iframe.style.display = 'none';
        closeBtn.style.display = 'none';
    };
    
    document.body.appendChild(closeBtn);
    
    // Show close button when iframe is visible
    iframe.onload = function() {
        closeBtn.style.display = 'flex';
    };
    
    console.log(`🚀 Jovylle Quick Menu Widget loaded successfully! Position: ${position}, Size: ${size}, HideChat: ${hideChat}, HidePortfolio: ${hidePortfolio}, ShowOnly: ${showOnly || 'all'}`);
})();
