/**
 * Jovylle Widget Embed Script
 * Simple one-liner to embed the widget on any website
 * 
 * Usage: Just add this script tag to any website:
 * <script src="https://your-domain.com/widget/embed.js"></script>
 */

(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.jovylleWidgetLoaded) {
        return;
    }
    window.jovylleWidgetLoaded = true;

    // Configuration
    const config = {
        // You can change this to your actual domain
        widgetUrl: 'https://jovylle.com/widget/jovylle-widget.html',
        // Or use relative path if hosting on same domain
        // widgetUrl: '/widget/jovylle-widget.html',
        
        // Widget position (can be customized)
        position: {
            bottom: '20px',
            right: '20px'
        },
        
        // Widget size
        size: {
            button: '60px',
            panel: '320px'
        }
    };

    // Create iframe container
    function createWidget() {
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'jovylle-widget-container';
        widgetContainer.style.cssText = `
            position: fixed;
            bottom: ${config.position.bottom};
            right: ${config.position.right};
            width: ${config.size.button};
            height: ${config.size.button};
            z-index: 9999;
            border: none;
            pointer-events: none;
        `;

        const iframe = document.createElement('iframe');
        iframe.src = config.widgetUrl;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            pointer-events: auto;
            border-radius: 50%;
            overflow: hidden;
        `;
        
        // Allow iframe to expand when panel opens
        iframe.onload = function() {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
                const panel = iframeDoc.querySelector('.jovylle-widget-panel');
                if (panel) {
                    const observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                const isOpen = panel.classList.contains('open');
                                if (isOpen) {
                                    // Expand iframe when panel is open
                                    widgetContainer.style.width = config.size.panel;
                                    widgetContainer.style.height = 'auto';
                                    widgetContainer.style.borderRadius = '16px';
                                    iframe.style.borderRadius = '16px';
                                } else {
                                    // Collapse iframe when panel is closed
                                    widgetContainer.style.width = config.size.button;
                                    widgetContainer.style.height = config.size.button;
                                    widgetContainer.style.borderRadius = '50%';
                                    iframe.style.borderRadius = '50%';
                                }
                            }
                        });
                    });
                    observer.observe(panel, { attributes: true });
                }
            }
        };

        widgetContainer.appendChild(iframe);
        document.body.appendChild(widgetContainer);
    }

    // Initialize widget
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createWidget);
        } else {
            createWidget();
        }
    }

    // Start the widget
    init();
})();
