# Jovylle Widget - Changelog

**Official Name:** Jovylle Widget  
**Current Version:** 2.1

## August 2026 - Vault + Luna Update 🔧

- **Notifications fix**: Vault moved from `public/notifications/index.json` static export to encrypted CMS at `/data/notifications.json` (index of `{slug}`) + `/data/notifications/<slug>.json` bundles. `embed-inline.js` now handles both formats, normalizes `announcement` → `info`, sorts by `timestamp || date`, and falls back to the legacy URL if the new one 404s. Default changed to `https://content.jovylle.com/data/notifications.json`.
- **Chat model**: `server/api/chatbot.js` now uses `gpt-5.6-luna` ($0.20/$1.20 per 1M, 87% cheaper than GPT-5.4 mini) with `OPENAI_MODEL` env override for both `process.env` and Cloudflare `event.context.cloudflare.env`.
- **Docs**: `widget_overview.md`, `public/widget/README.md`, `content/ecosystem.md` all updated to the new endpoints and Luna pricing.

## November 2025 - Major Update 🚀

### New Features

#### 🔔 Notification System
Host websites can now use the widget as a notification center to display alerts and messages to visitors.

**Features:**
- 4 notification types: info, success, warning, error
- Badge counter showing unread notifications
- Persistent and temporary notifications (auto-dismiss after 10s)
- localStorage persistence across sessions
- Lightweight notification index support (`data-notifications-index`, `data-notifications-limit`, `data-notification-tags`) so alerts can be sourced from a static JSON database with optional filtering.
- Auto-open-on-notifications option so the widget expands to Alerts when unread items are present
- Header now reflects the selected tab (customize via `data-notification-tab-title` for the Alerts view).
- Dark mode support
- Timestamps on all notifications
- Max 50 notifications with automatic cleanup
- Easy-to-use JavaScript API

**Public API Methods:**
```javascript
window.JovylleInlineWidget.addNotification(options)
window.JovylleInlineWidget.removeNotification(id)
window.JovylleInlineWidget.clearAllNotifications()
window.JovylleInlineWidget.getNotifications()
```

#### 🤖 AI Chat Model Upgrade
Upgraded from GPT-4o-mini / GPT-5-nano to **GPT-5.6 Luna (`gpt-5.6-luna`)**

**Benefits:**
- ~87% cheaper than GPT-5.4 mini at $0.20/$1.20 per 1M tokens (cheaper than GPT-4.1 mini)
- Better context understanding
- More nuanced conversations
- Improved response quality
- Lower latency
- Env override via `OPENAI_MODEL` without redeploy

### Files Modified

1. **server/api/chatbot.js** (Cloudflare Pages Function)
   - Updated model from `gpt-5-nano` to `gpt-5.6-luna` with `OPENAI_MODEL` env override
   - Fix: vault notifications moved to `/data/notifications.json` + `/data/notifications/<slug>.json`, legacy `/notifications/index.json` kept as fallback

2. **public/widget/embed-inline.js**
   - Added notification system state management
   - Added notification UI components
   - Added notification badge with counter
   - Added notification styles (light + dark themes)
   - Added localStorage persistence
   - Added public API methods
   - Updated tab switching logic
   - Added auto-dismiss for temporary notifications
   - Added auto-open-on-notifications flag to auto-expand the Alerts tab when unread items exist
- Added static notification index fetching + tag/limit filters so the widget can load alerts from a shared JSON database (`data-notifications-index`, `data-notifications-limit`, `data-notification-tags`).

3. **docs/widget_overview.md**
   - Added notification system documentation
   - Added API usage examples
   - Added technology update section
   - Updated features list

### New Files

1. **public/widget/demo-notifications.html**
   - Interactive demo page for testing notifications
   - Real-world usage examples
   - API code snippets

2. **public/widget/NOTIFICATION_API.md**
   - Complete API reference
   - Quick start guide
   - Best practices
   - Browser support info

3. **docs/CHANGELOG_WIDGET.md** (this file)
   - Version history and changes

### Use Cases

The notification system is perfect for:
- Welcome messages for new visitors
- System status updates
- Feature announcements
- Form submission confirmations
- Error messages and alerts
- Promotional notifications
- Time-sensitive information
- User-specific messages

### Testing

Visit the demo page to test all features:
- Local: `http://localhost:3000/widget/demo-notifications.html`
- Production: `https://jovylle.com/widget/demo-notifications.html`

### Backward Compatibility

✅ All existing functionality preserved
✅ No breaking changes
✅ New features are additive only
✅ Existing widgets will continue to work

### Performance

- Notification system adds minimal overhead (~2KB)
- localStorage used for persistence (lightweight)
- Auto-cleanup prevents memory leaks
- Shadow DOM ensures style isolation

### Security

- Input sanitization on notification content
- XSS protection via Shadow DOM
- localStorage data is domain-specific
- No external dependencies added

---

## Previous Features (Retained)

- Configurable positioning (4 corners)
- Size options (small, medium, large)
- Theme toggle (light/dark)
- Reaction Test Leaderboard
- AI Chat assistant
- Quick Links section
- Content configuration options
- Smart embedding (iframe + inline)
- Analytics ready
- Mobile responsive

---

*Last updated: November 5, 2025*





