# 🎯 Jovylle Widget

**Official embeddable widget with notifications, AI chat, and more!**

Version: **2.0** | Release: **November 2025**

---

## 📦 What's Inside

This directory contains the **Jovylle Widget** - a powerful, embeddable component for any website.

### Files

- **`index.html`** - Complete documentation & demo page
- **`mystery-widget.html`** - Interactive demo with examples
- **`embed-inline.js`** - Main widget JavaScript (Shadow DOM)
- **`embed.js`** - Alternative iframe-based embed script
- **`NOTIFICATION_API.md`** - API reference guide
- **`README.md`** - This file

---

## 🚀 Quick Start

### 1. Installation

Add this single line to your website (before closing `</body>` tag):

```html
<script 
  src="https://jovylle.com/widget/embed-inline.js"
  data-position="bottom-right"
  data-size="medium"
  async>
</script>
```

### 2. Customize AI Context (Optional)

```html
<script 
  src="https://jovylle.com/widget/embed-inline.js"
  data-title="Help Center"
  data-ai-context="You are an AI for ABC Company. We specialize in..."
  data-feedback-url="https://yoursite.com/feedback"
  async>
</script>
```

### 3. Send Notifications (Optional)

```javascript
window.JovylleInlineWidget.addNotification({
  type: 'success',
  title: 'Welcome!',
  message: 'Thanks for visiting!',
  persistent: true
});
```

That's it! 🎉

---

## ✨ Features

- 🔔 **Smart Notifications** - 4 types with badge on button
- 🤖 **AI Chat (GPT-5.6 Luna)** - Customizable AI assistant at $0.20/$1.20 per 1M tokens
- 💬 **Custom AI Context** - Host websites provide their own context
- 📝 **Markdown Support** - Bold, italic, code, links in responses
- 🎨 **Dark Mode** - Beautiful light & dark themes
- 📱 **Mobile Ready** - Fully responsive
- 🔒 **Style Isolation** - Shadow DOM protection
- 🎯 **Chat-First UI** - Clean, focused interface

---

## 📚 Documentation

**Full Documentation:** `/widget/index.html`

View locally:
```bash
http://localhost:3000/widget/index.html
```

Or visit:
```
https://jovylle.com/widget/
```

---

## 🎮 Live Demos

1. **Documentation & Demo:** [`/widget/index.html`](/widget/index.html)
2. **Interactive Demo:** [`/widget/mystery-widget.html`](/widget/mystery-widget.html)

---

## 🔔 Notification API

### Basic Usage

```javascript
// Add notification
const id = window.JovylleInlineWidget.addNotification({
  type: 'info',      // 'info' | 'success' | 'warning' | 'error'
  title: 'Hello!',   // Required
  message: 'Hi!',    // Optional
  persistent: true   // true = stays, false = auto-dismiss after 10s
});

// Remove notification
window.JovylleInlineWidget.removeNotification(id);

// Clear all
window.JovylleInlineWidget.clearAllNotifications();

// Get all notifications
const notifications = window.JovylleInlineWidget.getNotifications();
```

### Widget Controls

```javascript
// Open/close widget
window.JovylleInlineWidget.open();
window.JovylleInlineWidget.close();
window.JovylleInlineWidget.toggle();

// Switch tabs
window.JovylleInlineWidget.switchTab('links');
window.JovylleInlineWidget.switchTab('notifications');
window.JovylleInlineWidget.switchTab('chat');

// Change theme
window.JovylleInlineWidget.setTheme('dark'); // or 'light'

// Get state
const state = window.JovylleInlineWidget.state;
```

---

## ⚙️ Configuration Options

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-position` | bottom-right, bottom-left, top-right, top-left | bottom-right | Screen position |
| `data-size` | small, medium, large | medium | Widget size |
| `data-theme` | light, dark | auto | Color theme |
| `data-density` | comfortable, compact | comfortable | Spacing |
| `data-open` | true, false | false | Open on load |
| `data-auto-open-on-notifications` | true, false | false | If set, widget opens and switches to the Alerts tab when unread notifications exist |
| `data-title` | Text string | "Widget" | Custom widget title |
| `data-show-leaderboard` | true, false | false | Show Reaction Test leaderboard |
| `data-hide-chat` | true, false | false | Hide AI chat |
| `data-hide-portfolio` | true, false | false | Hide Jovylle.com portfolio link |
| `data-feedback-url` | URL string | none | Custom feedback link |
| `data-ai-context` | Text string | default | Custom AI instructions/context |
| `data-chatbot-endpoint` | URL string | `https://jovylle.com/api/chatbot` | Override the chat API URL; production embeds always hit jovylle.com's backend. Only set this attribute when you need a custom proxy (e.g., local development). |
| `data-notifications-index` | URL string | `https://content.jovylle.com/data/notifications.json` (on `jovylle.com` family, otherwise none) | Endpoint that returns `{ "notifications": [{ "slug": "2026-08-22", ... }] }` — widget then fetches each `slug` at `/data/notifications/<slug>.json`. Legacy `https://content.jovylle.com/notifications/index.json` with `{ "files": [...] }` still works as fallback. |
| `data-notifications-limit` | number | 10 | Total dynamic notifications to fetch/display from the index |
| `data-notification-tags` | csv | | Limit included notifications to entries whose `tags` array contains at least one of these values |
| `data-notification-tab-title` | Text string | "Alerts" | Header text to display while the Notifications tab is active |

By default the widget posts to `https://jovylle.com/api/chatbot`. Use `data-chatbot-endpoint` only if you need a different proxy (for example, pointing to `http://localhost:3000/api/chatbot` while running local tooling). This keeps third-party embeds on other domains hitting the centralized Jovylle backend.

Dynamic notifications default to `https://content.jovylle.com/data/notifications.json` only when the page is on `jovylle.com` or its subdomains; other hosts must opt in by providing `data-notifications-index`. The endpoint returns `{ "notifications": [{ "slug": "2026-08-22", "title": "...", "count": 1, "date": "2026-08-22" }] }` and the widget fetches each bundle at `https://content.jovylle.com/data/notifications/<slug>.json`. Legacy static `https://content.jovylle.com/notifications/index.json` (`{ "files": [...] }`) is still supported.

## 🗂️ Dynamic Notification Index

- The vault now hosts the index at `https://content.jovylle.com/data/notifications.json` that looks like:
  ```json
  {
    "notifications": [
      { "slug": "pinned", "title": "Quick start", "count": 2, "date": "" },
      { "slug": "2026-08-22", "title": "hermes-opencode-acp", "count": 1, "date": "2026-08-22" }
    ]
  }
  ```
- Store each bundle at `https://content.jovylle.com/data/notifications/<slug>.json` and expose `{ "notifications": [/* widget notification objects */] }`. `pinned.json` is now just another slug (`pinned`) in the index and is always fetched.
- Use `data-notifications-index` to point the widget at your index, `data-notifications-limit` to cap how many recent entries are displayed, and `data-notification-tags` to scope alerts per site (e.g., `jovylle.com,all`). Legacy `{ "files": [...] }` with per-file `*.json` at the same directory still works as a fallback.
- Use `data-notification-tab-title` (default `Alerts`) if you want the header to rename itself while showing the notifications tab.

---

## 💡 Use Cases

- Welcome messages for new visitors
- System status updates & alerts
- Feature announcements
- Form submission confirmations
- Error messages & warnings
- Promotional notifications
- Time-sensitive information
- Portfolio showcases

---

## 🎨 Notification Types

| Type | Color | Best For |
|------|-------|----------|
| `info` | Blue | General information, announcements |
| `success` | Green | Success messages, confirmations |
| `warning` | Yellow | Warnings, important notices |
| `error` | Red | Errors, critical alerts |

---

## 🌐 Browser Support

Works in all modern browsers:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

---

## 📊 What's New in v2.0

### Major Features
- ✅ **Chat-First UI** - Clean interface with chat as primary feature
- ✅ **Custom AI Context** - Host websites provide their own AI instructions
- ✅ **Markdown Support** - AI responses support formatting (bold, italic, code, links)
- ✅ **Notification System** - Complete alert system with persistence
- ✅ **GPT-5.6 Luna** - Upgraded from GPT-4o-mini / GPT-5-nano (87% cheaper than GPT-5.4 mini at $0.20/$1.20 per 1M tokens!)
- ✅ **Smart Tab** - Alerts tab auto-hides when empty
- ✅ **Button Badge** - Red alert badge on floating widget button

### Improvements
- Chat-first design (Links tab removed, merged into chat welcome)
- Quick Links embedded in chat (auto-hide when conversation starts)
- Removed generic quick buttons
- Removed leaderboard (cleaner UI)
- Markdown rendering for AI responses
- Better dark mode colors
- Theme toggle icon fix
- Enhanced mobile responsiveness

---

## 📞 Support

- 🌐 **Website:** [jovylle.com](https://jovylle.com)
- 📧 **Email:** hello@jovylle.com
- 📝 **Docs:** [jovylle.com/widget/](https://jovylle.com/widget/)
- 🎮 **Demo:** [jovylle.com/widget/mystery-widget.html](https://jovylle.com/widget/mystery-widget.html)

---

## 📄 License

© 2025 Jovylle Bermudez. All rights reserved.

---

**Made with ❤️ by [Jovylle](https://jovylle.com)**

