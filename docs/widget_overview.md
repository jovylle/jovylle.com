# Jovylle Widget - Overview & Context

**Official Name:** Jovylle Widget (formerly "Quick Menu Widget")  
**Version:** 2.0  
**Release:** November 2025

## Widget Goals & Design Philosophy

### Primary Objective
Create a **subtle, lowkey widget** that prioritizes **viewer interest over self-promotion**. The widget should feel like a helpful tool rather than an advertisement.

### Target Audience Strategy

#### For Casual Visitors
- **Focus**: Fun, engaging content (reaction test game, leaderboard)
- **Goal**: Provide entertainment and value
- **Approach**: Make the game the star, not the developer

#### For Employers
- **Focus**: Subtle portfolio access without being pushy
- **Goal**: Professional credibility through understated presentation
- **Approach**: Portfolio link available but not flashy or obvious

### Design Principles
- **Minimal**: Clean, uncluttered interface
- **Neutral**: Subtle colors that blend with any website
- **Compact**: Efficient use of space
- **Functional**: Every element serves a purpose

## Technical Architecture

### Core Technologies
- **HTML/CSS/JavaScript**: Standalone, no dependencies
- **OpenAI GPT-3.5-turbo**: AI chat backend (via Netlify functions)
- **Reaction Test API**: Live leaderboard from `fast.jovylle.com`

### File Structure
```
public/widget/
├── mystery-widget.html    # Main widget (embeddable)
└── embed.js              # JavaScript embed script

netlify/functions/
└── chatbot.js            # AI chat backend

server/api/
└── leaderboard.js        # Leaderboard proxy (local dev)
```

### Security Model
- **iframe embedding**: Complete sandboxing for security
- **JavaScript embedding**: Convenience option for trusted sites
- **CORS handling**: Proper cross-origin request management

## Features

### Current Features
1. **Reaction Test Leaderboard**: Top 3 players with real-time data
2. **AI Chat**: Portfolio-focused assistant using GPT-3.5-turbo
3. **Quick Links**: Portfolio access for employers
4. **Responsive Design**: Works on all devices
5. **Tab Navigation**: Links and AI Chat tabs

### Current Features (Updated)
1. **Configurable Positioning**: 4 corner positions
2. **Size Options**: Small, medium, large
3. **Theme Toggle**: Light/dark mode
4. **Analytics**: Event tracking for insights
5. **Content Configuration**: Hide/show specific elements (chat, portfolio, sections)
6. **Smart Embedding**: Different configurations for different use cases
7. **Notification System**: Host websites can push alerts/messages to visitors
8. **AI Chat (GPT-4o-mini)**: Upgraded from GPT-3.5-turbo for better responses at lower cost

## Embedding Methods

### Method 1: iframe (Recommended - Most Secure)
```html
<iframe 
    src="https://jovylle.com/widget/mystery-widget.html?position=bottom-right&size=medium" 
    width="320" height="500" frameborder="0"
    style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
</iframe>
```

### Method 2: JavaScript (Convenience Option - iframe)
```html
<script 
    src="https://jovylle.com/widget/embed.js" 
    data-position="top-left" 
    data-size="large">
</script>
```

### Method 3: JavaScript Inline (No iframe, Shadow DOM)
```html
<script 
  src="https://jovylle.com/widget/embed-inline.js"
  data-position="top-right"
  data-size="medium"
  data-density="comfortable"
  data-theme="light"
  data-hide-chat="false"
  data-open="false"
  async
></script>
```

Inline API (optional):
```html
<script>
  // After script loads
  // Widget Control
  // window.JovylleInlineWidget.open()
  // window.JovylleInlineWidget.close()
  // window.JovylleInlineWidget.toggle()
  // window.JovylleInlineWidget.switchTab('links'|'notifications'|'chat')
  // window.JovylleInlineWidget.setTheme('light'|'dark')
  
  // Notification API
  // window.JovylleInlineWidget.addNotification({
  //   type: 'info',        // 'info', 'success', 'warning', 'error'
  //   title: 'Hello!',     // Notification title
  //   message: 'Welcome',  // Notification message
  //   persistent: true     // false = auto-remove after 10s
  // })
  // window.JovylleInlineWidget.removeNotification(id|index)
  // window.JovylleInlineWidget.clearAllNotifications()
  // window.JovylleInlineWidget.getNotifications() // returns array
  
  // State (read-only)
  // window.JovylleInlineWidget.state
<\/script>
```

Density options:
- comfortable: 8/12 px paddings, relaxed spacing (default)
- compact: smaller paddings for tight layouts

## Configuration Options

### Position Parameters
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

### Size Parameters
- `small`: 280px width, 350px max-height
- `medium`: 320px width, 400px max-height (default)
- `large`: 360px width, 500px max-height

### Theme Options
- `light`: Current neutral theme (default)
- `dark`: Dark backgrounds with light text

### Content Configuration
- `hideChat`: true/false - Hide AI Chat tab entirely
- `hidePortfolio`: true/false - Hide portfolio link from Quick Links
- `showOnly`: comma-separated - Only show specified sections (leaderboard,links,chat)
- `feedbackUrl`: URL string - Show custom feedback link in Quick Links (host-provided URL)

## Development Context

### Why This Approach?
1. **Trust Building**: Subtle presentation builds credibility
2. **User Experience**: Fun content keeps visitors engaged
3. **Professional Image**: Understated approach appeals to employers
4. **Security First**: iframe embedding protects both parties

### Success Metrics
- Widget engagement (opens, tab switches)
- Game play button clicks
- Portfolio link clicks (employer interest)
- AI chat interactions

## Notification System

### How It Works
Host websites can use the widget as a **notification center** to display important messages, alerts, or updates to visitors. Perfect for:
- System status updates
- Feature announcements
- User-specific messages
- Promotional alerts
- Error/warning notifications

### Notification Types
1. **info** (blue) - General information
2. **success** (green) - Success messages
3. **warning** (yellow) - Warnings or cautions
4. **error** (red) - Error messages

### Usage Examples

**Add a notification:**
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'success',
  title: 'Welcome!',
  message: 'Thanks for visiting our site.',
  persistent: false  // Auto-remove after 10s
});
```

**Show a system alert:**
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'warning',
  title: 'Maintenance Notice',
  message: 'System maintenance scheduled for tonight at 2 AM.',
  persistent: true  // Stays until user dismisses
});
```

**Remove a notification:**
```javascript
const id = window.JovylleInlineWidget.addNotification({...});
window.JovylleInlineWidget.removeNotification(id);
```

**Clear all notifications:**
```javascript
window.JovylleInlineWidget.clearAllNotifications();
```

### Notification Features
- **Badge Counter**: Unread notification count shown on Alerts tab
- **Smart Tab**: Alerts tab auto-hides when there are no notifications (keeps UI clean!)
- **Persistence**: Notifications saved to localStorage
- **Auto-dismiss**: Non-persistent notifications auto-remove after 10s
- **Limit**: Max 50 notifications (oldest removed first)
- **Dark Mode**: Notifications adapt to theme
- **Timestamps**: Each notification shows when it was created

## Technology Updates

### AI Chat Model
- **Current**: GPT-4o-mini (OpenAI)
- **Previous**: GPT-3.5-turbo
- **Benefits**: Better responses, lower cost, improved context understanding
- **Cost**: ~60% cheaper than GPT-3.5-turbo
- **Performance**: Significantly better at nuanced conversations

## Future Considerations

### Potential Enhancements
- Custom branding options
- Additional game integrations
- Social sharing features
- Advanced analytics dashboard
- Notification webhooks for external systems
- Custom notification templates

### Maintenance Notes
- Keep the widget lightweight and fast
- Maintain security-first approach
- Regular updates to game integration
- Monitor AI chat quality and costs (GPT-4o-mini = excellent cost/performance)
- Monitor notification storage limits

---

*This document preserves the context and goals of the Quick Menu Widget for future development sessions.*
